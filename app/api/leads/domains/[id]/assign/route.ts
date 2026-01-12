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

// POST /api/leads/domains/[id]/assign - Assign lead to user
export async function POST(
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
    const { user_id } = body;

    if (!user_id) {
      return errorResponse('user_id is required');
    }

    // Verify user exists
    const users = await query('SELECT id, name FROM users WHERE id = $1', [user_id]);
    if (users.length === 0) {
      return errorResponse('User not found', 404);
    }

    // Update lead assignment
    const result = await query(
      `UPDATE domain_leads
       SET assigned_to = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [user_id, params.id]
    );

    if (result.length === 0) {
      return notFoundResponse('Domain lead not found');
    }

    return successResponse({
      ...result[0],
      assigned_to_name: users[0].name,
    }, `Lead assigned to ${users[0].name}`);
  } catch (error: any) {
    console.error('Assign lead error:', error);
    return errorResponse(error.message || 'Failed to assign lead', 500);
  }
}
