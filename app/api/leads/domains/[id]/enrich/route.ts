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

    // Calculate lead score based on enriched data
    let leadScore = lead.lead_score || 0;

    if (enrichmentData.whoisData) {
      leadScore += 20; // Has WHOIS data
    }

    if (enrichmentData.enrichmentData?.emails?.length > 0) {
      leadScore += 30; // Has contact emails
    }

    // Update the domain lead with enriched data
    const updated = await query(
      `UPDATE domain_leads SET
        whois_data = $1,
        enrichment_data = $2,
        lead_score = $3,
        status = CASE WHEN status = 'new' THEN 'enriched' ELSE status END
       WHERE id = $4
       RETURNING *`,
      [
        enrichmentData.whoisData ? JSON.stringify(enrichmentData.whoisData) : null,
        enrichmentData.enrichmentData ? JSON.stringify(enrichmentData.enrichmentData) : null,
        Math.min(leadScore, 100), // Cap at 100
        params.id,
      ]
    );

    return successResponse(
      updated[0],
      'Domain lead enriched successfully'
    );
  } catch (error: any) {
    console.error('Enrich domain lead error:', error);
    return errorResponse(error.message || 'Failed to enrich domain lead', 500);
  }
}
