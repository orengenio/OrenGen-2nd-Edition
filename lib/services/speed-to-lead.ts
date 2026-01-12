/**
 * Speed-to-Lead Service
 * Handles instant notifications, auto-assignment, and SLA tracking
 * Critical for fast response times to new leads
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Types
export interface SpeedToLeadConfig {
  id: string;
  tenant_id: string;
  enabled: boolean;
  // Auto-assignment
  auto_assign_enabled: boolean;
  assignment_strategy: 'round_robin' | 'least_loaded' | 'by_score' | 'by_territory';
  assignable_users: string[];
  // SLA
  sla_enabled: boolean;
  sla_first_response_minutes: number;
  sla_follow_up_minutes: number;
  // Notifications
  notify_on_new_lead: boolean;
  notify_on_high_score: boolean;
  high_score_threshold: number;
  notification_channels: ('email' | 'sms' | 'webhook' | 'slack')[];
  // Escalation
  escalation_enabled: boolean;
  escalation_after_minutes: number;
  escalation_to: string[];
  created_at: string;
  updated_at: string;
}

export interface LeadAssignment {
  id: string;
  lead_id: string;
  assigned_to: string;
  assigned_at: string;
  assigned_by: string | null;
  assignment_reason: 'auto_round_robin' | 'auto_least_loaded' | 'auto_score' | 'auto_territory' | 'manual';
  sla_deadline: string | null;
  first_response_at: string | null;
  sla_met: boolean | null;
}

export interface LeadNotification {
  id: string;
  lead_id: string;
  type: 'new_lead' | 'high_score' | 'sla_warning' | 'sla_breach' | 'escalation';
  channel: 'email' | 'sms' | 'webhook' | 'slack';
  recipient: string;
  sent_at: string;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
}

// Round-robin tracker (in production, use Redis)
const roundRobinIndex: Record<string, number> = {};

export class SpeedToLeadService {
  private tenantId: string;
  private config: SpeedToLeadConfig | null = null;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  // Load configuration
  async loadConfig(): Promise<SpeedToLeadConfig | null> {
    const { data, error } = await supabase
      .from('speed_to_lead_config')
      .select('*')
      .eq('tenant_id', this.tenantId)
      .single();

    if (error || !data) {
      return null;
    }

    this.config = data as SpeedToLeadConfig;
    return this.config;
  }

  // Save/update configuration
  async saveConfig(config: Partial<SpeedToLeadConfig>): Promise<SpeedToLeadConfig> {
    const { data, error } = await supabase
      .from('speed_to_lead_config')
      .upsert({
        ...config,
        tenant_id: this.tenantId,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to save config: ${error.message}`);
    this.config = data as SpeedToLeadConfig;
    return this.config;
  }

  // Process new lead - main entry point
  async processNewLead(lead: {
    id: string;
    domain: string;
    lead_score: number;
    source?: string;
  }): Promise<{
    assigned_to: string | null;
    notifications_sent: number;
    sla_deadline: string | null;
  }> {
    if (!this.config) {
      await this.loadConfig();
    }

    if (!this.config?.enabled) {
      return { assigned_to: null, notifications_sent: 0, sla_deadline: null };
    }

    let assignedTo: string | null = null;
    let notificationsSent = 0;
    let slaDeadline: string | null = null;

    // Auto-assignment
    if (this.config.auto_assign_enabled && this.config.assignable_users.length > 0) {
      assignedTo = await this.autoAssignLead(lead);

      // Set SLA deadline
      if (this.config.sla_enabled && assignedTo) {
        slaDeadline = new Date(
          Date.now() + this.config.sla_first_response_minutes * 60 * 1000
        ).toISOString();

        await this.createAssignmentRecord(lead.id, assignedTo, slaDeadline);
      }
    }

    // Send notifications
    if (this.config.notify_on_new_lead) {
      notificationsSent += await this.sendNewLeadNotifications(lead, assignedTo);
    }

    // High score notification
    if (
      this.config.notify_on_high_score &&
      lead.lead_score >= this.config.high_score_threshold
    ) {
      notificationsSent += await this.sendHighScoreNotifications(lead);
    }

    // Schedule SLA check
    if (this.config.sla_enabled && slaDeadline) {
      await this.scheduleSLACheck(lead.id, slaDeadline);
    }

    return { assigned_to: assignedTo, notifications_sent: notificationsSent, sla_deadline: slaDeadline };
  }

  // Auto-assign lead based on strategy
  private async autoAssignLead(lead: { id: string; lead_score: number }): Promise<string> {
    if (!this.config) throw new Error('Config not loaded');

    const users = this.config.assignable_users;
    let selectedUser: string;

    switch (this.config.assignment_strategy) {
      case 'round_robin':
        selectedUser = this.roundRobinAssign(users);
        break;
      case 'least_loaded':
        selectedUser = await this.leastLoadedAssign(users);
        break;
      case 'by_score':
        selectedUser = await this.scoreBasedAssign(users, lead.lead_score);
        break;
      case 'by_territory':
        selectedUser = await this.territoryBasedAssign(users, lead);
        break;
      default:
        selectedUser = users[0];
    }

    // Update lead with assignment
    await supabase
      .from('domain_leads')
      .update({
        assigned_to: selectedUser,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead.id);

    return selectedUser;
  }

  // Round-robin assignment
  private roundRobinAssign(users: string[]): string {
    const key = this.tenantId;
    if (!roundRobinIndex[key]) roundRobinIndex[key] = 0;

    const user = users[roundRobinIndex[key] % users.length];
    roundRobinIndex[key]++;

    return user;
  }

  // Least-loaded assignment
  private async leastLoadedAssign(users: string[]): Promise<string> {
    const { data } = await supabase
      .from('domain_leads')
      .select('assigned_to')
      .in('assigned_to', users)
      .in('status', ['new', 'enriched', 'qualified', 'contacted']);

    const counts: Record<string, number> = {};
    users.forEach(u => counts[u] = 0);

    data?.forEach(lead => {
      if (lead.assigned_to) counts[lead.assigned_to]++;
    });

    return Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0];
  }

  // Score-based assignment (high scores to senior reps)
  private async scoreBasedAssign(users: string[], score: number): Promise<string> {
    // High score leads go to first user (assume sorted by seniority)
    if (score >= 70) return users[0];
    if (score >= 50) return users[Math.min(1, users.length - 1)];
    return users[users.length - 1];
  }

  // Territory-based assignment
  private async territoryBasedAssign(users: string[], lead: any): Promise<string> {
    // Would use lead location data - fallback to round robin
    return this.roundRobinAssign(users);
  }

  // Create assignment record
  private async createAssignmentRecord(
    leadId: string,
    assignedTo: string,
    slaDeadline: string | null
  ): Promise<void> {
    await supabase.from('lead_assignments').insert({
      lead_id: leadId,
      assigned_to: assignedTo,
      assigned_at: new Date().toISOString(),
      assignment_reason: `auto_${this.config!.assignment_strategy}`,
      sla_deadline: slaDeadline,
    });
  }

  // Send new lead notifications
  private async sendNewLeadNotifications(
    lead: { id: string; domain: string; lead_score: number },
    assignedTo: string | null
  ): Promise<number> {
    if (!this.config) return 0;

    let sent = 0;
    const recipients = assignedTo ? [assignedTo] : this.config.assignable_users;

    for (const channel of this.config.notification_channels) {
      for (const recipient of recipients) {
        await this.queueNotification({
          lead_id: lead.id,
          type: 'new_lead',
          channel,
          recipient,
          data: {
            domain: lead.domain,
            score: lead.lead_score,
            assigned_to: assignedTo,
          },
        });
        sent++;
      }
    }

    return sent;
  }

  // Send high score notifications
  private async sendHighScoreNotifications(
    lead: { id: string; domain: string; lead_score: number }
  ): Promise<number> {
    if (!this.config) return 0;

    let sent = 0;

    for (const channel of this.config.notification_channels) {
      for (const user of this.config.assignable_users) {
        await this.queueNotification({
          lead_id: lead.id,
          type: 'high_score',
          channel,
          recipient: user,
          data: {
            domain: lead.domain,
            score: lead.lead_score,
            message: `High-value lead detected: ${lead.domain} (Score: ${lead.lead_score})`,
          },
        });
        sent++;
      }
    }

    return sent;
  }

  // Queue notification for sending
  private async queueNotification(notification: {
    lead_id: string;
    type: LeadNotification['type'];
    channel: LeadNotification['channel'];
    recipient: string;
    data: any;
  }): Promise<void> {
    await supabase.from('lead_notifications').insert({
      ...notification,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
  }

  // Schedule SLA check (would use job queue in production)
  private async scheduleSLACheck(leadId: string, deadline: string): Promise<void> {
    await supabase.from('scheduled_jobs').insert({
      type: 'sla_check',
      payload: { lead_id: leadId, deadline },
      run_at: deadline,
      status: 'pending',
    });
  }

  // Check SLA status for a lead
  async checkSLAStatus(leadId: string): Promise<{
    status: 'ok' | 'warning' | 'breached';
    deadline: string | null;
    time_remaining_minutes: number | null;
  }> {
    const { data: assignment } = await supabase
      .from('lead_assignments')
      .select('*')
      .eq('lead_id', leadId)
      .order('assigned_at', { ascending: false })
      .limit(1)
      .single();

    if (!assignment?.sla_deadline) {
      return { status: 'ok', deadline: null, time_remaining_minutes: null };
    }

    const deadline = new Date(assignment.sla_deadline);
    const now = new Date();
    const remainingMs = deadline.getTime() - now.getTime();
    const remainingMinutes = Math.floor(remainingMs / 60000);

    if (assignment.first_response_at) {
      return { status: 'ok', deadline: assignment.sla_deadline, time_remaining_minutes: remainingMinutes };
    }

    if (remainingMinutes <= 0) {
      return { status: 'breached', deadline: assignment.sla_deadline, time_remaining_minutes: 0 };
    }

    if (remainingMinutes <= 5) {
      return { status: 'warning', deadline: assignment.sla_deadline, time_remaining_minutes: remainingMinutes };
    }

    return { status: 'ok', deadline: assignment.sla_deadline, time_remaining_minutes: remainingMinutes };
  }

  // Record first response (marks SLA as met/missed)
  async recordFirstResponse(leadId: string): Promise<boolean> {
    const { data: assignment } = await supabase
      .from('lead_assignments')
      .select('*')
      .eq('lead_id', leadId)
      .order('assigned_at', { ascending: false })
      .limit(1)
      .single();

    if (!assignment) return false;

    const now = new Date();
    const slaMet = assignment.sla_deadline
      ? now <= new Date(assignment.sla_deadline)
      : true;

    await supabase
      .from('lead_assignments')
      .update({
        first_response_at: now.toISOString(),
        sla_met: slaMet,
      })
      .eq('id', assignment.id);

    return slaMet;
  }

  // Get SLA metrics for dashboard
  async getSLAMetrics(days: number = 30): Promise<{
    total_assignments: number;
    sla_met: number;
    sla_breached: number;
    sla_pending: number;
    avg_response_time_minutes: number;
    sla_compliance_rate: number;
  }> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data: assignments } = await supabase
      .from('lead_assignments')
      .select('*')
      .gte('assigned_at', since);

    if (!assignments || assignments.length === 0) {
      return {
        total_assignments: 0,
        sla_met: 0,
        sla_breached: 0,
        sla_pending: 0,
        avg_response_time_minutes: 0,
        sla_compliance_rate: 100,
      };
    }

    const slaMet = assignments.filter(a => a.sla_met === true).length;
    const slaBreached = assignments.filter(a => a.sla_met === false).length;
    const slaPending = assignments.filter(a => a.sla_met === null && a.sla_deadline).length;

    // Calculate average response time
    const responseTimes = assignments
      .filter(a => a.first_response_at && a.assigned_at)
      .map(a => {
        const assigned = new Date(a.assigned_at).getTime();
        const responded = new Date(a.first_response_at).getTime();
        return (responded - assigned) / 60000;
      });

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    const complianceRate = (slaMet + slaBreached) > 0
      ? (slaMet / (slaMet + slaBreached)) * 100
      : 100;

    return {
      total_assignments: assignments.length,
      sla_met: slaMet,
      sla_breached: slaBreached,
      sla_pending: slaPending,
      avg_response_time_minutes: Math.round(avgResponseTime),
      sla_compliance_rate: Math.round(complianceRate * 10) / 10,
    };
  }

  // Escalate lead
  async escalateLead(leadId: string, reason: string): Promise<void> {
    if (!this.config?.escalation_enabled) return;

    for (const userId of this.config.escalation_to) {
      for (const channel of this.config.notification_channels) {
        await this.queueNotification({
          lead_id: leadId,
          type: 'escalation',
          channel,
          recipient: userId,
          data: { reason, escalated_at: new Date().toISOString() },
        });
      }
    }

    // Update lead status
    await supabase
      .from('domain_leads')
      .update({
        notes: supabase.sql`COALESCE(notes, '') || '\n[ESCALATED] ' || ${reason}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);
  }
}

// Factory function
export function createSpeedToLeadService(tenantId: string): SpeedToLeadService {
  return new SpeedToLeadService(tenantId);
}
