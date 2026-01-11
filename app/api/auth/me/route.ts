import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return unauthorizedResponse();
    }

    // Get full user details
    const users = await query(
      `SELECT id, email, name, role, avatar, team_id, created_at, last_login
       FROM users
       WHERE id = $1 AND is_active = true`,
      [user.userId]
    );

    if (users.length === 0) {
      return unauthorizedResponse('User not found');
    }

    const userData = users[0];

    return successResponse({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      avatar: userData.avatar,
      teamId: userData.team_id,
      createdAt: userData.created_at,
      lastLogin: userData.last_login,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return errorResponse(error.message || 'Failed to get user', 500);
  }
}
