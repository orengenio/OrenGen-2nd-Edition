// AI Employees Service (Sintra.ai competitor)
// Pre-built AI workers with specific roles, personalities, and autonomous capabilities

export interface AIEmployee {
  id: string;
  name: string;
  role: EmployeeRole;
  avatar: string;
  personality: PersonalityProfile;
  skills: Skill[];
  integrations: string[];
  automations: EmployeeAutomation[];
  performance: EmployeePerformance;
  status: 'active' | 'paused' | 'training';
  work_schedule: WorkSchedule;
  created_at: Date;
}

export type EmployeeRole =
  | 'sdr' // Sales Development Rep
  | 'customer_success'
  | 'content_writer'
  | 'social_media_manager'
  | 'data_analyst'
  | 'recruiter'
  | 'executive_assistant'
  | 'researcher'
  | 'copywriter'
  | 'ad_manager'
  | 'seo_specialist'
  | 'email_marketer'
  | 'community_manager'
  | 'project_manager'
  | 'bookkeeper';

export interface PersonalityProfile {
  tone: 'professional' | 'friendly' | 'casual' | 'formal' | 'enthusiastic';
  communication_style: 'concise' | 'detailed' | 'conversational';
  response_speed: 'instant' | 'thoughtful' | 'human_paced';
  creativity_level: 'conservative' | 'balanced' | 'creative' | 'experimental';
  proactivity: 'reactive' | 'proactive' | 'highly_proactive';
  traits: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'communication' | 'analysis' | 'creative' | 'technical' | 'research' | 'management';
  proficiency: number; // 0-100
  description: string;
}

export interface EmployeeAutomation {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  conditions?: AutomationCondition[];
  enabled: boolean;
  runs_count: number;
  last_run?: Date;
}

export interface AutomationTrigger {
  type: 'schedule' | 'event' | 'webhook' | 'email_received' | 'form_submit' | 'slack_message' | 'calendar_event' | 'deal_stage_change' | 'manual';
  config: any;
}

export interface AutomationAction {
  type: 'send_email' | 'send_message' | 'create_task' | 'update_crm' | 'generate_content' | 'analyze_data' | 'research' | 'schedule_meeting' | 'post_social' | 'notify_human' | 'run_workflow';
  config: any;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: any;
}

export interface EmployeePerformance {
  tasks_completed: number;
  tasks_in_progress: number;
  avg_task_time: number; // minutes
  quality_score: number; // 0-100
  emails_sent: number;
  meetings_scheduled: number;
  content_created: number;
  leads_generated: number;
  revenue_influenced: number;
  customer_satisfaction: number;
  hours_saved: number;
}

export interface WorkSchedule {
  timezone: string;
  working_hours: {
    day: string;
    start: string;
    end: string;
  }[];
  holidays: Date[];
  max_tasks_per_day: number;
}

export interface Task {
  id: string;
  employee_id: string;
  type: TaskType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'needs_review';
  input: any;
  output?: any;
  started_at?: Date;
  completed_at?: Date;
  human_review_requested: boolean;
  feedback?: string;
}

export type TaskType =
  | 'email_outreach'
  | 'follow_up'
  | 'content_creation'
  | 'social_post'
  | 'data_analysis'
  | 'research'
  | 'meeting_prep'
  | 'report_generation'
  | 'lead_qualification'
  | 'customer_response'
  | 'ad_optimization'
  | 'seo_audit'
  | 'competitor_analysis'
  | 'scheduling'
  | 'summarization';

export interface EmployeeTemplate {
  id: string;
  name: string;
  role: EmployeeRole;
  avatar: string;
  description: string;
  personality: PersonalityProfile;
  default_skills: Skill[];
  default_automations: Omit<EmployeeAutomation, 'id' | 'runs_count' | 'last_run'>[];
  use_cases: string[];
  category: string;
}

export interface Conversation {
  id: string;
  employee_id: string;
  messages: ConversationMessage[];
  context: any;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'employee';
  content: string;
  timestamp: Date;
  attachments?: { name: string; url: string; type: string }[];
}

