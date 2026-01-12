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

// GET /api/leads/campaigns/[id] - Get single campaign
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

    const campaigns = await query(
      `SELECT
        c.*,
        u.name as created_by_name,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id) as total_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'new') as new_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'enriched') as enriched_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'qualified') as qualified_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'contacted') as contacted_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'converted') as converted_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'rejected') as rejected_leads,
        (SELECT AVG(lead_score) FROM domain_leads WHERE campaign_id = c.id) as avg_score
       FROM lead_gen_campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.id = $1`,
      [params.id]
    );

    if (campaigns.length === 0) {
      return notFoundResponse('Campaign not found');
    }

    return successResponse(campaigns[0]);
  } catch (error: any) {
    console.error('Get campaign error:', error);
    return errorResponse(error.message || 'Failed to get campaign', 500);
  }
}

// PUT /api/leads/campaigns/[id] - Update campaign
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
    const { name, filters, description, status } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(name);
    }

    if (filters !== undefined) {
      paramCount++;
      updates.push(`filters = $${paramCount}`);
      values.push(JSON.stringify(filters));
    }

    if (description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(description);
    }

    if (status !== undefined) {
      const validStatuses = ['draft', 'active', 'paused', 'completed'];
      if (!validStatuses.includes(status)) {
        return errorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
      paramCount++;
      updates.push(`status = $${paramCount}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return errorResponse('No fields to update');
    }

    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date().toISOString());

    paramCount++;
    values.push(params.id);

    const result = await query(
      `UPDATE lead_gen_campaigns
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.length === 0) {
      return notFoundResponse('Campaign not found');
    }

    return successResponse(result[0], 'Campaign updated successfully');
  } catch (error: any) {
    console.error('Update campaign error:', error);
    return errorResponse(error.message || 'Failed to update campaign', 500);
  }
}

// DELETE /api/leads/campaigns/[id] - Delete campaign
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

    // First, unlink any leads from this campaign
    await query(
      'UPDATE domain_leads SET campaign_id = NULL WHERE campaign_id = $1',
      [params.id]
    );

    // Delete the campaign
    const result = await query(
      'DELETE FROM lead_gen_campaigns WHERE id = $1 RETURNING id',
      [params.id]
    );

    if (result.length === 0) {
      return notFoundResponse('Campaign not found');
    }

    return successResponse({ id: params.id }, 'Campaign deleted successfully');
  } catch (error: any) {
    console.error('Delete campaign error:', error);
    return errorResponse(error.message || 'Failed to delete campaign', 500);
  }
}
