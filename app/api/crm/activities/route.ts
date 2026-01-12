import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/crm/activities - List activities
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'activities', 'read')) {
      return forbiddenResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type') || '';
    const companyId = searchParams.get('companyId') || '';
    const dealId = searchParams.get('dealId') || '';
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      whereClause += ` AND a.type = $${paramCount}`;
      params.push(type);
    }

    if (companyId) {
      paramCount++;
      whereClause += ` AND a.company_id = $${paramCount}`;
      params.push(companyId);
    }

    if (dealId) {
      paramCount++;
      whereClause += ` AND a.deal_id = $${paramCount}`;
      params.push(dealId);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND a.status = $${paramCount}`;
      params.push(status);
    }

    const activities = await query(
      `SELECT a.*,
        c.name as company_name,
        ct.first_name || ' ' || ct.last_name as contact_name,
        d.title as deal_title,
        u.name as owner_name
       FROM activities a
       LEFT JOIN companies c ON a.company_id = c.id
       LEFT JOIN contacts ct ON a.contact_id = ct.id
       LEFT JOIN deals d ON a.deal_id = d.id
       LEFT JOIN users u ON a.owner_id = u.id
       ${whereClause}
       ORDER BY a.scheduled_at DESC, a.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM activities a ${whereClause}`,
      params
    );

    const total = parseInt(countResult[0].total);

    return successResponse({
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get activities error:', error);
    return errorResponse(error.message || 'Failed to get activities', 500);
  }
}

// POST /api/crm/activities - Create activity
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'activities', 'create')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const {
      type,
      subject,
      description,
      companyId,
      contactId,
      dealId,
      status = 'scheduled',
      scheduledAt,
      duration,
    } = body;

    if (!type || !subject) {
      return errorResponse('Type and subject are required');
    }

    const newActivity = await query(
      `INSERT INTO activities (
        type, subject, description, company_id, contact_id, deal_id,
        owner_id, status, scheduled_at, duration
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        type,
        subject,
        description,
        companyId,
        contactId,
        dealId,
        user.userId,
        status,
        scheduledAt,
        duration,
      ]
    );

    return successResponse(newActivity[0], 'Activity created successfully', 201);
  } catch (error: any) {
    console.error('Create activity error:', error);
    return errorResponse(error.message || 'Failed to create activity', 500);
  }
}
