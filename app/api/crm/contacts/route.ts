import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/crm/contacts - List contacts
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'contacts', 'read')) {
      return forbiddenResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const companyId = searchParams.get('companyId') || '';
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (ct.first_name ILIKE $${paramCount} OR ct.last_name ILIKE $${paramCount} OR ct.email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (companyId) {
      paramCount++;
      whereClause += ` AND ct.company_id = $${paramCount}`;
      params.push(companyId);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND ct.status = $${paramCount}`;
      params.push(status);
    }

    const contacts = await query(
      `SELECT ct.*, c.name as company_name, u.name as owner_name
       FROM contacts ct
       LEFT JOIN companies c ON ct.company_id = c.id
       LEFT JOIN users u ON ct.owner_id = u.id
       ${whereClause}
       ORDER BY ct.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM contacts ct ${whereClause}`,
      params
    );

    const total = parseInt(countResult[0].total);

    return successResponse({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get contacts error:', error);
    return errorResponse(error.message || 'Failed to get contacts', 500);
  }
}

// POST /api/crm/contacts - Create contact
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'contacts', 'create')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const {
      companyId,
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      department,
      isPrimary = false,
      linkedInUrl,
      status = 'lead',
    } = body;

    if (!firstName || !lastName || !companyId) {
      return errorResponse('First name, last name, and company ID are required');
    }

    const newContact = await query(
      `INSERT INTO contacts (
        company_id, first_name, last_name, email, phone,
        job_title, department, is_primary, linkedin_url, status, owner_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        companyId,
        firstName,
        lastName,
        email,
        phone,
        jobTitle,
        department,
        isPrimary,
        linkedInUrl,
        status,
        user.userId,
      ]
    );

    return successResponse(newContact[0], 'Contact created successfully', 201);
  } catch (error: any) {
    console.error('Create contact error:', error);
    return errorResponse(error.message || 'Failed to create contact', 500);
  }
}
