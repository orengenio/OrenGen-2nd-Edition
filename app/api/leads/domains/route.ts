import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/leads/domains - List domain leads
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'read')) {
      return forbiddenResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const minScore = searchParams.get('minScore') || '';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND domain ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (minScore) {
      paramCount++;
      whereClause += ` AND lead_score >= $${paramCount}`;
      params.push(parseInt(minScore));
    }

    const leads = await query(
      `SELECT dl.*, u.name as assigned_to_name
       FROM domain_leads dl
       LEFT JOIN users u ON dl.assigned_to = u.id
       ${whereClause}
       ORDER BY dl.lead_score DESC, dl.scraped_date DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM domain_leads ${whereClause}`,
      params
    );

    const total = parseInt(countResult[0].total);

    return successResponse({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get domain leads error:', error);
    return errorResponse(error.message || 'Failed to get domain leads', 500);
  }
}

// POST /api/leads/domains - Create domain lead (for manual entry)
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'create')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const { domain, notes } = body;

    if (!domain) {
      return errorResponse('Domain is required');
    }

    // Check if domain already exists
    const existing = await query(
      'SELECT id FROM domain_leads WHERE domain = $1',
      [domain]
    );

    if (existing.length > 0) {
      return errorResponse('Domain already exists in leads', 409);
    }

    const newLead = await query(
      `INSERT INTO domain_leads (domain, status, assigned_to, notes)
       VALUES ($1, 'new', $2, $3)
       RETURNING *`,
      [domain, user.userId, notes]
    );

    return successResponse(newLead[0], 'Domain lead created successfully', 201);
  } catch (error: any) {
    console.error('Create domain lead error:', error);
    return errorResponse(error.message || 'Failed to create domain lead', 500);
  }
}
