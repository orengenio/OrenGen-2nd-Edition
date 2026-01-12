import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, createToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { UserRole } from '@/crm/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role = UserRole.SALES_REP } = body;

    // Validation
    if (!email || !password || !name) {
      return errorResponse('Email, password, and name are required');
    }

    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters');
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.length > 0) {
      return errorResponse('User with this email already exists', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await query(
      `INSERT INTO users (email, name, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, created_at`,
      [email, name, passwordHash, role]
    );

    const user = newUser[0];

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.created_at,
        },
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return errorResponse(error.message || 'Registration failed', 500);
  }
}
