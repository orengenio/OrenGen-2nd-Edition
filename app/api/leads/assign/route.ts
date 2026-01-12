import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';
import {
  assignLeadRoundRobin,
  assignLeadByWorkload,
  bulkAssignLeads,
} from '@/lib/lead-assignment';

// POST /api/leads/assign - Assign lead(s) to user
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'update')) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const { leadIds, assignTo, method = 'manual' } = body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return errorResponse('Lead IDs are required');
    }

    let result;

    if (method === 'round_robin') {
      // Assign multiple leads using round robin
      const assignments = [];
      for (const leadId of leadIds) {
        const assignedTo = await assignLeadRoundRobin(leadId, user.userId);
        if (assignedTo) {
          assignments.push({ leadId, assignedTo });
        }
      }
      result = { method: 'round_robin', assignments };
    } else if (method === 'workload') {
      // Assign multiple leads based on workload
      const assignments = [];
      for (const leadId of leadIds) {
        const assignedTo = await assignLeadByWorkload(leadId, user.userId);
        if (assignedTo) {
          assignments.push({ leadId, assignedTo });
        }
      }
      result = { method: 'workload', assignments };
    } else if (method === 'manual' && assignTo) {
      // Manual assignment to specific user
      const count = await bulkAssignLeads(leadIds, assignTo, user.userId);
      result = { method: 'manual', assignedTo: assignTo, count };
    } else {
      return errorResponse('Invalid assignment method or missing assignTo parameter');
    }

    return successResponse(result, 'Leads assigned successfully');
  } catch (error: any) {
    console.error('Lead assignment error:', error);
    return errorResponse(error.message || 'Failed to assign leads', 500);
  }
}

// GET /api/leads/assign/stats - Get assignment statistics
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || user.userId;

    // Get assignment stats
    const stats = await query(
      `SELECT
         u.id,
         u.name,
         u.email,
         COUNT(dl.id) as total_assigned,
         COUNT(CASE WHEN dl.status = 'contacted' THEN 1 END) as contacted,
         COUNT(CASE WHEN dl.status = 'converted' THEN 1 END) as converted,
         AVG(dl.lead_score) as avg_score,
         MAX(dl.updated_at) as last_assignment
       FROM users u
       LEFT JOIN domain_leads dl ON dl.assigned_to = u.id
       WHERE u.id = $1
       GROUP BY u.id, u.name, u.email`,
      [userId]
    );

    return successResponse(stats[0] || {});
  } catch (error: any) {
    console.error('Get assignment stats error:', error);
    return errorResponse(error.message || 'Failed to get stats', 500);
  }
}
