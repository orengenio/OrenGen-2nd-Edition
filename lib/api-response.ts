import { NextResponse } from 'next/server';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as APIResponse<T>,
    { status }
  );
}

export function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
    } as APIResponse,
    { status }
  );
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = 'Not found'): NextResponse {
  return errorResponse(message, 404);
}

export function serverErrorResponse(message: string = 'Internal server error'): NextResponse {
  return errorResponse(message, 500);
}
