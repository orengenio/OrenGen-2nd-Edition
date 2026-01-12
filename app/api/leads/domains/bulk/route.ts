import { NextRequest } from 'next/server';
import { query, transaction } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// POST /api/leads/domains/bulk - Bulk import domain leads
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'create')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const { domains, assign_to, campaign_id, auto_enrich } = body;

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return errorResponse('domains array is required');
    }

    if (domains.length > 1000) {
      return errorResponse('Maximum 1000 domains per import');
    }

    // Clean and validate domains
    const cleanDomains = domains
      .map((d: string) =>
        d.toLowerCase()
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
          .replace(/\/.*$/, '')
          .trim()
      )
      .filter((d: string) => d && d.includes('.'));

    if (cleanDomains.length === 0) {
      return errorResponse('No valid domains provided');
    }

    // Get existing domains to avoid duplicates
    const existingResult = await query(
      `SELECT domain FROM domain_leads WHERE domain = ANY($1)`,
      [cleanDomains]
    );
    const existingDomains = new Set(existingResult.map((r: any) => r.domain));

    // Filter out existing domains
    const newDomains = cleanDomains.filter((d: string) => !existingDomains.has(d));

    if (newDomains.length === 0) {
      return successResponse({
        imported: 0,
        duplicates: cleanDomains.length,
        domains: [],
      }, 'All domains already exist');
    }

    // Bulk insert new domains
    const imported = await transaction(async (client) => {
      const results = [];

      for (const domain of newDomains) {
        const result = await client.query(
          `INSERT INTO domain_leads (
            domain,
            status,
            assigned_to,
            campaign_id,
            scraped_date,
            created_at
          ) VALUES ($1, 'new', $2, $3, NOW(), NOW())
          RETURNING *`,
          [domain, assign_to || null, campaign_id || null]
        );
        results.push(result.rows[0]);
      }

      return results;
    });

    // Queue for auto-enrichment if requested
    if (auto_enrich && imported.length > 0) {
      // In a real app, this would queue jobs for background processing
      // For now, we just mark them for enrichment
      await query(
        `UPDATE domain_leads
         SET notes = COALESCE(notes, '') || '[Queued for auto-enrichment]'
         WHERE id = ANY($1)`,
        [imported.map((l: any) => l.id)]
      );
    }

    return successResponse({
      imported: imported.length,
      duplicates: cleanDomains.length - newDomains.length,
      domains: imported,
    }, `Successfully imported ${imported.length} domains`);
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return errorResponse(error.message || 'Failed to import domains', 500);
  }
}

// PUT /api/leads/domains/bulk - Bulk update domain leads
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'update')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const { ids, status, assigned_to, campaign_id } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('ids array is required');
    }

    if (ids.length > 500) {
      return errorResponse('Maximum 500 leads per update');
    }

    // Build dynamic update
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (status !== undefined) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      values.push(status);
    }

    if (assigned_to !== undefined) {
      paramCount++;
      updates.push(`assigned_to = $${paramCount}`);
      values.push(assigned_to);
    }

    if (campaign_id !== undefined) {
      paramCount++;
      updates.push(`campaign_id = $${paramCount}`);
      values.push(campaign_id);
    }

    if (updates.length === 0) {
      return errorResponse('No fields to update');
    }

    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date().toISOString());

    paramCount++;
    values.push(ids);

    const result = await query(
      `UPDATE domain_leads
       SET ${updates.join(', ')}
       WHERE id = ANY($${paramCount})
       RETURNING id`,
      values
    );

    return successResponse({
      updated: result.length,
      ids: result.map((r: any) => r.id),
    }, `Successfully updated ${result.length} leads`);
  } catch (error: any) {
    console.error('Bulk update error:', error);
    return errorResponse(error.message || 'Failed to update leads', 500);
  }
}

// DELETE /api/leads/domains/bulk - Bulk delete domain leads
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'delete')) {
      return forbiddenResponse();
    }

    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return errorResponse('ids parameter is required');
    }

    const ids = idsParam.split(',').filter(Boolean);

    if (ids.length === 0) {
      return errorResponse('No valid ids provided');
    }

    if (ids.length > 500) {
      return errorResponse('Maximum 500 leads per delete');
    }

    const result = await query(
      'DELETE FROM domain_leads WHERE id = ANY($1) RETURNING id',
      [ids]
    );

    return successResponse({
      deleted: result.length,
      ids: result.map((r: any) => r.id),
    }, `Successfully deleted ${result.length} leads`);
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return errorResponse(error.message || 'Failed to delete leads', 500);
  }
}
