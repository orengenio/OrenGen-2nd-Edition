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

// GET /api/crm/contacts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'contacts', 'read')) {
      return forbiddenResponse();
    }

    const contact = await query(
      `SELECT ct.*, c.name as company_name, u.name as owner_name
       FROM contacts ct
       LEFT JOIN companies c ON ct.company_id = c.id
       LEFT JOIN users u ON ct.owner_id = u.id
       WHERE ct.id = $1`,
      [params.id]
    );

    if (contact.length === 0) {
      return notFoundResponse('Contact not found');
    }

    return successResponse(contact[0]);
  } catch (error: any) {
    console.error('Get contact error:', error);
    return errorResponse(error.message || 'Failed to get contact', 500);
  }
}

// PUT /api/crm/contacts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'contacts', 'update')) {
      return forbiddenResponse();
    }

    const body = await request.json();

    const updated = await query(
      `UPDATE contacts SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        job_title = COALESCE($5, job_title),
        department = COALESCE($6, department),
        is_primary = COALESCE($7, is_primary),
        linkedin_url = COALESCE($8, linkedin_url),
        status = COALESCE($9, status)
      WHERE id = $10
      RETURNING *`,
      [
        body.firstName,
        body.lastName,
        body.email,
        body.phone,
        body.jobTitle,
        body.department,
        body.isPrimary,
        body.linkedInUrl,
        body.status,
        params.id,
      ]
    );

    if (updated.length === 0) {
      return notFoundResponse('Contact not found');
    }

    return successResponse(updated[0], 'Contact updated successfully');
  } catch (error: any) {
    console.error('Update contact error:', error);
    return errorResponse(error.message || 'Failed to update contact', 500);
  }
}

// DELETE /api/crm/contacts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'contacts', 'delete')) {
      return forbiddenResponse();
    }

    const deleted = await query('DELETE FROM contacts WHERE id = $1 RETURNING id', [params.id]);

    if (deleted.length === 0) {
      return notFoundResponse('Contact not found');
    }

    return successResponse({ id: params.id }, 'Contact deleted successfully');
  } catch (error: any) {
    console.error('Delete contact error:', error);
    return errorResponse(error.message || 'Failed to delete contact', 500);
  }
}
