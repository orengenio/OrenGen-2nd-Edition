import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return errorResponse('Email and password are required');
    }

    // Find user
    const users = await query(
      `SELECT id, email, name, password_hash, role, avatar, team_id, last_login
       FROM users
       WHERE email = $1 AND is_active = true`,
      [email]
    );

    if (users.length === 0) {
      return unauthorizedResponse('Invalid email or password');
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return unauthorizedResponse('Invalid email or password');
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        teamId: user.team_id,
        lastLogin: user.last_login,
      },
      token,
    }, 'Login successful');
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse(error.message || 'Login failed', 500);
  }
}
