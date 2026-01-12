/**
 * RFP Intelligence Service
 * Automated RFP discovery, analysis, response generation, and workflow management
 *
 * Features:
 * - Auto-discover RFPs matching company capabilities
 * - Simplify and extract key details
 * - Auto-respond when appropriate
 * - Calendar integration for deadlines/meetings
 * - Automated proposal workflow
 * - Human review notifications
 */

import { FederalOpportunity } from './federal-opportunities-service';

// Types
export interface CompanyCapabilities {
  id: string;
  name: string;
  naics_codes: string[];
  psc_codes: string[];
  set_asides: string[];
  keywords: string[];
  past_performance: PastPerformance[];
  certifications: string[];
  clearances: string[];
  team_size: number;
  annual_revenue: number;
  bonding_capacity: number;
  geographic_coverage: string[];
  core_competencies: string[];
  excluded_agencies?: string[];
  min_contract_value?: number;
  max_contract_value?: number;
}

export interface PastPerformance {
  id: string;
  title: string;
  agency: string;
  contract_number: string;
  value: number;
  start_date: string;
  end_date: string;
  description: string;
  poc_name: string;
  poc_email: string;
  poc_phone: string;
  relevance_keywords: string[];
}

export interface SimplifiedRFP {
  id: string;
  original_rfp: FederalOpportunity;
  simplified_at: Date;

  // Simplified/Extracted Details
  summary: {
    one_liner: string;
    what_they_need: string;
    who_can_bid: string;
    timeline: string;
    estimated_value: string;
  };

  // Key Requirements
  requirements: {
    technical: string[];
    personnel: string[];
    certifications: string[];
    clearances: string[];
    experience: string[];
  };

  // Important Dates
  key_dates: {
    posted: Date;
    questions_due?: Date;
    site_visit?: Date;
    proposal_due: Date;
    anticipated_award?: Date;
  };

  // Evaluation Criteria
  evaluation: {
    criteria: { name: string; weight: number }[];
    submission_format: string;
    page_limits?: Record<string, number>;
  };

  // Match Analysis
  match_analysis: {
    overall_score: number;
    strengths: string[];
    weaknesses: string[];
    gaps: string[];
    go_no_go_recommendation: 'strong_go' | 'go' | 'maybe' | 'no_go';
    reasoning: string;
  };

  // Compliance Matrix
  compliance_items: ComplianceItem[];

  // Action Items
  action_items: ActionItem[];
}

export interface ComplianceItem {
  id: string;
  requirement: string;
  section_reference: string;
  response_status: 'not_started' | 'in_progress' | 'compliant' | 'needs_review' | 'non_compliant';
  assigned_to?: string;
  notes?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  due_date: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assigned_to?: string;
  type: 'meeting' | 'document' | 'research' | 'review' | 'submission' | 'communication';
  calendar_event_id?: string;
  auto_created: boolean;
}

export interface RFPWorkflow {
  id: string;
  rfp_id: string;
  status: RFPWorkflowStatus;
  started_at: Date;
  updated_at: Date;
  completed_at?: Date;

  // Workflow Steps
  steps: WorkflowStep[];

  // Team
  team: {
    capture_manager?: string;
    proposal_manager?: string;
    technical_lead?: string;
    pricing_lead?: string;
    reviewers: string[];
  };

  // Documents
  documents: {
    questions_submitted?: { id: string; submitted_at: Date };
    proposal_draft?: { id: string; version: number; updated_at: Date };
    final_proposal?: { id: string; submitted_at: Date };
    past_performance?: { id: string; records: string[] };
  };

  // Notifications
  notifications_sent: NotificationRecord[];
}

export type RFPWorkflowStatus =
  | 'discovered'
  | 'analyzing'
  | 'go_no_go_pending'
  | 'pursuing'
  | 'questions_phase'
  | 'proposal_development'
  | 'internal_review'
  | 'final_review'
  | 'submitted'
  | 'awaiting_award'
  | 'won'
  | 'lost'
  | 'no_bid';

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  started_at?: Date;
  completed_at?: Date;
  auto_completed: boolean;
  notes?: string;
}