// Pre-built AI Employee Templates
const EMPLOYEE_TEMPLATES: EmployeeTemplate[] = [
  {
    id: 'sofia_sdr',
    name: 'Sofia',
    role: 'sdr',
    avatar: '/employees/sofia.png',
    description: 'Expert at cold outreach, lead qualification, and booking meetings. Sofia handles your entire top-of-funnel sales process.',
    personality: {
      tone: 'friendly',
      communication_style: 'conversational',
      response_speed: 'human_paced',
      creativity_level: 'balanced',
      proactivity: 'highly_proactive',
      traits: ['persistent', 'empathetic', 'results-driven']
    },
    default_skills: [
      { id: 'skill_1', name: 'Cold Email', category: 'communication', proficiency: 95, description: 'Craft personalized cold emails that get responses' },
      { id: 'skill_2', name: 'LinkedIn Outreach', category: 'communication', proficiency: 90, description: 'Build relationships through LinkedIn messaging' },
      { id: 'skill_3', name: 'Lead Qualification', category: 'analysis', proficiency: 92, description: 'Identify and qualify high-value prospects' },
      { id: 'skill_4', name: 'Objection Handling', category: 'communication', proficiency: 88, description: 'Overcome common sales objections' },
      { id: 'skill_5', name: 'Meeting Scheduling', category: 'management', proficiency: 98, description: 'Book meetings efficiently' }
    ],
    default_automations: [
      {
        name: 'Morning Lead Review',
        trigger: { type: 'schedule', config: { cron: '0 9 * * 1-5' } },
        actions: [
          { type: 'analyze_data', config: { source: 'crm', analysis: 'new_leads' } },
          { type: 'create_task', config: { type: 'email_outreach', priority: 'high' } }
        ],
        enabled: true
      },
      {
        name: 'Follow-up Sequence',
        trigger: { type: 'event', config: { event: 'email_no_reply', days: 3 } },
        actions: [
          { type: 'send_email', config: { template: 'follow_up_1' } }
        ],
        enabled: true
      }
    ],
    use_cases: ['Lead generation', 'Cold outreach', 'Meeting booking', 'Pipeline building'],
    category: 'Sales'
  },
  {
    id: 'alex_writer',
    name: 'Alex',
    role: 'content_writer',
    avatar: '/employees/alex.png',
    description: 'Creates compelling blog posts, articles, and long-form content that ranks and converts. Alex understands SEO and your brand voice.',
    personality: {
      tone: 'professional',
      communication_style: 'detailed',
      response_speed: 'thoughtful',
      creativity_level: 'creative',
      proactivity: 'proactive',
      traits: ['creative', 'research-oriented', 'detail-focused']
    },
    default_skills: [
      { id: 'skill_1', name: 'Blog Writing', category: 'creative', proficiency: 96, description: 'Write engaging blog posts' },
      { id: 'skill_2', name: 'SEO Content', category: 'technical', proficiency: 92, description: 'Optimize content for search engines' },
      { id: 'skill_3', name: 'Research', category: 'research', proficiency: 94, description: 'Deep research on any topic' },
      { id: 'skill_4', name: 'Brand Voice', category: 'creative', proficiency: 90, description: 'Match your unique brand tone' },
      { id: 'skill_5', name: 'Headlines', category: 'creative', proficiency: 95, description: 'Craft click-worthy headlines' }
    ],
    default_automations: [
      {
        name: 'Weekly Content Calendar',
        trigger: { type: 'schedule', config: { cron: '0 8 * * 1' } },
        actions: [
          { type: 'research', config: { topic: 'trending_topics' } },
          { type: 'generate_content', config: { type: 'content_calendar' } }
        ],
        enabled: true
      }
    ],
    use_cases: ['Blog posts', 'SEO content', 'Whitepapers', 'Case studies'],
    category: 'Marketing'
  },
  {
    id: 'maya_social',
    name: 'Maya',
    role: 'social_media_manager',
    avatar: '/employees/maya.png',
    description: 'Manages your social media presence across all platforms. Maya creates posts, engages with followers, and grows your audience.',
    personality: {
      tone: 'enthusiastic',
      communication_style: 'conversational',
      response_speed: 'instant',
      creativity_level: 'creative',
      proactivity: 'highly_proactive',
      traits: ['trendy', 'engaging', 'brand-conscious']
    },
    default_skills: [
      { id: 'skill_1', name: 'Social Content', category: 'creative', proficiency: 95, description: 'Create viral-worthy social posts' },
      { id: 'skill_2', name: 'Community Engagement', category: 'communication', proficiency: 93, description: 'Engage with followers authentically' },
      { id: 'skill_3', name: 'Trend Spotting', category: 'research', proficiency: 91, description: 'Identify and leverage trending topics' },
      { id: 'skill_4', name: 'Analytics', category: 'analysis', proficiency: 88, description: 'Track and optimize social performance' },
      { id: 'skill_5', name: 'Hashtag Strategy', category: 'technical', proficiency: 90, description: 'Maximize reach with smart hashtags' }
    ],
    default_automations: [
      {
        name: 'Daily Social Posts',
        trigger: { type: 'schedule', config: { cron: '0 10,14,18 * * *' } },
        actions: [
          { type: 'generate_content', config: { type: 'social_post' } },
          { type: 'post_social', config: { platforms: ['twitter', 'linkedin', 'instagram'] } }
        ],
        enabled: true
      },
      {
        name: 'Engagement Monitoring',
        trigger: { type: 'schedule', config: { cron: '0 */2 * * *' } },
        actions: [
          { type: 'analyze_data', config: { source: 'social_mentions' } },
          { type: 'send_message', config: { channel: 'slack', on_urgent: true } }
        ],
        enabled: true
      }
    ],
    use_cases: ['Social posting', 'Community management', 'Brand monitoring', 'Influencer outreach'],
    category: 'Marketing'
  },
  {
    id: 'sam_analyst',
    name: 'Sam',
    role: 'data_analyst',
    avatar: '/employees/sam.png',
    description: 'Transforms your data into actionable insights. Sam creates reports, identifies trends, and helps you make data-driven decisions.',
    personality: {
      tone: 'professional',
      communication_style: 'detailed',
      response_speed: 'thoughtful',
      creativity_level: 'conservative',
      proactivity: 'proactive',
      traits: ['analytical', 'precise', 'insight-driven']
    },
    default_skills: [
      { id: 'skill_1', name: 'Data Analysis', category: 'analysis', proficiency: 98, description: 'Deep dive into complex datasets' },
      { id: 'skill_2', name: 'Reporting', category: 'technical', proficiency: 95, description: 'Create comprehensive reports' },
      { id: 'skill_3', name: 'Visualization', category: 'technical', proficiency: 92, description: 'Build clear data visualizations' },
      { id: 'skill_4', name: 'Forecasting', category: 'analysis', proficiency: 88, description: 'Predict trends and outcomes' },
      { id: 'skill_5', name: 'SQL & Databases', category: 'technical', proficiency: 94, description: 'Query and manage databases' }
    ],
    default_automations: [
      {
        name: 'Weekly Performance Report',
        trigger: { type: 'schedule', config: { cron: '0 8 * * 1' } },
        actions: [
          { type: 'analyze_data', config: { sources: ['crm', 'analytics', 'revenue'] } },
          { type: 'generate_content', config: { type: 'report' } },
          { type: 'send_email', config: { to: 'team', subject: 'Weekly Performance Report' } }
        ],
        enabled: true
      }
    ],
    use_cases: ['Business intelligence', 'KPI tracking', 'Revenue analysis', 'Customer insights'],
    category: 'Operations'
  },
  {
    id: 'emma_assistant',
    name: 'Emma',
    role: 'executive_assistant',
    avatar: '/employees/emma.png',
    description: 'Your personal AI executive assistant. Emma manages your calendar, handles emails, prepares briefings, and keeps you organized.',
    personality: {
      tone: 'professional',
      communication_style: 'concise',
      response_speed: 'instant',
      creativity_level: 'balanced',
      proactivity: 'highly_proactive',
      traits: ['organized', 'efficient', 'anticipatory']
    },
    default_skills: [
      { id: 'skill_1', name: 'Calendar Management', category: 'management', proficiency: 98, description: 'Optimize your schedule' },
      { id: 'skill_2', name: 'Email Management', category: 'communication', proficiency: 95, description: 'Triage and respond to emails' },
      { id: 'skill_3', name: 'Meeting Prep', category: 'research', proficiency: 93, description: 'Prepare briefings for meetings' },
      { id: 'skill_4', name: 'Travel Planning', category: 'management', proficiency: 90, description: 'Book and organize travel' },
      { id: 'skill_5', name: 'Task Prioritization', category: 'management', proficiency: 96, description: 'Keep you focused on what matters' }
    ],
    default_automations: [
      {
        name: 'Morning Briefing',
        trigger: { type: 'schedule', config: { cron: '0 7 * * 1-5' } },
        actions: [
          { type: 'analyze_data', config: { sources: ['calendar', 'email', 'tasks'] } },
          { type: 'generate_content', config: { type: 'daily_briefing' } },
          { type: 'send_message', config: { channel: 'slack' } }
        ],
        enabled: true
      },
      {
        name: 'Meeting Prep',
        trigger: { type: 'calendar_event', config: { before_minutes: 30 } },
        actions: [
          { type: 'research', config: { topic: 'meeting_attendees' } },
          { type: 'generate_content', config: { type: 'meeting_brief' } }
        ],
        enabled: true
      }
    ],
    use_cases: ['Calendar management', 'Email handling', 'Meeting preparation', 'Task management'],
    category: 'Operations'
  },
  {
    id: 'ryan_recruiter',
    name: 'Ryan',
    role: 'recruiter',
    avatar: '/employees/ryan.png',
    description: 'Handles your entire recruiting pipeline. Ryan sources candidates, screens resumes, schedules interviews, and nurtures talent.',
    personality: {
      tone: 'friendly',
      communication_style: 'conversational',
      response_speed: 'human_paced',
      creativity_level: 'balanced',
      proactivity: 'proactive',
      traits: ['personable', 'thorough', 'candidate-focused']
    },
    default_skills: [
      { id: 'skill_1', name: 'Sourcing', category: 'research', proficiency: 94, description: 'Find top talent across platforms' },
      { id: 'skill_2', name: 'Resume Screening', category: 'analysis', proficiency: 96, description: 'Identify qualified candidates' },
      { id: 'skill_3', name: 'Outreach', category: 'communication', proficiency: 92, description: 'Engage passive candidates' },
      { id: 'skill_4', name: 'Interview Scheduling', category: 'management', proficiency: 98, description: 'Coordinate interviews efficiently' },
      { id: 'skill_5', name: 'Candidate Experience', category: 'communication', proficiency: 95, description: 'Ensure great candidate journey' }
    ],
    default_automations: [
      {
        name: 'Daily Candidate Sourcing',
        trigger: { type: 'schedule', config: { cron: '0 9 * * 1-5' } },
        actions: [
          { type: 'research', config: { source: 'linkedin', criteria: 'open_roles' } },
          { type: 'send_email', config: { template: 'candidate_outreach' } }
        ],
        enabled: true
      }
    ],
    use_cases: ['Candidate sourcing', 'Resume screening', 'Interview scheduling', 'Talent pipeline'],
    category: 'HR'
  },
  {
    id: 'lisa_success',
    name: 'Lisa',
    role: 'customer_success',
    avatar: '/employees/lisa.png',
    description: 'Keeps your customers happy and successful. Lisa handles onboarding, check-ins, support escalations, and churn prevention.',
    personality: {
      tone: 'friendly',
      communication_style: 'detailed',
      response_speed: 'instant',
      creativity_level: 'balanced',
      proactivity: 'highly_proactive',
      traits: ['empathetic', 'solution-oriented', 'patient']
    },
    default_skills: [
      { id: 'skill_1', name: 'Customer Onboarding', category: 'management', proficiency: 96, description: 'Guide new customers to success' },
      { id: 'skill_2', name: 'Account Management', category: 'communication', proficiency: 94, description: 'Maintain strong relationships' },
      { id: 'skill_3', name: 'Churn Prevention', category: 'analysis', proficiency: 92, description: 'Identify and save at-risk accounts' },
      { id: 'skill_4', name: 'Support Escalation', category: 'communication', proficiency: 95, description: 'Handle complex support issues' },
      { id: 'skill_5', name: 'NPS Management', category: 'analysis', proficiency: 90, description: 'Track and improve customer satisfaction' }
    ],
    default_automations: [
      {
        name: 'Health Score Monitoring',
        trigger: { type: 'schedule', config: { cron: '0 8 * * *' } },
        actions: [
          { type: 'analyze_data', config: { source: 'customer_health' } },
          { type: 'notify_human', config: { on_risk_detected: true } }
        ],
        enabled: true
      },
      {
        name: '30-Day Check-in',
        trigger: { type: 'event', config: { event: 'customer_signup', days: 30 } },
        actions: [
          { type: 'send_email', config: { template: 'check_in_30' } },
          { type: 'schedule_meeting', config: { type: 'check_in_call' } }
        ],
        enabled: true
      }
    ],
    use_cases: ['Customer onboarding', 'Account health', 'Churn prevention', 'Expansion revenue'],
    category: 'Customer Success'
  },
  {
    id: 'jordan_copy',
    name: 'Jordan',
    role: 'copywriter',
    avatar: '/employees/jordan.png',
    description: 'Writes copy that converts. Jordan creates email sequences, landing pages, ads, and sales copy that drives action.',
    personality: {
      tone: 'enthusiastic',
      communication_style: 'concise',
      response_speed: 'thoughtful',
      creativity_level: 'creative',
      proactivity: 'proactive',
      traits: ['persuasive', 'creative', 'conversion-focused']
    },
    default_skills: [
      { id: 'skill_1', name: 'Sales Copy', category: 'creative', proficiency: 97, description: 'Write copy that sells' },
      { id: 'skill_2', name: 'Email Sequences', category: 'creative', proficiency: 95, description: 'Craft converting email campaigns' },
      { id: 'skill_3', name: 'Landing Pages', category: 'creative', proficiency: 94, description: 'Write high-converting landing pages' },
      { id: 'skill_4', name: 'Ad Copy', category: 'creative', proficiency: 93, description: 'Create compelling ad copy' },
      { id: 'skill_5', name: 'A/B Testing', category: 'analysis', proficiency: 88, description: 'Optimize copy through testing' }
    ],
    default_automations: [],
    use_cases: ['Sales pages', 'Email campaigns', 'Ad copy', 'Product descriptions'],
    category: 'Marketing'
  }
];

