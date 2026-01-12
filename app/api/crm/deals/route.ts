import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/crm/deals - List deals
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'deals', 'read')) {
      return forbiddenResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const stage = searchParams.get('stage') || '';
    const companyId = searchParams.get('companyId') || '';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (stage) {
      paramCount++;
      whereClause += ` AND d.stage = $${paramCount}`;
      params.push(stage);
    }

    if (companyId) {
      paramCount++;
      whereClause += ` AND d.company_id = $${paramCount}`;
      params.push(companyId);
    }

    const deals = await query(
      `SELECT d.*,
        c.name as company_name,
        ct.first_name || ' ' || ct.last_name as contact_name,
        u.name as owner_name
       FROM deals d
       LEFT JOIN companies c ON d.company_id = c.id
       LEFT JOIN contacts ct ON d.contact_id = ct.id
       LEFT JOIN users u ON d.owner_id = u.id
       ${whereClause}
       ORDER BY d.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM deals d ${whereClause}`,
      params
    );

    const total = parseInt(countResult[0].total);

    return successResponse({
      deals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get deals error:', error);
    return errorResponse(error.message || 'Failed to get deals', 500);
  }
}

// POST /api/crm/deals - Create deal
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'deals', 'create')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const {
      companyId,
      contactId,
      title,
      value,
      currency = 'USD',
      stage = 'prospecting',
      probability = 10,
      expectedCloseDate,
      pipelineId,
      customFields,
    } = body;

    if (!companyId || !title || !value) {
      return errorResponse('Company ID, title, and value are required');
    }

    // Get default pipeline if not provided
    let finalPipelineId = pipelineId;
    if (!finalPipelineId) {
      const defaultPipeline = await query(
        'SELECT id FROM pipelines WHERE is_default = true LIMIT 1'
      );
      if (defaultPipeline.length > 0) {
        finalPipelineId = defaultPipeline[0].id;
      }
    }

    const newDeal = await query(
      `INSERT INTO deals (
        company_id, contact_id, title, value, currency, stage,
        probability, expected_close_date, owner_id, pipeline_id, custom_fields
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        companyId,
        contactId,
        title,
        value,
        currency,
        stage,
        probability,
        expectedCloseDate,
        user.userId,
        finalPipelineId,
        customFields ? JSON.stringify(customFields) : null,
      ]
    );

    return successResponse(newDeal[0], 'Deal created successfully', 201);
  } catch (error: any) {
    console.error('Create deal error:', error);
    return errorResponse(error.message || 'Failed to create deal', 500);
  }
}
