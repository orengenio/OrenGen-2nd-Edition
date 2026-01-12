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
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) return unauthorizedResponse();

    if (!hasPermission(currentUser.role, 'leads', 'update')) {
      return forbiddenResponse();
    }

    const requestBody = await request.json();
    const { leadIds, assignTo, method = 'manual' } = requestBody;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return errorResponse('Lead IDs are required');
    }

    let assignmentResult;

    if (method === 'round_robin') {
      // Assign multiple leads using round robin distribution
      const successfulAssignments = [];
      for (const leadId of leadIds) {
        const assignedToUserId = await assignLeadRoundRobin(leadId, currentUser.userId);
        if (assignedToUserId) {
          successfulAssignments.push({ leadId, assignedToUserId });
        }
      }
      assignmentResult = {
        method: 'round_robin',
        assignments: successfulAssignments,
        totalAssigned: successfulAssignments.length,
      };
    } else if (method === 'workload') {
      // Assign multiple leads based on current workload
      const successfulAssignments = [];
      for (const leadId of leadIds) {
        const assignedToUserId = await assignLeadByWorkload(leadId, currentUser.userId);
        if (assignedToUserId) {
          successfulAssignments.push({ leadId, assignedToUserId });
        }
      }
      assignmentResult = {
        method: 'workload',
        assignments: successfulAssignments,
        totalAssigned: successfulAssignments.length,
      };
    } else if (method === 'manual' && assignTo) {
      // Manual assignment to specific user
      const assignedLeadsCount = await bulkAssignLeads(leadIds, assignTo, currentUser.userId);
      assignmentResult = {
        method: 'manual',
        assignedToUserId: assignTo,
        totalAssigned: assignedLeadsCount,
      };
    } else {
      return errorResponse('Invalid assignment method or missing assignTo parameter');
    }

    return successResponse(assignmentResult, 'Leads assigned successfully');
  } catch (error: any) {
    console.error('Lead assignment error:', error);
    return errorResponse(error.message || 'Failed to assign leads', 500);
  }
}

// GET /api/leads/assign/stats - Get assignment statistics
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId') || currentUser.userId;

    // Get assignment statistics for the requested user
    const assignmentStatistics = await query(
      `SELECT
         user.id,
         user.name,
         user.email,
         COUNT(lead.id) as total_leads_assigned,
         COUNT(CASE WHEN lead.status = 'contacted' THEN 1 END) as leads_contacted,
         COUNT(CASE WHEN lead.status = 'converted' THEN 1 END) as leads_converted,
         AVG(lead.lead_score) as average_lead_score,
         MAX(lead.updated_at) as last_assignment_date
       FROM users user
       LEFT JOIN domain_leads lead ON lead.assigned_to = user.id
       WHERE user.id = $1
       GROUP BY user.id, user.name, user.email`,
      [requestedUserId]
    );

    return successResponse(assignmentStatistics[0] || {});
  } catch (error: any) {
    console.error('Get assignment stats error:', error);
    return errorResponse(error.message || 'Failed to get stats', 500);
  }
}
