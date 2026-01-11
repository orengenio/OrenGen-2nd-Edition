import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

// GET /api/websites/questions - Get all website questions
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';

    let whereClause = 'WHERE is_active = true';
    const params: any[] = [];

    if (category) {
      whereClause += ' AND category = $1';
      params.push(category);
    }

    const questions = await query(
      `SELECT id, category, question, type, options, placeholder, required, order_index, conditional_on
       FROM website_questions
       ${whereClause}
       ORDER BY order_index ASC`,
      params
    );

    // Group questions by category
    const grouped = questions.reduce((acc: any, q: any) => {
      if (!acc[q.category]) {
        acc[q.category] = [];
      }
      acc[q.category].push(q);
      return acc;
    }, {});

    return successResponse({
      questions,
      grouped,
      categories: ['business', 'branding', 'features', 'content', 'technical', 'design'],
    });
  } catch (error: any) {
    console.error('Get questions error:', error);
    return errorResponse(error.message || 'Failed to get questions', 500);
  }
}
