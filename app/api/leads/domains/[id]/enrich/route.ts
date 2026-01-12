import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
} from '@/lib/api-response';
import { calculateLeadScore, getLeadTier } from '@/lib/lead-scoring';
import { notifyLeadStatusChange, notifyHighValueLead } from '@/lib/websocket-server';
import axios from 'axios';

// POST /api/leads/domains/[id]/enrich - Enrich domain lead data
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'update')) {
      return forbiddenResponse();
    }

    // Get the domain lead
    const leads = await query('SELECT * FROM domain_leads WHERE id = $1', [params.id]);

    if (leads.length === 0) {
      return notFoundResponse('Domain lead not found');
    }

    const lead = leads[0];
    const enrichmentData: any = {};

    // Try to fetch WHOIS data if Whoxy API key is configured
    if (process.env.WHOXY_API_KEY) {
      try {
        const whoisResponse = await axios.get(
          `https://api.whoxy.com/?key=${process.env.WHOXY_API_KEY}&whois=${lead.domain}`
        );

        if (whoisResponse.data && whoisResponse.data.status === 1) {
          enrichmentData.whoisData = {
            registrar: whoisResponse.data.registrar_name,
            registrationDate: whoisResponse.data.create_date,
            expirationDate: whoisResponse.data.expiry_date,
            nameServers: whoisResponse.data.name_servers || [],
            registrantEmail: whoisResponse.data.contact_email,
            registrantOrg: whoisResponse.data.registrant_name,
            registrantCountry: whoisResponse.data.registrant_country,
          };
        }
      } catch (error) {
        console.error('Whoxy API error:', error);
      }
    }

    // Try to fetch emails using Hunter.io if API key is configured
    if (process.env.HUNTER_API_KEY) {
      try {
        const hunterResponse = await axios.get(
          `https://api.hunter.io/v2/domain-search?domain=${lead.domain}&api_key=${process.env.HUNTER_API_KEY}`
        );

        if (hunterResponse.data && hunterResponse.data.data) {
          const emails = hunterResponse.data.data.emails.map((e: any) => e.value);
          enrichmentData.enrichmentData = {
            emails: emails.slice(0, 5), // Limit to 5 emails
            enrichedAt: new Date().toISOString(),
            source: 'hunter',
          };
        }
      } catch (error) {
        console.error('Hunter API error:', error);
      }
    }

    // Calculate lead score using the advanced scoring algorithm
    const leadData = {
      ...lead,
      whoisData: enrichmentData.whoisData || lead.whois_data,
      enrichmentData: enrichmentData.enrichmentData || lead.enrichment_data,
    };
    const leadScore = calculateLeadScore(leadData);
    const leadTier = getLeadTier(leadScore);

    // Update the domain lead with enriched data
    const updated = await query(
      `UPDATE domain_leads SET
        whois_data = $1,
        enrichment_data = $2,
        lead_score = $3,
        status = CASE WHEN status = 'new' THEN 'enriched' ELSE status END,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [
        enrichmentData.whoisData ? JSON.stringify(enrichmentData.whoisData) : lead.whois_data,
        enrichmentData.enrichmentData ? JSON.stringify(enrichmentData.enrichmentData) : lead.enrichment_data,
        leadScore,
        params.id,
      ]
    );

    const updatedLead = updated[0];

    // Send notifications
    if (lead.status !== updatedLead.status) {
      notifyLeadStatusChange(updatedLead, lead.status, updatedLead.status);
    }

    // Notify if this is a high-value lead (score >= 80)
    if (leadTier.tier === 'hot' && updatedLead.assigned_to) {
      notifyHighValueLead(updatedLead, updatedLead.assigned_to);
    }

    return successResponse(
      updatedLead,
      'Domain lead enriched successfully'
    );
  } catch (error: any) {
    console.error('Enrich domain lead error:', error);
    return errorResponse(error.message || 'Failed to enrich domain lead', 500);
  }
}
