import { NextRequest } from 'next/server';
import { query, setCurrentUser, transaction } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse
} from '@/lib/api-response';

// GET /api/crm/companies - List all companies
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'companies', 'read')) {
      return forbiddenResponse('You do not have permission to view companies');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (name ILIKE $${paramCount} OR website ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    // Get companies with owner info
    const companies = await query(
      `SELECT c.*, u.name as owner_name, u.email as owner_email
       FROM companies c
       LEFT JOIN users u ON c.owner_id = u.id
       ${whereClause}
       ORDER BY c.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM companies ${whereClause}`,
      params
    );

    const total = parseInt(countResult[0].total);

    return successResponse({
      companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get companies error:', error);
    return errorResponse(error.message || 'Failed to get companies', 500);
  }
}

// POST /api/crm/companies - Create a new company
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'companies', 'create')) {
      return forbiddenResponse('You do not have permission to create companies');
    }

    const body = await request.json();
    const {
      name,
      industry,
      size,
      website,
      phone,
      address,
      annualRevenue,
      employeeCount,
      status = 'prospect',
      customFields,
    } = body;

    if (!name) {
      return errorResponse('Company name is required');
    }

    const newCompany = await query(
      `INSERT INTO companies (
        name, industry, size, website, phone,
        address_street, address_city, address_state, address_zip, address_country,
        annual_revenue, employee_count, status, owner_id, created_by, custom_fields
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        name,
        industry,
        size,
        website,
        phone,
        address?.street,
        address?.city,
        address?.state,
        address?.zip,
        address?.country || 'USA',
        annualRevenue,
        employeeCount,
        status,
        user.userId,
        user.userId,
        customFields ? JSON.stringify(customFields) : null,
      ]
    );

    return successResponse(newCompany[0], 'Company created successfully', 201);
  } catch (error: any) {
    console.error('Create company error:', error);
    return errorResponse(error.message || 'Failed to create company', 500);
  }
}