class AIEmployeesService {
  private employees: Map<string, AIEmployee> = new Map();
  private tasks: Map<string, Task> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private templates: EmployeeTemplate[] = EMPLOYEE_TEMPLATES;

  // Hire a new AI Employee
  async hireEmployee(template_id: string, customizations?: {
    name?: string;
    personality_overrides?: Partial<PersonalityProfile>;
    additional_skills?: Skill[];
    work_schedule?: WorkSchedule;
  }): Promise<AIEmployee> {
    const template = this.templates.find(t => t.id === template_id);
    if (!template) throw new Error('Employee template not found');

    const employee: AIEmployee = {
      id: `emp_${Date.now()}`,
      name: customizations?.name || template.name,
      role: template.role,
      avatar: template.avatar,
      personality: {
        ...template.personality,
        ...customizations?.personality_overrides
      },
      skills: [
        ...template.default_skills,
        ...(customizations?.additional_skills || [])
      ],
      integrations: [],
      automations: template.default_automations.map((a, i) => ({
        ...a,
        id: `auto_${Date.now()}_${i}`,
        runs_count: 0
      })),
      performance: {
        tasks_completed: 0,
        tasks_in_progress: 0,
        avg_task_time: 0,
        quality_score: 100,
        emails_sent: 0,
        meetings_scheduled: 0,
        content_created: 0,
        leads_generated: 0,
        revenue_influenced: 0,
        customer_satisfaction: 100,
        hours_saved: 0
      },
      status: 'active',
      work_schedule: customizations?.work_schedule || {
        timezone: 'America/New_York',
        working_hours: [
          { day: 'Monday', start: '09:00', end: '17:00' },
          { day: 'Tuesday', start: '09:00', end: '17:00' },
          { day: 'Wednesday', start: '09:00', end: '17:00' },
          { day: 'Thursday', start: '09:00', end: '17:00' },
          { day: 'Friday', start: '09:00', end: '17:00' }
        ],
        holidays: [],
        max_tasks_per_day: 50
      },
      created_at: new Date()
    };

    this.employees.set(employee.id, employee);
    return employee;
  }

