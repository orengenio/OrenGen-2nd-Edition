import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/websites/projects - List website projects
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'websites', 'read')) {
      return forbiddenResponse();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereClause += ` AND wp.status = $${paramCount}`;
      params.push(status);
    }

    const projects = await query(
      `SELECT wp.*,
        c.name as company_name,
        ct.first_name || ' ' || ct.last_name as contact_name,
        u.name as created_by_name
       FROM website_projects wp
       LEFT JOIN companies c ON wp.company_id = c.id
       LEFT JOIN contacts ct ON wp.contact_id = ct.id
       LEFT JOIN users u ON wp.created_by = u.id
       ${whereClause}
       ORDER BY wp.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM website_projects wp ${whereClause}`,
      params
    );

    const total = parseInt(countResult[0].total);

    return successResponse({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get website projects error:', error);
    return errorResponse(error.message || 'Failed to get website projects', 500);
  }
}

// POST /api/websites/projects - Create new website project
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'websites', 'create')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const { projectName, companyId, contactId, domain } = body;

    if (!projectName) {
      return errorResponse('Project name is required');
    }

    // Get total questions count
    const questionsCount = await query(
      'SELECT COUNT(*) as total FROM website_questions WHERE is_active = true'
    );

    const totalQuestions = parseInt(questionsCount[0].total);

    const newProject = await query(
      `INSERT INTO website_projects (
        project_name, company_id, contact_id, domain,
        status, total_questions, created_by
      )
      VALUES ($1, $2, $3, $4, 'questionnaire', $5, $6)
      RETURNING *`,
      [projectName, companyId, contactId, domain, totalQuestions, user.userId]
    );

    return successResponse(newProject[0], 'Website project created successfully', 201);
  } catch (error: any) {
    console.error('Create website project error:', error);
    return errorResponse(error.message || 'Failed to create website project', 500);
  }
}
