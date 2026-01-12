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

// Round Robin Assignment - Distributes leads evenly across sales team
export async function assignLeadRoundRobin(
  leadId: string,
  assignedByUserId: string
): Promise<string | null> {
  // Get all active sales representatives
  const availableSalesReps = await query(
    `SELECT id, name, email
     FROM users
     WHERE role IN ('sales_rep', 'sales_manager')
     AND is_active = true
     ORDER BY last_login DESC`
  );

  if (availableSalesReps.length === 0) return null;

  // Find who was assigned the last lead
  const previousAssignments = await query(
    `SELECT assigned_to
     FROM domain_leads
     WHERE assigned_to IS NOT NULL
     ORDER BY updated_at DESC
     LIMIT 1`
  );

  let nextSalesRepIndex = 0;

  if (previousAssignments.length > 0) {
    const previouslyAssignedUserId = previousAssignments[0].assigned_to;
    const previousSalesRepIndex = availableSalesReps.findIndex(
      (salesRep: any) => salesRep.id === previouslyAssignedUserId
    );
    // Move to next rep in rotation
    nextSalesRepIndex = (previousSalesRepIndex + 1) % availableSalesReps.length;
  }

  const selectedSalesRep = availableSalesReps[nextSalesRepIndex];

  // Assign lead to selected sales rep
  await query(
    'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = $3',
    [selectedSalesRep.id, 'qualified', leadId]
  );

  // Get complete lead details for notification
  const leadDetails = await query('SELECT * FROM domain_leads WHERE id = $1', [leadId]);

  if (leadDetails.length > 0) {
    notifyLeadAssignment(leadDetails[0], selectedSalesRep.id, assignedByUserId);
  }

  return selectedSalesRep.id;
}

// Territory-Based Assignment - Assigns to sales rep covering specific territory
export async function assignLeadByTerritory(
  leadId: string,
  territoryName: string,
  assignedByUserId: string
): Promise<string | null> {
  // Get sales reps assigned to this territory
  const salesRepsInTerritory = await query(
    `SELECT user.id, user.name, user.email
     FROM users user
     WHERE user.role IN ('sales_rep', 'sales_manager')
     AND user.is_active = true
     -- TODO: Add territory matching logic when territories table is implemented
     LIMIT 1`
  );

  if (salesRepsInTerritory.length === 0) {
    // Fallback to round robin if no territory match found
    return assignLeadRoundRobin(leadId, assignedByUserId);
  }

  const selectedSalesRep = salesRepsInTerritory[0];

  // Assign lead to territory sales rep
  await query(
    'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = $3',
    [selectedSalesRep.id, 'qualified', leadId]
  );

  // Get complete lead details for notification
  const leadDetails = await query('SELECT * FROM domain_leads WHERE id = $1', [leadId]);

  if (leadDetails.length > 0) {
    notifyLeadAssignment(leadDetails[0], selectedSalesRep.id, assignedByUserId);
  }

  return selectedSalesRep.id;
}

// Workload-Based Assignment - Assigns to sales rep with fewest active leads
export async function assignLeadByWorkload(
  leadId: string,
  assignedByUserId: string
): Promise<string | null> {
  const salesRepsWithCurrentWorkload = await query(
    `SELECT user.id, user.name, user.email, COUNT(lead.id) as active_lead_count
     FROM users user
     LEFT JOIN domain_leads lead
       ON lead.assigned_to = user.id
       AND lead.status IN ('new', 'enriched', 'qualified', 'contacted')
     WHERE user.role IN ('sales_rep', 'sales_manager')
     AND user.is_active = true
     GROUP BY user.id, user.name, user.email
     ORDER BY active_lead_count ASC, RANDOM()
     LIMIT 1`
  );

  if (salesRepsWithCurrentWorkload.length === 0) return null;

  const salesRepWithLeastWorkload = salesRepsWithCurrentWorkload[0];

  // Assign lead to sales rep with lowest workload
  await query(
    'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = $3',
    [salesRepWithLeastWorkload.id, 'qualified', leadId]
  );

  // Get complete lead details for notification
  const leadDetails = await query('SELECT * FROM domain_leads WHERE id = $1', [leadId]);

  if (leadDetails.length > 0) {
    notifyLeadAssignment(leadDetails[0], salesRepWithLeastWorkload.id, assignedByUserId);
  }

  return salesRepWithLeastWorkload.id;
}

// Auto-assign based on lead quality score
export async function autoAssignLeadByScore(
  leadId: string,
  leadQualityScore: number
): Promise<string | null> {
  // High-value leads (score >= 80) should go to top-performing sales reps
  if (leadQualityScore >= 80) {
    const topPerformingSalesReps = await query(
      `SELECT user.id, user.name, user.email
       FROM users user
       WHERE user.role IN ('sales_manager', 'sales_rep')
       AND user.is_active = true
       -- TODO: Add performance metrics when tracking is implemented
       ORDER BY RANDOM()
       LIMIT 1`
    );

    if (topPerformingSalesReps.length > 0) {
      const selectedTopPerformer = topPerformingSalesReps[0];
      await query(
        'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = $3',
        [selectedTopPerformer.id, 'qualified', leadId]
      );
      return selectedTopPerformer.id;
    }
  }

  // For lower-scored leads, use workload-based assignment
  return assignLeadByWorkload(leadId, 'system');
}

// Bulk assignment - Assigns multiple leads to one sales rep at once
export async function bulkAssignLeads(
  leadIds: string[],
  assignToUserId: string,
  assignedByUserId: string
) {
  // Update all leads in bulk
  await query(
    'UPDATE domain_leads SET assigned_to = $1, status = $2 WHERE id = ANY($3)',
    [assignToUserId, 'qualified', leadIds]
  );

  // Get all assigned lead details for notifications
  const assignedLeadDetails = await query(
    'SELECT * FROM domain_leads WHERE id = ANY($1)',
    [leadIds]
  );

  // Send notification for each assigned lead
  assignedLeadDetails.forEach((leadDetail: any) => {
    notifyLeadAssignment(leadDetail, assignToUserId, assignedByUserId);
  });

  return assignedLeadDetails.length;
}

// Get assignment statistics for a sales rep or entire team
export async function getAssignmentStatistics(salesRepUserId?: string) {
  const sqlWhereClause = salesRepUserId ? 'WHERE assigned_to = $1' : '';
  const queryParameters = salesRepUserId ? [salesRepUserId] : [];

  const assignmentStats = await query(
    `SELECT
       COUNT(*) as total_leads_assigned,
       COUNT(CASE WHEN status = 'contacted' THEN 1 END) as leads_contacted,
       COUNT(CASE WHEN status = 'converted' THEN 1 END) as leads_converted,
       AVG(lead_score) as average_lead_score
     FROM domain_leads
     ${sqlWhereClause}`,
    queryParameters
  );

  return assignmentStats[0];
}
