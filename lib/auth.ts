import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';
import { UserRole } from '../crm/types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getTokenFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export async function getUserFromRequest(request: Request): Promise<JWTPayload | null> {
  const token = await getTokenFromRequest(request);

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

// Check if user has permission for resource/action
export function hasPermission(
  role: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  const rolePermissions: Record<UserRole, Record<string, string[]>> = {
    [UserRole.SUPER_ADMIN]: {
      companies: ['create', 'read', 'update', 'delete'],
      contacts: ['create', 'read', 'update', 'delete'],
      deals: ['create', 'read', 'update', 'delete'],
      activities: ['create', 'read', 'update', 'delete'],
      users: ['create', 'read', 'update', 'delete'],
      settings: ['create', 'read', 'update', 'delete'],
      leads: ['create', 'read', 'update', 'delete'],
      websites: ['create', 'read', 'update', 'delete'],
    },
    [UserRole.ADMIN]: {
      companies: ['create', 'read', 'update', 'delete'],
      contacts: ['create', 'read', 'update', 'delete'],
      deals: ['create', 'read', 'update', 'delete'],
      activities: ['create', 'read', 'update', 'delete'],
      users: ['read', 'update'],
      settings: ['read', 'update'],
      leads: ['create', 'read', 'update', 'delete'],
      websites: ['create', 'read', 'update', 'delete'],
    },
    [UserRole.SALES_MANAGER]: {
      companies: ['create', 'read', 'update'],
      contacts: ['create', 'read', 'update'],
      deals: ['create', 'read', 'update'],
      activities: ['create', 'read', 'update'],
      users: ['read'],
      settings: ['read'],
      leads: ['read', 'update'],
      websites: ['read', 'update'],
    },
    [UserRole.SALES_REP]: {
      companies: ['create', 'read', 'update'],
      contacts: ['create', 'read', 'update'],
      deals: ['create', 'read', 'update'],
      activities: ['create', 'read', 'update'],
      users: ['read'],
      settings: ['read'],
      leads: ['read'],
      websites: ['read'],
    },
    [UserRole.ACCOUNT_MANAGER]: {
      companies: ['read', 'update'],
      contacts: ['read', 'update'],
      deals: ['read', 'update'],
      activities: ['create', 'read', 'update'],
      users: ['read'],
      settings: ['read'],
      leads: ['read'],
      websites: ['read'],
    },
    [UserRole.VIEWER]: {
      companies: ['read'],
      contacts: ['read'],
      deals: ['read'],
      activities: ['read'],
      users: [],
      settings: [],
      leads: [],
      websites: [],
    },
  };

  const permissions = rolePermissions[role]?.[resource] || [];
  return permissions.includes(action);
}
