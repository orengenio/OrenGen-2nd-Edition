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
import { leadEnrichmentService } from '@/lib/services/lead-enrichment';

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

    // Parse options from request body
    const body = await request.json().catch(() => ({}));
    const {
      skipWhois = false,
      skipTechStack = false,
      skipEmailFinder = false,
      preferredEmailSource = 'both',
    } = body;

    // Get the domain lead
    const leads = await query('SELECT * FROM domain_leads WHERE id = $1', [params.id]);

    if (leads.length === 0) {
      return notFoundResponse('Domain lead not found');
    }

    const lead = leads[0];

    // Run full enrichment
    const enrichmentResult = await leadEnrichmentService.enrichDomain(
      lead.domain,
      {
        skipWhois,
        skipTechStack,
        skipEmailFinder,
        preferredEmailSource,
        maxEmails: 5,
      }
    );

    // Update the domain lead with enriched data
    const updated = await query(
      `UPDATE domain_leads SET
        whois_data = COALESCE($1, whois_data),
        tech_stack = COALESCE($2, tech_stack),
        enrichment_data = COALESCE($3, enrichment_data),
        lead_score = $4,
        status = CASE WHEN status = 'new' THEN 'enriched' ELSE status END,
        updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [
        enrichmentResult.whoisData ? JSON.stringify(enrichmentResult.whoisData) : null,
        enrichmentResult.techStack ? JSON.stringify(enrichmentResult.techStack) : null,
        enrichmentResult.enrichmentData ? JSON.stringify(enrichmentResult.enrichmentData) : null,
        enrichmentResult.score.total,
        params.id,
      ]
    );

    return successResponse({
      lead: updated[0],
      enrichment: {
        whoisData: enrichmentResult.whoisData,
        techStack: enrichmentResult.techStack,
        enrichmentData: enrichmentResult.enrichmentData,
        score: enrichmentResult.score,
        errors: enrichmentResult.errors,
      },
    }, 'Domain lead enriched successfully');
  } catch (error: any) {
    console.error('Enrich domain lead error:', error);
    return errorResponse(error.message || 'Failed to enrich domain lead', 500);
  }
}

// GET /api/leads/domains/[id]/enrich - Get enrichment service status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'read')) {
      return forbiddenResponse();
    }

    const serviceStatus = await leadEnrichmentService.getServiceStatus();

    return successResponse({
      services: serviceStatus,
      lead_id: params.id,
    });
  } catch (error: any) {
    console.error('Get enrichment status error:', error);
    return errorResponse(error.message || 'Failed to get enrichment status', 500);
  }
}
