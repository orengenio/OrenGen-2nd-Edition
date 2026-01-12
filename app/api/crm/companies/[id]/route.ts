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

// GET /api/crm/companies/[id] - Get single company
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'companies', 'read')) {
      return forbiddenResponse();
    }

    const company = await query(
      `SELECT c.*, u.name as owner_name, u.email as owner_email
       FROM companies c
       LEFT JOIN users u ON c.owner_id = u.id
       WHERE c.id = $1`,
      [params.id]
    );

    if (company.length === 0) {
      return notFoundResponse('Company not found');
    }

    return successResponse(company[0]);
  } catch (error: any) {
    console.error('Get company error:', error);
    return errorResponse(error.message || 'Failed to get company', 500);
  }
}

// PUT /api/crm/companies/[id] - Update company
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'companies', 'update')) {
      return forbiddenResponse();
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
      status,
      customFields,
    } = body;

    const updated = await query(
      `UPDATE companies SET
        name = COALESCE($1, name),
        industry = COALESCE($2, industry),
        size = COALESCE($3, size),
        website = COALESCE($4, website),
        phone = COALESCE($5, phone),
        address_street = COALESCE($6, address_street),
        address_city = COALESCE($7, address_city),
        address_state = COALESCE($8, address_state),
        address_zip = COALESCE($9, address_zip),
        address_country = COALESCE($10, address_country),
        annual_revenue = COALESCE($11, annual_revenue),
        employee_count = COALESCE($12, employee_count),
        status = COALESCE($13, status),
        custom_fields = COALESCE($14, custom_fields)
      WHERE id = $15
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
        address?.country,
        annualRevenue,
        employeeCount,
        status,
        customFields ? JSON.stringify(customFields) : null,
        params.id,
      ]
    );

    if (updated.length === 0) {
      return notFoundResponse('Company not found');
    }

    return successResponse(updated[0], 'Company updated successfully');
  } catch (error: any) {
    console.error('Update company error:', error);
    return errorResponse(error.message || 'Failed to update company', 500);
  }
}

// DELETE /api/crm/companies/[id] - Delete company
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'companies', 'delete')) {
      return forbiddenResponse();
    }

    const deleted = await query('DELETE FROM companies WHERE id = $1 RETURNING id', [params.id]);

    if (deleted.length === 0) {
      return notFoundResponse('Company not found');
    }

    return successResponse({ id: params.id }, 'Company deleted successfully');
  } catch (error: any) {
    console.error('Delete company error:', error);
    return errorResponse(error.message || 'Failed to delete company', 500);
  }
}