  // Assign task to employee
  async assignTask(employee_id: string, task: Omit<Task, 'id' | 'employee_id' | 'status' | 'human_review_requested'>): Promise<Task> {
    const employee = this.employees.get(employee_id);
    if (!employee) throw new Error('Employee not found');

    const newTask: Task = {
      id: `task_${Date.now()}`,
      employee_id,
      status: 'pending',
      human_review_requested: false,
      ...task
    };

    this.tasks.set(newTask.id, newTask);
    employee.performance.tasks_in_progress++;

    // Auto-execute task
    this.executeTask(newTask.id);

    return newTask;
  }

  // Execute task autonomously
  private async executeTask(task_id: string): Promise<void> {
    const task = this.tasks.get(task_id);
    if (!task) return;

    const employee = this.employees.get(task.employee_id);
    if (!employee) return;

    task.status = 'in_progress';
    task.started_at = new Date();

    // Simulate task execution based on type
    const executionTime = this.estimateExecutionTime(task.type, employee);

    setTimeout(async () => {
      try {
        task.output = await this.generateTaskOutput(task, employee);
        task.status = 'completed';
        task.completed_at = new Date();

        // Update performance
        employee.performance.tasks_completed++;
        employee.performance.tasks_in_progress--;
        employee.performance.hours_saved += executionTime / 60;

        // Update specific metrics
        switch (task.type) {
          case 'email_outreach':
          case 'follow_up':
            employee.performance.emails_sent++;
            break;
          case 'content_creation':
          case 'social_post':
            employee.performance.content_created++;
            break;
          case 'lead_qualification':
            employee.performance.leads_generated++;
            break;
          case 'scheduling':
            employee.performance.meetings_scheduled++;
            break;
        }
      } catch (error) {
        task.status = 'failed';
        task.output = { error: (error as Error).message };
      }
    }, executionTime * 1000);
  }