export interface NotificationRecord {
  id: string;
  type: 'email' | 'sms' | 'in_app' | 'slack' | 'teams';
  recipient: string;
  subject: string;
  sent_at: Date;
  trigger: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: 'deadline' | 'meeting' | 'site_visit' | 'review' | 'reminder';
  rfp_id: string;
  attendees?: string[];
  location?: string;
  video_link?: string;
  reminders: { minutes_before: number; method: 'email' | 'popup' }[];
}

export interface AutoResponseConfig {
  enabled: boolean;
  respond_to_types: ('sources_sought' | 'rfi' | 'questions')[];
  require_approval: boolean;
  templates: Record<string, string>;
}

// RFP Intelligence Service
export class RFPIntelligenceService {
  private tenantId: string;
  private capabilities: CompanyCapabilities | null = null;
  private autoResponseConfig: AutoResponseConfig;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
    this.autoResponseConfig = {
      enabled: true,
      respond_to_types: ['sources_sought', 'rfi'],
      require_approval: true,
      templates: {}
    };
  }

  // Set company capabilities
  setCapabilities(capabilities: CompanyCapabilities): void {
    this.capabilities = capabilities;
  }

  // Auto-discover matching RFPs
  async discoverMatchingRFPs(opportunities: FederalOpportunity[]): Promise<SimplifiedRFP[]> {
    if (!this.capabilities) {
      throw new Error('Company capabilities not set');
    }

    const matchingRFPs: SimplifiedRFP[] = [];

    for (const opp of opportunities) {
      const matchScore = this.calculateMatchScore(opp);

      // Only process opportunities that meet minimum threshold
      if (matchScore >= 60) {
        const simplified = await this.simplifyRFP(opp, matchScore);
        matchingRFPs.push(simplified);
      }
    }

    // Sort by match score
    return matchingRFPs.sort((a, b) => b.match_analysis.overall_score - a.match_analysis.overall_score);
  }

  // Calculate match score
  private calculateMatchScore(opp: FederalOpportunity): number {
    if (!this.capabilities) return 0;

    let score = 0;
    const reasons: string[] = [];

    // NAICS match (25 points)
    if (opp.naics_code && this.capabilities.naics_codes.includes(opp.naics_code)) {
      score += 25;
      reasons.push('NAICS code match');
    }

    // PSC match (15 points)
    if (opp.psc_code && this.capabilities.psc_codes.includes(opp.psc_code)) {
      score += 15;
      reasons.push('PSC code match');
    }

    // Set-aside eligibility (20 points)
    if (opp.set_aside_code && this.capabilities.set_asides.includes(opp.set_aside_code)) {
      score += 20;
      reasons.push('Eligible for set-aside');
    }

    // Keyword matching (20 points max)
    const oppText = `${opp.title} ${opp.description}`.toLowerCase();
    let keywordScore = 0;
    for (const keyword of this.capabilities.keywords) {
      if (oppText.includes(keyword.toLowerCase())) {
        keywordScore += 4;
      }
    }
    score += Math.min(keywordScore, 20);

    // Past performance with agency (10 points)
    const hasAgencyExperience = this.capabilities.past_performance.some(
      pp => pp.agency.toLowerCase().includes(opp.agency.toLowerCase())
    );
    if (hasAgencyExperience) {
      score += 10;
      reasons.push('Past performance with agency');
    }

    // Geographic coverage (5 points)
    if (opp.place_of_performance?.state) {
      if (this.capabilities.geographic_coverage.includes(opp.place_of_performance.state) ||
          this.capabilities.geographic_coverage.includes('nationwide')) {
        score += 5;
      }
    }

    // Contract value fit (5 points)
    if (opp.estimated_value) {
      const avgValue = ((opp.estimated_value.min || 0) + (opp.estimated_value.max || 0)) / 2;
      if ((!this.capabilities.min_contract_value || avgValue >= this.capabilities.min_contract_value) &&
          (!this.capabilities.max_contract_value || avgValue <= this.capabilities.max_contract_value)) {
        score += 5;
      }
    }

    return Math.min(score, 100);
  }

  // Simplify RFP - Extract key details
  async simplifyRFP(opp: FederalOpportunity, matchScore: number): Promise<SimplifiedRFP> {
    const analysis = this.analyzeMatch(opp, matchScore);

    // Generate one-liner summary
    const oneLiner = this.generateOneLiner(opp);

    // Extract requirements from description
    const requirements = this.extractRequirements(opp);

    // Parse dates
    const keyDates = this.extractKeyDates(opp);

    // Generate action items
    const actionItems = this.generateActionItems(opp, keyDates);

    // Create compliance items
    const complianceItems = this.generateComplianceItems(opp);

    return {
      id: `simplified-${opp.id}`,
      original_rfp: opp,
      simplified_at: new Date(),

      summary: {
        one_liner: oneLiner,
        what_they_need: this.summarizeNeed(opp),
        who_can_bid: this.summarizeEligibility(opp),
        timeline: this.summarizeTimeline(opp),
        estimated_value: opp.estimated_value
          ? `$${(opp.estimated_value.min || 0).toLocaleString()} - $${(opp.estimated_value.max || 0).toLocaleString()}`
          : 'Not specified'
      },

      requirements,
      key_dates: keyDates,

      evaluation: {
        criteria: this.extractEvaluationCriteria(opp),
        submission_format: 'Electronic via SAM.gov',
        page_limits: { technical: 25, past_performance: 10, pricing: 15 }
      },

      match_analysis: analysis,
      compliance_items: complianceItems,
      action_items: actionItems
    };
  }

  // Generate one-liner summary
  private generateOneLiner(opp: FederalOpportunity): string {
    const agency = opp.agency.split(' ').slice(0, 3).join(' ');
    const type = opp.type.toLowerCase();
    const valueStr = opp.estimated_value?.max
      ? ` (~$${(opp.estimated_value.max / 1000000).toFixed(1)}M)`
      : '';

    return `${agency} ${type} for ${this.extractMainService(opp.title)}${valueStr}`;
  }

  // Extract main service from title
  private extractMainService(title: string): string {
    // Remove common prefixes and clean up
    return title
      .replace(/^(request for|solicitation for|sources sought for|rfi for)/i, '')
      .trim()
      .toLowerCase();
  }

  // Summarize what they need
  private summarizeNeed(opp: FederalOpportunity): string {
    const desc = opp.description.slice(0, 500);
    // Extract key services mentioned
    const services: string[] = [];

    const servicePatterns = [
      /provides?\s+(\w+\s+\w+\s+services)/gi,
      /requires?\s+(\w+\s+\w+\s+support)/gi,
      /seeking?\s+(\w+\s+\w+)/gi
    ];

    for (const pattern of servicePatterns) {
      const matches = desc.match(pattern);
      if (matches) {
        services.push(...matches.slice(0, 3));
      }
    }

    if (services.length > 0) {
      return services.join('; ');
    }

    return desc.split('.')[0] + '.';
  }

  // Summarize eligibility
  private summarizeEligibility(opp: FederalOpportunity): string {
    const parts: string[] = [];

    if (opp.set_aside) {
      parts.push(opp.set_aside);
    } else {
      parts.push('Full and open competition');
    }

    if (opp.naics_code) {
      parts.push(`NAICS ${opp.naics_code}`);
    }

    return parts.join(' | ');
  }

  // Summarize timeline
  private summarizeTimeline(opp: FederalOpportunity): string {
    const deadline = new Date(opp.response_deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return 'DEADLINE PASSED';
    } else if (daysLeft === 0) {
      return 'DUE TODAY';
    } else if (daysLeft <= 7) {
      return `${daysLeft} days left - URGENT`;
    } else if (daysLeft <= 30) {
      return `${daysLeft} days left`;
    } else {
      return `${Math.ceil(daysLeft / 7)} weeks left`;
    }
  }

  // Extract requirements
  private extractRequirements(opp: FederalOpportunity): SimplifiedRFP['requirements'] {
    const desc = opp.description.toLowerCase();

    return {
      technical: this.extractListItems(desc, ['must', 'shall', 'required to']),
      personnel: this.extractPersonnelRequirements(desc),
      certifications: this.extractCertifications(desc),
      clearances: this.extractClearances(desc),
      experience: this.extractExperienceRequirements(desc)
    };
  }

  // Extract list items based on keywords
  private extractListItems(text: string, keywords: string[]): string[] {
    const items: string[] = [];
    const sentences = text.split(/[.;]/);

    for (const sentence of sentences) {
      for (const keyword of keywords) {
        if (sentence.includes(keyword)) {
          const cleaned = sentence.trim().slice(0, 200);
          if (cleaned.length > 10) {
            items.push(cleaned);
          }
        }
      }
    }

    return items.slice(0, 10);
  }

  // Extract personnel requirements
  private extractPersonnelRequirements(text: string): string[] {
    const requirements: string[] = [];

    const roles = [
      'project manager', 'technical lead', 'senior engineer', 'developer',
      'analyst', 'architect', 'administrator', 'specialist', 'consultant'
    ];

    for (const role of roles) {
      if (text.includes(role)) {
        requirements.push(role.charAt(0).toUpperCase() + role.slice(1));
      }
    }

    return requirements;
  }

  // Extract certifications
  private extractCertifications(text: string): string[] {
    const certs: string[] = [];

    const certPatterns = [
      'iso 9001', 'iso 27001', 'cmmi', 'pmp', 'cissp', 'cism', 'aws certified',
      'azure certified', 'fedramp', 'fisma', 'hipaa', 'sox'
    ];

    for (const cert of certPatterns) {
      if (text.includes(cert)) {
        certs.push(cert.toUpperCase());
      }
    }

    return certs;
  }

  // Extract clearance requirements
  private extractClearances(text: string): string[] {
    const clearances: string[] = [];

    if (text.includes('top secret') || text.includes('ts/sci')) {
      clearances.push('Top Secret/SCI');
    } else if (text.includes('secret clearance') || text.includes('secret level')) {
      clearances.push('Secret');
    } else if (text.includes('public trust')) {
      clearances.push('Public Trust');
    }

    return clearances;
  }

  // Extract experience requirements
  private extractExperienceRequirements(text: string): string[] {
    const requirements: string[] = [];

    const expPatterns = [
      /(\d+)\s*years?\s+(of\s+)?experience/gi,
      /minimum\s+(\d+)\s*years/gi,
      /at\s+least\s+(\d+)\s*years/gi
    ];

    for (const pattern of expPatterns) {
      const match = text.match(pattern);
      if (match) {
        requirements.push(match[0]);
      }
    }

    return requirements;
  }

  // Extract key dates
  private extractKeyDates(opp: FederalOpportunity): SimplifiedRFP['key_dates'] {
    return {
      posted: new Date(opp.posted_date),
      proposal_due: new Date(opp.response_deadline)
    };
  }

  // Extract evaluation criteria
  private extractEvaluationCriteria(opp: FederalOpportunity): { name: string; weight: number }[] {
    // Default LPTA or Best Value criteria
    const desc = opp.description.toLowerCase();

    if (desc.includes('lowest price') || desc.includes('lpta')) {
      return [
        { name: 'Technical Acceptability', weight: 50 },
        { name: 'Price', weight: 50 }
      ];
    }

    return [
      { name: 'Technical Approach', weight: 35 },
      { name: 'Past Performance', weight: 25 },
      { name: 'Management Approach', weight: 20 },
      { name: 'Price', weight: 20 }
    ];
  }

  // Analyze match
  private analyzeMatch(opp: FederalOpportunity, score: number): SimplifiedRFP['match_analysis'] {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const gaps: string[] = [];

    if (!this.capabilities) {
      return {
        overall_score: score,
        strengths: [],
        weaknesses: ['Capabilities not configured'],
        gaps: [],
        go_no_go_recommendation: 'no_go',
        reasoning: 'Cannot analyze without company capabilities'
      };
    }

    // Check NAICS
    if (opp.naics_code && this.capabilities.naics_codes.includes(opp.naics_code)) {
      strengths.push(`Direct NAICS match (${opp.naics_code})`);
    } else if (opp.naics_code) {
      gaps.push(`NAICS ${opp.naics_code} not in our registered codes`);
    }

    // Check set-aside
    if (opp.set_aside_code) {
      if (this.capabilities.set_asides.includes(opp.set_aside_code)) {
        strengths.push(`Eligible for ${opp.set_aside}`);
      } else {
        weaknesses.push(`Not eligible for ${opp.set_aside}`);
      }
    }

    // Check agency experience
    const agencyExp = this.capabilities.past_performance.find(
      pp => pp.agency.toLowerCase().includes(opp.agency.toLowerCase())
    );
    if (agencyExp) {
      strengths.push(`Past performance with ${opp.agency}`);
    } else {
      weaknesses.push(`No past performance with ${opp.agency}`);
    }

    // Determine recommendation
    let recommendation: SimplifiedRFP['match_analysis']['go_no_go_recommendation'];
    let reasoning: string;

    if (score >= 85) {
      recommendation = 'strong_go';
      reasoning = 'Excellent fit with strong competitive position';
    } else if (score >= 70) {
      recommendation = 'go';
      reasoning = 'Good fit with some minor gaps to address';
    } else if (score >= 55) {
      recommendation = 'maybe';
      reasoning = 'Potential fit but significant gaps need evaluation';
    } else {
      recommendation = 'no_go';
      reasoning = 'Poor fit - recommend no-bid';
    }

    return {
      overall_score: score,
      strengths,
      weaknesses,
      gaps,
      go_no_go_recommendation: recommendation,
      reasoning
    };
  }

  // Generate action items
  private generateActionItems(opp: FederalOpportunity, dates: SimplifiedRFP['key_dates']): ActionItem[] {
    const items: ActionItem[] = [];
    const now = new Date();
    const deadline = dates.proposal_due;
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Go/No-Go Decision
    items.push({
      id: `action-${opp.id}-1`,
      title: 'Go/No-Go Decision Meeting',
      description: 'Review opportunity and make bid decision',
      due_date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
      priority: 'critical',
      status: 'pending',
      type: 'meeting',
      auto_created: true
    });

    // Questions deadline (if applicable)
    if (daysUntilDeadline > 14) {
      items.push({
        id: `action-${opp.id}-2`,
        title: 'Submit Clarification Questions',
        description: 'Prepare and submit questions to contracting officer',
        due_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        priority: 'high',
        status: 'pending',
        type: 'communication',
        auto_created: true
      });
    }

    // Technical approach
    items.push({
      id: `action-${opp.id}-3`,
      title: 'Draft Technical Approach',
      description: 'Develop technical solution and approach',
      due_date: new Date(deadline.getTime() - 10 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'pending',
      type: 'document',
      auto_created: true
    });

    // Past performance
    items.push({
      id: `action-${opp.id}-4`,
      title: 'Compile Past Performance',
      description: 'Gather and document relevant past performance',
      due_date: new Date(deadline.getTime() - 8 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'pending',
      type: 'document',
      auto_created: true
    });

    // Pricing
    items.push({
      id: `action-${opp.id}-5`,
      title: 'Develop Pricing',
      description: 'Create competitive pricing model',
      due_date: new Date(deadline.getTime() - 7 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'pending',
      type: 'document',
      auto_created: true
    });

    // Internal review
    items.push({
      id: `action-${opp.id}-6`,
      title: 'Internal Review (Pink Team)',
      description: 'Conduct internal review of proposal draft',
      due_date: new Date(deadline.getTime() - 5 * 24 * 60 * 60 * 1000),
      priority: 'high',
      status: 'pending',
      type: 'review',
      auto_created: true
    });

    // Final review
    items.push({
      id: `action-${opp.id}-7`,
      title: 'Final Review (Red Team)',
      description: 'Final compliance and quality review',
      due_date: new Date(deadline.getTime() - 3 * 24 * 60 * 60 * 1000),
      priority: 'critical',
      status: 'pending',
      type: 'review',
      auto_created: true
    });

    // Submission
    items.push({
      id: `action-${opp.id}-8`,
      title: 'Submit Proposal',
      description: 'Final submission to contracting officer',
      due_date: new Date(deadline.getTime() - 1 * 24 * 60 * 60 * 1000),
      priority: 'critical',
      status: 'pending',
      type: 'submission',
      auto_created: true
    });

    return items;
  }

  // Generate compliance items
  private generateComplianceItems(opp: FederalOpportunity): ComplianceItem[] {
    return [
      {
        id: `compliance-${opp.id}-1`,
        requirement: 'Technical Approach Volume',
        section_reference: 'Section L',
        response_status: 'not_started'
      },
      {
        id: `compliance-${opp.id}-2`,
        requirement: 'Past Performance Volume',
        section_reference: 'Section L',
        response_status: 'not_started'
      },
      {
        id: `compliance-${opp.id}-3`,
        requirement: 'Pricing Volume',
        section_reference: 'Section L',
        response_status: 'not_started'
      },
      {
        id: `compliance-${opp.id}-4`,
        requirement: 'Required Certifications',
        section_reference: 'Section K',
        response_status: 'not_started'
      },
      {
        id: `compliance-${opp.id}-5`,
        requirement: 'Reps & Certs',
        section_reference: 'Section K',
        response_status: 'not_started'
      }
    ];
  }

  // Create workflow for RFP
  async createWorkflow(simplifiedRFP: SimplifiedRFP): Promise<RFPWorkflow> {
    const workflow: RFPWorkflow = {
      id: `workflow-${simplifiedRFP.id}`,
      rfp_id: simplifiedRFP.id,
      status: 'discovered',
      started_at: new Date(),
      updated_at: new Date(),

      steps: [
        { id: 'step-1', name: 'Discovery', status: 'completed', auto_completed: true, completed_at: new Date() },
        { id: 'step-2', name: 'Analysis', status: 'completed', auto_completed: true, completed_at: new Date() },
        { id: 'step-3', name: 'Go/No-Go Decision', status: 'pending', auto_completed: false },
        { id: 'step-4', name: 'Questions Submission', status: 'pending', auto_completed: false },
        { id: 'step-5', name: 'Proposal Development', status: 'pending', auto_completed: false },
        { id: 'step-6', name: 'Internal Review', status: 'pending', auto_completed: false },
        { id: 'step-7', name: 'Final Review', status: 'pending', auto_completed: false },
        { id: 'step-8', name: 'Submission', status: 'pending', auto_completed: false },
        { id: 'step-9', name: 'Award Decision', status: 'pending', auto_completed: false }
      ],

      team: {
        reviewers: []
      },

      documents: {},
      notifications_sent: []
    };

    return workflow;
  }

  // Create calendar events for RFP
  async createCalendarEvents(simplifiedRFP: SimplifiedRFP): Promise<CalendarEvent[]> {
    const events: CalendarEvent[] = [];

    // Proposal deadline
    events.push({
      id: `cal-${simplifiedRFP.id}-deadline`,
      title: `DEADLINE: ${simplifiedRFP.original_rfp.title}`,
      description: `Proposal submission deadline for ${simplifiedRFP.original_rfp.notice_id}`,
      start: simplifiedRFP.key_dates.proposal_due,
      end: simplifiedRFP.key_dates.proposal_due,
      type: 'deadline',
      rfp_id: simplifiedRFP.id,
      reminders: [
        { minutes_before: 1440, method: 'email' }, // 1 day
        { minutes_before: 60, method: 'popup' }
      ]
    });

    // Add action item events
    for (const action of simplifiedRFP.action_items) {
      if (action.type === 'meeting' || action.type === 'review') {
        events.push({
          id: `cal-${action.id}`,
          title: action.title,
          description: action.description,
          start: action.due_date,
          end: new Date(action.due_date.getTime() + 60 * 60 * 1000), // 1 hour
          type: action.type === 'meeting' ? 'meeting' : 'review',
          rfp_id: simplifiedRFP.id,
          reminders: [
            { minutes_before: 30, method: 'popup' }
          ]
        });
      }
    }

    return events;
  }

  // Auto-respond to Sources Sought/RFI
  async generateAutoResponse(
    opp: FederalOpportunity,
    type: 'sources_sought' | 'rfi' | 'questions'
  ): Promise<{ subject: string; body: string; attachments?: string[] }> {
    if (!this.capabilities) {
      throw new Error('Company capabilities not set');
    }

    const templates: Record<string, (opp: FederalOpportunity, caps: CompanyCapabilities) => { subject: string; body: string }> = {
      sources_sought: (opp, caps) => ({
        subject: `Sources Sought Response: ${opp.notice_id} - ${caps.name}`,
        body: `
Dear Contracting Officer,

${caps.name} is pleased to respond to Sources Sought Notice ${opp.notice_id}: ${opp.title}.

COMPANY OVERVIEW:
${caps.name} is a ${caps.set_asides.join(', ')} firm with demonstrated experience in the services outlined in this notice.

RELEVANT CAPABILITIES:
${caps.core_competencies.map(c => `- ${c}`).join('\n')}

NAICS CODES:
${caps.naics_codes.join(', ')}

PAST PERFORMANCE:
${caps.past_performance.slice(0, 3).map(pp => `
- ${pp.title} (${pp.agency})
  Contract Value: $${pp.value.toLocaleString()}
  Period: ${pp.start_date} - ${pp.end_date}
`).join('\n')}

CERTIFICATIONS:
${caps.certifications.join(', ')}

We are highly interested in this opportunity and prepared to submit a competitive proposal when the solicitation is released.

Please do not hesitate to contact us with any questions.

Respectfully,
[Your Name]
${caps.name}
        `.trim()
      }),

      rfi: (opp, caps) => ({
        subject: `RFI Response: ${opp.notice_id} - ${caps.name}`,
        body: `Response to Request for Information ${opp.notice_id}...`
      }),

      questions: (opp, caps) => ({
        subject: `Clarification Questions: ${opp.notice_id}`,
        body: `Questions regarding solicitation ${opp.notice_id}...`
      })
    };

    return templates[type](opp, this.capabilities);
  }

  // Notify for human review
  async notifyForReview(
    workflow: RFPWorkflow,
    simplifiedRFP: SimplifiedRFP,
    stage: string,
    recipients: string[]
  ): Promise<void> {
    const notification: NotificationRecord = {
      id: `notif-${Date.now()}`,
      type: 'email',
      recipient: recipients.join(', '),
      subject: `[ACTION REQUIRED] ${stage}: ${simplifiedRFP.original_rfp.title}`,
      sent_at: new Date(),
      trigger: stage
    };

    // In production, send actual notification
    console.log('Sending notification:', notification);

    workflow.notifications_sent.push(notification);
  }

  // Generate proposal sections
  async generateProposalDraft(simplifiedRFP: SimplifiedRFP): Promise<{
    technical_approach: string;
    management_approach: string;
    past_performance: string;
    executive_summary: string;
  }> {
    if (!this.capabilities) {
      throw new Error('Company capabilities not set');
    }

    return {
      executive_summary: this.generateExecutiveSummary(simplifiedRFP),
      technical_approach: this.generateTechnicalApproach(simplifiedRFP),
      management_approach: this.generateManagementApproach(simplifiedRFP),
      past_performance: this.generatePastPerformance(simplifiedRFP)
    };
  }

  private generateExecutiveSummary(rfp: SimplifiedRFP): string {
    return `
EXECUTIVE SUMMARY

${this.capabilities!.name} is pleased to submit this proposal in response to ${rfp.original_rfp.notice_id}.

Our team brings proven experience in ${rfp.summary.what_they_need}, with direct past performance supporting ${rfp.original_rfp.agency}.

Key Differentiators:
${rfp.match_analysis.strengths.map(s => `- ${s}`).join('\n')}

We are committed to delivering exceptional results within budget and on schedule.
    `.trim();
  }

  private generateTechnicalApproach(rfp: SimplifiedRFP): string {
    return `
TECHNICAL APPROACH

1. Understanding of Requirements
${rfp.summary.what_they_need}

2. Proposed Solution
[AI-generated technical solution based on requirements]

3. Technical Capabilities
${this.capabilities!.core_competencies.map((c, i) => `${i + 1}. ${c}`).join('\n')}

4. Risk Mitigation
- Schedule risks: Experienced team with proven delivery record
- Technical risks: Robust QA processes
- Cost risks: Fixed-price commitment where applicable
    `.trim();
  }

  private generateManagementApproach(rfp: SimplifiedRFP): string {
    return `
MANAGEMENT APPROACH

1. Organization
Dedicated project team with clear roles and responsibilities

2. Communication
Regular status updates, weekly meetings, 24/7 support

3. Quality Assurance
ISO 9001 compliant processes, peer reviews, testing protocols

4. Schedule Management
Detailed project plan with milestones and deliverables
    `.trim();
  }

  private generatePastPerformance(rfp: SimplifiedRFP): string {
    const relevantPP = this.capabilities!.past_performance
      .slice(0, 3)
      .map(pp => `
CONTRACT: ${pp.title}
Agency: ${pp.agency}
Contract #: ${pp.contract_number}
Value: $${pp.value.toLocaleString()}
Period: ${pp.start_date} to ${pp.end_date}

Description: ${pp.description}

Relevance: ${pp.relevance_keywords.join(', ')}

Reference:
${pp.poc_name}
${pp.poc_email}
${pp.poc_phone}
      `);

    return `
PAST PERFORMANCE

${relevantPP.join('\n---\n')}
    `.trim();
  }
}

// Factory function
export function createRFPIntelligenceService(tenantId: string): RFPIntelligenceService {
  return new RFPIntelligenceService(tenantId);
}
