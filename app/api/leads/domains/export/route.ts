import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/leads/domains/export - Export leads to CSV
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'read')) {
      return forbiddenResponse();
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const minScore = searchParams.get('minScore') || '';
    const ids = searchParams.get('ids') || '';
    const format = searchParams.get('format') || 'csv';

    // Build query
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (ids) {
      const idList = ids.split(',').filter(Boolean);
      paramCount++;
      whereClause += ` AND dl.id = ANY($${paramCount})`;
      params.push(idList);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND dl.status = $${paramCount}`;
      params.push(status);
    }

    if (minScore) {
      paramCount++;
      whereClause += ` AND dl.lead_score >= $${paramCount}`;
      params.push(parseInt(minScore));
    }

    const leads = await query(
      `SELECT
        dl.domain,
        dl.status,
        dl.lead_score,
        dl.scraped_date,
        dl.whois_data,
        dl.tech_stack,
        dl.enrichment_data,
        dl.notes,
        u.name as assigned_to_name,
        u.email as assigned_to_email
       FROM domain_leads dl
       LEFT JOIN users u ON dl.assigned_to = u.id
       ${whereClause}
       ORDER BY dl.lead_score DESC, dl.scraped_date DESC
       LIMIT 10000`,
      params
    );

    if (format === 'json') {
      return new Response(JSON.stringify(leads, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="leads-export.json"',
        },
      });
    }

    // Generate CSV
    const csvRows: string[] = [];

    // Header row
    csvRows.push([
      'Domain',
      'Status',
      'Score',
      'Scraped Date',
      'Registrar',
      'Registration Date',
      'Registrant Org',
      'Registrant Country',
      'Registrant Email',
      'CMS',
      'Frameworks',
      'Has Contact Form',
      'Has Live Chat',
      'Emails',
      'Phones',
      'LinkedIn',
      'Industry',
      'Assigned To',
      'Notes',
    ].map(escapeCSV).join(','));

    // Data rows
    for (const lead of leads) {
      const whois = lead.whois_data ?
        (typeof lead.whois_data === 'string' ? JSON.parse(lead.whois_data) : lead.whois_data) : {};
      const tech = lead.tech_stack ?
        (typeof lead.tech_stack === 'string' ? JSON.parse(lead.tech_stack) : lead.tech_stack) : {};
      const enrichment = lead.enrichment_data ?
        (typeof lead.enrichment_data === 'string' ? JSON.parse(lead.enrichment_data) : lead.enrichment_data) : {};

      csvRows.push([
        lead.domain || '',
        lead.status || '',
        lead.lead_score?.toString() || '0',
        lead.scraped_date || '',
        whois.registrar || '',
        whois.registrationDate || '',
        whois.registrantOrg || '',
        whois.registrantCountry || '',
        whois.registrantEmail || '',
        tech.cms || '',
        (tech.frameworks || []).join('; '),
        tech.hasContactForm ? 'Yes' : 'No',
        tech.hasLiveChat ? 'Yes' : 'No',
        (enrichment.emails || []).join('; '),
        (enrichment.phones || []).join('; '),
        enrichment.socialMedia?.linkedin || '',
        enrichment.industry || '',
        lead.assigned_to_name || '',
        lead.notes || '',
      ].map(escapeCSV).join(','));
    }

    const csv = csvRows.join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Export leads error:', error);
    return errorResponse(error.message || 'Failed to export leads', 500);
  }
}

function escapeCSV(value: string): string {
  if (!value) return '';
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