  private estimateExecutionTime(type: TaskType, employee: AIEmployee): number {
    const baseTime: Record<TaskType, number> = {
      email_outreach: 30,
      follow_up: 15,
      content_creation: 300,
      social_post: 60,
      data_analysis: 180,
      research: 240,
      meeting_prep: 120,
      report_generation: 180,
      lead_qualification: 20,
      customer_response: 30,
      ad_optimization: 120,
      seo_audit: 240,
      competitor_analysis: 300,
      scheduling: 10,
      summarization: 60
    };

    return baseTime[type] || 60;
  }

  private async generateTaskOutput(task: Task, employee: AIEmployee): Promise<any> {
    // AI would generate actual output - this is simulated
    const outputs: Record<TaskType, () => any> = {
      email_outreach: () => ({
        subject: `Quick question about ${task.input.topic || 'your growth'}`,
        body: `Hi ${task.input.recipient_name || 'there'},\n\nI noticed ${task.input.personalization || 'your company'} and wanted to reach out...\n\nBest,\n${employee.name}`,
        personalization_score: 85
      }),
      follow_up: () => ({
        subject: `Following up - ${task.input.original_subject || 'our conversation'}`,
        body: `Hi ${task.input.recipient_name || 'there'},\n\nJust wanted to follow up on my previous message...\n\nBest,\n${employee.name}`
      }),
      content_creation: () => ({
        title: task.input.title || 'Generated Content',
        content: `# ${task.input.title || 'Article'}\n\n${task.input.brief || 'Generated content based on brief...'}`,
        word_count: 1500,
        seo_score: 88
      }),
      social_post: () => ({
        platform: task.input.platform || 'twitter',
        content: `${task.input.topic || 'Check this out!'} 🚀\n\n#${task.input.hashtags?.join(' #') || 'growth'}`,
        suggested_time: '10:00 AM EST',
        estimated_reach: 5000
      }),
      data_analysis: () => ({
        summary: 'Analysis complete',
        key_findings: ['Finding 1', 'Finding 2', 'Finding 3'],
        recommendations: ['Recommendation 1', 'Recommendation 2'],
        charts: ['chart_1.png', 'chart_2.png']
      }),
      research: () => ({
        topic: task.input.topic,
        summary: 'Research summary...',
        sources: ['source1.com', 'source2.com'],
        key_points: ['Point 1', 'Point 2', 'Point 3']
      }),
      meeting_prep: () => ({
        briefing: 'Meeting briefing document...',
        attendee_info: [],
        talking_points: ['Point 1', 'Point 2'],
        questions_to_ask: ['Question 1', 'Question 2']
      }),
      report_generation: () => ({
        title: task.input.report_type || 'Report',
        sections: ['Executive Summary', 'Analysis', 'Recommendations'],
        charts: [],
        download_url: '/reports/generated_report.pdf'
      }),
      lead_qualification: () => ({
        lead_score: Math.floor(Math.random() * 40) + 60,
        qualified: true,
        notes: 'Lead shows strong buying signals',
        recommended_action: 'Schedule demo call'
      }),
      customer_response: () => ({
        response: 'Thank you for reaching out! Here\'s how I can help...',
        sentiment: 'positive',
        escalation_needed: false
      }),
      ad_optimization: () => ({
        recommendations: ['Increase budget on Ad Set A', 'Pause underperforming Ad Set C'],
        projected_improvement: '15%',
        new_targeting: []
      }),
      seo_audit: () => ({
        score: 75,
        issues: ['Missing meta descriptions', 'Slow page load'],
        opportunities: ['Target keyword X', 'Add internal links'],
        priority_actions: []
      }),
      competitor_analysis: () => ({
        competitors: task.input.competitors || [],
        comparison: {},
        opportunities: ['Opportunity 1', 'Opportunity 2'],
        threats: ['Threat 1']
      }),
      scheduling: () => ({
        scheduled: true,
        datetime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        calendar_link: 'https://cal.orengen.io/meeting/123',
        confirmation_sent: true
      }),
      summarization: () => ({
        summary: 'Key points from the content...',
        bullet_points: ['Point 1', 'Point 2', 'Point 3'],
        action_items: ['Action 1', 'Action 2']
      })
    };

    return outputs[task.type]?.() || { result: 'Task completed' };
  }

