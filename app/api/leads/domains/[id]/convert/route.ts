import { NextRequest } from 'next/server';
import { query, transaction } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
} from '@/lib/api-response';

// POST /api/leads/domains/[id]/convert - Convert lead to CRM company/contact
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'update') ||
        !hasPermission(user.role, 'companies', 'create')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const {
      company_name,
      company_industry,
      company_size,
      contact_first_name,
      contact_last_name,
      contact_email,
      contact_job_title,
      create_contact,
    } = body;

    // Get the lead
    const leads = await query('SELECT * FROM domain_leads WHERE id = $1', [params.id]);

    if (leads.length === 0) {
      return notFoundResponse('Domain lead not found');
    }

    const lead = leads[0];

    // Check if already converted
    if (lead.company_id) {
      return errorResponse('Lead has already been converted', 400);
    }

    // Use transaction to create company and optionally contact
    const result = await transaction(async (client) => {
      // Parse stored JSON data
      const whoisData = lead.whois_data ?
        (typeof lead.whois_data === 'string' ? JSON.parse(lead.whois_data) : lead.whois_data) : null;
      const enrichmentData = lead.enrichment_data ?
        (typeof lead.enrichment_data === 'string' ? JSON.parse(lead.enrichment_data) : lead.enrichment_data) : null;

      // Create company
      const companyResult = await client.query(
        `INSERT INTO companies (
          name,
          website,
          industry,
          size,
          owner_id,
          status,
          phone,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, 'prospect', $6, NOW())
        RETURNING *`,
        [
          company_name || whoisData?.registrantOrg || lead.domain,
          `https://${lead.domain}`,
          company_industry || enrichmentData?.industry || 'Unknown',
          company_size || 'small',
          user.userId,
          enrichmentData?.phones?.[0] || null,
        ]
      );

      const company = companyResult.rows[0];
      let contact = null;

      // Optionally create contact
      if (create_contact && contact_email) {
        const contactResult = await client.query(
          `INSERT INTO contacts (
            company_id,
            first_name,
            last_name,
            email,
            job_title,
            owner_id,
            status,
            is_primary,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, 'lead', true, NOW())
          RETURNING *`,
          [
            company.id,
            contact_first_name || 'Unknown',
            contact_last_name || '',
            contact_email,
            contact_job_title || 'Contact',
            user.userId,
          ]
        );
        contact = contactResult.rows[0];
      }

      // Update lead with company reference
      await client.query(
        `UPDATE domain_leads
         SET company_id = $1,
             contact_id = $2,
             status = 'converted',
             updated_at = NOW()
         WHERE id = $3`,
        [company.id, contact?.id || null, params.id]
      );

      return { company, contact };
    });

    return successResponse({
      lead_id: params.id,
      company: result.company,
      contact: result.contact,
    }, 'Lead converted to CRM successfully');
  } catch (error: any) {
    console.error('Convert lead error:', error);
    return errorResponse(error.message || 'Failed to convert lead', 500);
  }
}
