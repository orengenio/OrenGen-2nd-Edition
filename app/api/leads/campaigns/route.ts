import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/leads/campaigns - List lead gen campaigns
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'read')) {
      return forbiddenResponse();
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    const campaigns = await query(
      `SELECT
        c.*,
        u.name as created_by_name,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id) as total_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'enriched') as enriched_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'qualified') as qualified_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'contacted') as contacted_leads,
        (SELECT COUNT(*) FROM domain_leads WHERE campaign_id = c.id AND status = 'converted') as converted_leads
       FROM lead_gen_campaigns c
       LEFT JOIN users u ON c.created_by = u.id
       ${whereClause}
       ORDER BY c.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM lead_gen_campaigns ${whereClause}`,
      params
    );

    const total = parseInt(countResult[0].total);

    return successResponse({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    return errorResponse(error.message || 'Failed to get campaigns', 500);
  }
}

// POST /api/leads/campaigns - Create lead gen campaign
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'create')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const { name, filters, description } = body;

    if (!name) {
      return errorResponse('Campaign name is required');
    }

    const result = await query(
      `INSERT INTO lead_gen_campaigns (
        name,
        filters,
        description,
        status,
        created_by,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, 'draft', $4, NOW(), NOW())
      RETURNING *`,
      [
        name,
        filters ? JSON.stringify(filters) : '{}',
        description || null,
        user.userId,
      ]
    );

    return successResponse(result[0], 'Campaign created successfully', 201);
  } catch (error: any) {
    console.error('Create campaign error:', error);
    return errorResponse(error.message || 'Failed to create campaign', 500);
  }
}