  // Chat with employee
  async chatWithEmployee(employee_id: string, message: string, conversation_id?: string): Promise<{
    response: string;
    conversation_id: string;
    suggested_actions?: string[];
  }> {
    const employee = this.employees.get(employee_id);
    if (!employee) throw new Error('Employee not found');

    let conversation: Conversation;
    if (conversation_id && this.conversations.has(conversation_id)) {
      conversation = this.conversations.get(conversation_id)!;
    } else {
      conversation = {
        id: `conv_${Date.now()}`,
        employee_id,
        messages: [],
        context: {},
        created_at: new Date(),
        updated_at: new Date()
      };
      this.conversations.set(conversation.id, conversation);
    }

    // Add user message
    conversation.messages.push({
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Generate employee response based on personality
    const response = this.generateEmployeeResponse(employee, message, conversation);

    conversation.messages.push({
      id: `msg_${Date.now() + 1}`,
      role: 'employee',
      content: response.text,
      timestamp: new Date()
    });

    conversation.updated_at = new Date();

    return {
      response: response.text,
      conversation_id: conversation.id,
      suggested_actions: response.suggestions
    };
  }

  private generateEmployeeResponse(employee: AIEmployee, message: string, conversation: Conversation): {
    text: string;
    suggestions: string[];
  } {
    // AI would generate contextual response - this is simulated
    const greetings = {
      professional: `Thank you for your message. `,
      friendly: `Hey! Great to hear from you. `,
      casual: `Hey there! `,
      formal: `Good day. `,
      enthusiastic: `Awesome! `
    };

    const greeting = greetings[employee.personality.tone];

    const roleResponses: Record<EmployeeRole, string> = {
      sdr: `${greeting}I'd be happy to help with your outreach. What would you like me to work on?`,
      content_writer: `${greeting}I'm ready to create some great content. What topic should I focus on?`,
      social_media_manager: `${greeting}Let's make your social media shine! What platforms are we focusing on?`,
      data_analyst: `${greeting}I can help you make sense of your data. What insights are you looking for?`,
      executive_assistant: `${greeting}I'm here to help you stay organized. What's on your agenda?`,
      recruiter: `${greeting}Let's find some great talent. What role are we hiring for?`,
      customer_success: `${greeting}I'm here to help keep your customers happy. How can I assist?`,
      copywriter: `${greeting}Let's write some copy that converts. What's the project?`,
      researcher: `${greeting}I'm ready to dive deep into research. What topic should I explore?`,
      ad_manager: `${greeting}Let's optimize those ads. Which campaigns should I focus on?`,
      seo_specialist: `${greeting}Let's improve your search rankings. What pages need attention?`,
      email_marketer: `${greeting}Let's create some engaging emails. What campaign are we working on?`,
      community_manager: `${greeting}I'm monitoring the community. What would you like me to focus on?`,
      project_manager: `${greeting}I'm tracking all projects. What needs my attention?`,
      bookkeeper: `${greeting}I'm keeping the books in order. What financial tasks need handling?`
    };

    return {
      text: roleResponses[employee.role] || `${greeting}How can I help you today?`,
      suggestions: [
        'Create a new task',
        `Check ${employee.name}'s performance`,
        'View recent work',
        'Adjust settings'
      ]
    };
  }

  // Get employee performance dashboard
  async getEmployeeDashboard(employee_id: string): Promise<{
    employee: AIEmployee;
    recent_tasks: Task[];
    automations_summary: { name: string; runs: number; last_run?: Date }[];
    performance_trend: { date: string; tasks: number; quality: number }[];
  }> {
    const employee = this.employees.get(employee_id);
    if (!employee) throw new Error('Employee not found');

    const recentTasks = Array.from(this.tasks.values())
      .filter(t => t.employee_id === employee_id)
      .sort((a, b) => (b.completed_at?.getTime() || 0) - (a.completed_at?.getTime() || 0))
      .slice(0, 10);

    return {
      employee,
      recent_tasks: recentTasks,
      automations_summary: employee.automations.map(a => ({
        name: a.name,
        runs: a.runs_count,
        last_run: a.last_run
      })),
      performance_trend: this.generatePerformanceTrend(employee_id)
    };
  }

  private generatePerformanceTrend(employee_id: string): { date: string; tasks: number; quality: number }[] {
    // Generate last 7 days of mock data
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        tasks: Math.floor(Math.random() * 20) + 10,
        quality: Math.floor(Math.random() * 15) + 85
      };
    });
  }

  // Getters
  async getTemplates(category?: string): Promise<EmployeeTemplate[]> {
    if (category) {
      return this.templates.filter(t => t.category === category);
    }
    return this.templates;
  }

  async getEmployees(): Promise<AIEmployee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: string): Promise<AIEmployee | undefined> {
    return this.employees.get(id);
  }

  async getTasks(employee_id?: string, status?: Task['status']): Promise<Task[]> {
    let tasks = Array.from(this.tasks.values());
    if (employee_id) tasks = tasks.filter(t => t.employee_id === employee_id);
    if (status) tasks = tasks.filter(t => t.status === status);
    return tasks.sort((a, b) => b.started_at?.getTime() || 0 - (a.started_at?.getTime() || 0));
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  // Update employee
  async updateEmployee(id: string, updates: Partial<AIEmployee>): Promise<AIEmployee> {
    const employee = this.employees.get(id);
    if (!employee) throw new Error('Employee not found');

    Object.assign(employee, updates);
    return employee;
  }

  // Fire (delete) employee
  async fireEmployee(id: string): Promise<void> {
    this.employees.delete(id);
  }
}

export const aiEmployeesService = new AIEmployeesService();
