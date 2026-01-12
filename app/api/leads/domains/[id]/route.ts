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

// GET /api/leads/domains/[id] - Get single domain lead
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

    const leads = await query(
      `SELECT dl.*,
              u.name as assigned_to_name,
              c.name as company_name
       FROM domain_leads dl
       LEFT JOIN users u ON dl.assigned_to = u.id
       LEFT JOIN companies c ON dl.company_id = c.id
       WHERE dl.id = $1`,
      [params.id]
    );

    if (leads.length === 0) {
      return notFoundResponse('Domain lead not found');
    }

    return successResponse(leads[0]);
  } catch (error: any) {
    console.error('Get domain lead error:', error);
    return errorResponse(error.message || 'Failed to get domain lead', 500);
  }
}

// PUT /api/leads/domains/[id] - Update domain lead
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'update')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const {
      status,
      notes,
      assigned_to,
      lead_score,
      whois_data,
      tech_stack,
      enrichment_data,
    } = body;

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (status !== undefined) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      values.push(status);
    }

    if (notes !== undefined) {
      paramCount++;
      updates.push(`notes = $${paramCount}`);
      values.push(notes);
    }

    if (assigned_to !== undefined) {
      paramCount++;
      updates.push(`assigned_to = $${paramCount}`);
      values.push(assigned_to);
    }

    if (lead_score !== undefined) {
      paramCount++;
      updates.push(`lead_score = $${paramCount}`);
      values.push(Math.max(0, Math.min(100, lead_score)));
    }

    if (whois_data !== undefined) {
      paramCount++;
      updates.push(`whois_data = $${paramCount}`);
      values.push(JSON.stringify(whois_data));
    }

    if (tech_stack !== undefined) {
      paramCount++;
      updates.push(`tech_stack = $${paramCount}`);
      values.push(JSON.stringify(tech_stack));
    }

    if (enrichment_data !== undefined) {
      paramCount++;
      updates.push(`enrichment_data = $${paramCount}`);
      values.push(JSON.stringify(enrichment_data));
    }

    if (updates.length === 0) {
      return errorResponse('No fields to update');
    }

    // Add updated_at
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date().toISOString());

    // Add id parameter
    paramCount++;
    values.push(params.id);

    const result = await query(
      `UPDATE domain_leads
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.length === 0) {
      return notFoundResponse('Domain lead not found');
    }

    return successResponse(result[0], 'Domain lead updated successfully');
  } catch (error: any) {
    console.error('Update domain lead error:', error);
    return errorResponse(error.message || 'Failed to update domain lead', 500);
  }
}

// DELETE /api/leads/domains/[id] - Delete domain lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'delete')) {
      return forbiddenResponse();
    }

    const result = await query(
      'DELETE FROM domain_leads WHERE id = $1 RETURNING id',
      [params.id]
    );

    if (result.length === 0) {
      return notFoundResponse('Domain lead not found');
    }

    return successResponse({ id: params.id }, 'Domain lead deleted successfully');
  } catch (error: any) {
    console.error('Delete domain lead error:', error);
    return errorResponse(error.message || 'Failed to delete domain lead', 500);
  }
}
