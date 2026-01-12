import { query } from './db';
import { notifyLeadAssignment } from './websocket-server';

export interface AssignmentRule {
  type: 'round_robin' | 'territory' | 'skill' | 'workload' | 'manual';
  criteria?: {
    territory?: string[];
    skills?: string[];
    maxLeadsPerDay?: number;
    priorityThreshold?: number;
  };
}

// Round Robin Assignment
export async function assignLeadRoundRobin(leadId: string, assignedBy: string): Promise<string | null> {
  // Get active sales reps
  const salesReps = await query(
    `SELECT id, name, email
     FROM users
     WHERE role IN ('sales_rep', 'sales_manager')
     AND is_active = true
     ORDER BY last_login DESC`
  );

  if (salesReps.length === 0) return null;

  // Get last assigned rep
  const lastAssignment = await query(
    `SELECT assigned_to
     FROM domain_leads
     WHERE assigned_to IS NOT NULL
     ORDER BY updated_at DESC
     LIMIT 1`
  );

  let nextRepIndex = 0;

  if (lastAssignment.length > 0) {
    const lastRepId = lastAssignment[0].assigned_to;
    const lastRepIndex = salesReps.findIndex((rep: any) => rep.id === lastRepId);
    nextRepIndex = (lastRepIndex + 1) % salesReps.length;
  }

  const assignedRep = salesReps[nextRepIndex];

  // Update lead
  await query(
    'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = $3',
    [assignedRep.id, 'qualified', leadId]
  );

  // Get lead details
  const leads = await query('SELECT * FROM domain_leads WHERE id = $1', [leadId]);

  if (leads.length > 0) {
    notifyLeadAssignment(leads[0], assignedRep.id, assignedBy);
  }

  return assignedRep.id;
}

// Territory-Based Assignment
export async function assignLeadByTerritory(
  leadId: string,
  territory: string,
  assignedBy: string
): Promise<string | null> {
  // Get reps assigned to this territory
  const reps = await query(
    `SELECT u.id, u.name, u.email
     FROM users u
     WHERE u.role IN ('sales_rep', 'sales_manager')
     AND u.is_active = true
     -- Add territory matching logic here
     LIMIT 1`
  );

  if (reps.length === 0) {
    // Fallback to round robin
    return assignLeadRoundRobin(leadId, assignedBy);
  }

  const assignedRep = reps[0];

  await query(
    'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = $3',
    [assignedRep.id, 'qualified', leadId]
  );

  const leads = await query('SELECT * FROM domain_leads WHERE id = $1', [leadId]);

  if (leads.length > 0) {
    notifyLeadAssignment(leads[0], assignedRep.id, assignedBy);
  }

  return assignedRep.id;
}

// Workload-Based Assignment (Assign to rep with fewest active leads)
export async function assignLeadByWorkload(leadId: string, assignedBy: string): Promise<string | null> {
  const repsWithWorkload = await query(
    `SELECT u.id, u.name, u.email, COUNT(dl.id) as lead_count
     FROM users u
     LEFT JOIN domain_leads dl ON dl.assigned_to = u.id AND dl.status IN ('new', 'enriched', 'qualified', 'contacted')
     WHERE u.role IN ('sales_rep', 'sales_manager')
     AND u.is_active = true
     GROUP BY u.id, u.name, u.email
     ORDER BY lead_count ASC, RANDOM()
     LIMIT 1`
  );

  if (repsWithWorkload.length === 0) return null;

  const assignedRep = repsWithWorkload[0];

  await query(
    'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = $3',
    [assignedRep.id, 'qualified', leadId]
  );

  const leads = await query('SELECT * FROM domain_leads WHERE id = $1', [leadId]);

  if (leads.length > 0) {
    notifyLeadAssignment(leads[0], assignedRep.id, assignedBy);
  }

  return assignedRep.id;
}

// Auto-assign based on lead score
export async function autoAssignLead(leadId: string, leadScore: number): Promise<string | null> {
  // High-value leads (score >= 80) go to top performers
  if (leadScore >= 80) {
    const topPerformers = await query(
      `SELECT u.id, u.name, u.email
       FROM users u
       WHERE u.role IN ('sales_manager', 'sales_rep')
       AND u.is_active = true
       -- Add performance metrics here
       ORDER BY RANDOM()
       LIMIT 1`
    );

    if (topPerformers.length > 0) {
      const rep = topPerformers[0];
      await query(
        'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = $3',
        [rep.id, 'qualified', leadId]
      );
      return rep.id;
    }
  }

  // Default to workload-based assignment
  return assignLeadByWorkload(leadId, 'system');
}

// Bulk assignment
export async function bulkAssignLeads(leadIds: string[], assignToUserId: string, assignedBy: string) {
  await query(
    'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = ANY($3)',
    [assignToUserId, 'qualified', leadIds]
  );

  // Notify assigned user
  const leads = await query('SELECT * FROM domain_leads WHERE id = ANY($1)', [leadIds]);

  leads.forEach((lead: any) => {
    notifyLeadAssignment(lead, assignToUserId, assignedBy);
  });

  return leads.length;
}

// Get assignment statistics
export async function getAssignmentStats(userId?: string) {
  const whereClause = userId ? 'WHERE assigned_to = $1' : '';
  const params = userId ? [userId] : [];

  const stats = await query(
    `SELECT
       COUNT(*) as total_assigned,
       COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
       COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
       AVG(lead_score) as avg_score
     FROM domain_leads
     ${whereClause}`,
    params
  );

  return stats[0];
}
