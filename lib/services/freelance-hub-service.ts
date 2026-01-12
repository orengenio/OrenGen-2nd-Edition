/**
 * Freelance Hub Service
 * Unified management for all freelance platforms - discover jobs, auto-generate proposals, manage leads
 */

// Types
export type FreelancePlatform = 'upwork' | 'fiverr' | 'freelancer' | 'toptal' | 'guru' | 'peopleperhour' | '99designs' | 'contra' | 'flexjobs';

export type JobCategory =
  | 'web_development'
  | 'mobile_development'
  | 'design'
  | 'writing'
  | 'marketing'
  | 'video'
  | 'music'
  | 'business'
  | 'admin'
  | 'customer_service'
  | 'data_entry'
  | 'ai_ml'
  | 'other';

export type ProposalTone = 'professional' | 'friendly' | 'confident' | 'consultative' | 'value_focused';

export interface FreelanceAccount {
  id: string;
  platform: FreelancePlatform;
  username: string;
  displayName: string;
  profileUrl: string;
  connected: boolean;
  lastSynced?: string;

  // Profile metrics
  metrics: {
    rating: number;
    reviewCount: number;
    completedJobs: number;
    successRate: number;
    responseTime: string;
    earnings: number;
    level?: string; // Platform-specific levels (Top Rated, Pro, etc.)
  };

  // Credentials (encrypted)
  credentials?: {
    apiKey?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
  };

  // Settings
  settings: {
    autoApply: boolean;
    maxBidsPerDay: number;
    minBudget: number;
    maxBudget: number;
    preferredCategories: JobCategory[];
    excludeKeywords: string[];
    includeKeywords: string[];
    notifyNewJobs: boolean;
  };
}

export interface FreelanceJob {
  id: string;
  platform: FreelancePlatform;
  externalId: string;

  // Job details
  title: string;
  description: string;
  category: JobCategory;
  skills: string[];

  // Budget
  budgetType: 'fixed' | 'hourly';
  budgetMin?: number;
  budgetMax?: number;
  budgetFixed?: number;

  // Timeline
  duration?: string;
  deadline?: string;
  postedAt: string;

  // Client info
  client: {
    name?: string;
    location?: string;
    rating?: number;
    reviewCount?: number;
    totalSpent?: number;
    hireRate?: number;
    jobsPosted?: number;
    memberSince?: string;
    verified?: boolean;
  };

  // Competition
  proposals: number;
  interviewing?: number;
  invitesOnly?: boolean;

  // Scoring
  matchScore: number;
  qualityScore: number;
  competitionScore: number;
  clientScore: number;
  overallScore: number;

  // Status
  status: 'new' | 'viewed' | 'applied' | 'interviewing' | 'hired' | 'rejected' | 'closed' | 'saved';
  appliedAt?: string;

  // URLs
  url: string;
}

export interface Proposal {
  id: string;
  jobId: string;
  accountId: string;

  // Content
  coverLetter: string;
  bidAmount: number;
  bidType: 'fixed' | 'hourly';
  estimatedDuration?: string;
  milestones?: {
    description: string;
    amount: number;
    deadline?: string;
  }[];

  // Attachments
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];

  // Portfolio items to include
  portfolioItems?: string[];

  // Questions/answers if required
  questions?: {
    question: string;
    answer: string;
  }[];

  // Meta
  tone: ProposalTone;
  aiGenerated: boolean;
  status: 'draft' | 'scheduled' | 'submitted' | 'viewed' | 'shortlisted' | 'rejected' | 'accepted';
  submittedAt?: string;
  viewedAt?: string;

  // Performance
  performance?: {
    opened: boolean;
    replied: boolean;
    interviewed: boolean;
    hired: boolean;
  };
}

export interface ServicePackage {
  id: string;
  accountId: string;
  platform: FreelancePlatform;

  // Package details
  name: string;
  description: string;
  category: JobCategory;

  // Tiers (for Fiverr-style packages)
  tiers: {
    basic: {
      name: string;
      description: string;
      price: number;
      deliveryDays: number;
      revisions: number;
      features: string[];
    };
    standard: {
      name: string;
      description: string;
      price: number;
      deliveryDays: number;
      revisions: number;
      features: string[];
    };
    premium: {
      name: string;
      description: string;
      price: number;
      deliveryDays: number;
      revisions: number;
      features: string[];
    };
  };

  // Add-ons
  addOns?: {
    name: string;
    description: string;
    price: number;
    deliveryDays: number;
  }[];

  // FAQs
  faqs?: {
    question: string;
    answer: string;
  }[];

  // Requirements
  requirements?: string[];

  // Tags/keywords
  tags: string[];

  // Status
  status: 'draft' | 'active' | 'paused' | 'deleted';

  // Performance
  stats: {
    impressions: number;
    clicks: number;
    orders: number;
    revenue: number;
    avgRating: number;
  };
}

export interface FreelanceAnalytics {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';

  // Overview
  totalEarnings: number;
  totalJobs: number;
  avgJobValue: number;
  successRate: number;

  // Activity
  jobsApplied: number;
  proposalsSent: number;
  interviews: number;
  hires: number;

  // Conversion rates
  applicationToInterview: number;
  interviewToHire: number;
  overallConversion: number;

  // By platform
  byPlatform: Record<FreelancePlatform, {
    earnings: number;
    jobs: number;
    proposals: number;
    hires: number;
    avgRating: number;
  }>;

  // By category
  byCategory: Record<JobCategory, {
    earnings: number;
    jobs: number;
    avgRate: number;
  }>;

  // Trends
  earningsTrend: { date: string; amount: number }[];
  jobsTrend: { date: string; count: number }[];
}

// Platform configurations
export const PLATFORM_CONFIG: Record<FreelancePlatform, {
  name: string;
  color: string;
  icon: string;
  features: string[];
  feeStructure: string;
  apiAvailable: boolean;
}> = {
  upwork: {
    name: 'Upwork',
    color: '#14A800',
    icon: 'UP',
    features: ['Connects system', 'Hourly & Fixed', 'Milestones', 'Time tracking'],
    feeStructure: '10-20% fee',
    apiAvailable: true
  },
  fiverr: {
    name: 'Fiverr',
    color: '#1DBF73',
    icon: 'FV',
    features: ['Gigs/Packages', 'Buyer requests', 'Seller Plus', 'Promoted gigs'],
    feeStructure: '20% fee',
    apiAvailable: true
  },
  freelancer: {
    name: 'Freelancer',
    color: '#29B2FE',
    icon: 'FR',
    features: ['Contests', 'Projects', 'Hourly', 'Local jobs'],
    feeStructure: '10% or $5 min',
    apiAvailable: true
  },
  toptal: {
    name: 'Toptal',
    color: '#204ECF',
    icon: 'TT',
    features: ['Top 3% talent', 'Vetted clients', 'High rates', 'Full-time/Part-time'],
    feeStructure: '0% fee (client pays)',
    apiAvailable: false
  },
  guru: {
    name: 'Guru',
    color: '#5BBB7B',
    icon: 'GU',
    features: ['SafePay', 'Workrooms', 'Quotes', 'Job agreements'],
    feeStructure: '5-9% fee',
    apiAvailable: true
  },
  peopleperhour: {
    name: 'PeoplePerHour',
    color: '#00B3E3',
    icon: 'PPH',
    features: ['Hourlies', 'Projects', 'UK focused', 'AI matching'],
    feeStructure: '10-20% fee',
    apiAvailable: true
  },
  '99designs': {
    name: '99designs',
    color: '#F26322',
    icon: '99',
    features: ['Design contests', '1-to-1 projects', 'Design categories', 'Guaranteed prize'],
    feeStructure: 'Platform pricing',
    apiAvailable: false
  },
  contra: {
    name: 'Contra',
    color: '#000000',
    icon: 'CO',
    features: ['No fees', 'Portfolio focused', 'Direct contracts', 'Commission-free'],
    feeStructure: '0% fee',
    apiAvailable: false
  },
  flexjobs: {
    name: 'FlexJobs',
    color: '#2D6187',
    icon: 'FJ',
    features: ['Remote jobs', 'Vetted listings', 'No bidding', 'Direct apply'],
    feeStructure: 'Subscription',
    apiAvailable: false
  }
};

// Job category configurations
export const CATEGORY_CONFIG: Record<JobCategory, { label: string; skills: string[] }> = {
  web_development: {
    label: 'Web Development',
    skills: ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'PHP', 'WordPress', 'Shopify', 'Next.js', 'TypeScript']
  },
  mobile_development: {
    label: 'Mobile Development',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Ionic', 'Xamarin']
  },
  design: {
    label: 'Design',
    skills: ['UI/UX', 'Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'Logo Design', 'Brand Identity', 'Web Design']
  },
  writing: {
    label: 'Writing & Content',
    skills: ['Copywriting', 'Blog Writing', 'SEO Content', 'Technical Writing', 'Ghostwriting', 'Editing', 'Proofreading']
  },
  marketing: {
    label: 'Marketing',
    skills: ['SEO', 'PPC', 'Social Media', 'Email Marketing', 'Content Marketing', 'Google Ads', 'Facebook Ads', 'Analytics']
  },
  video: {
    label: 'Video & Animation',
    skills: ['Video Editing', 'Motion Graphics', 'After Effects', 'Premiere Pro', '3D Animation', 'Explainer Videos', 'YouTube']
  },
  music: {
    label: 'Music & Audio',
    skills: ['Voice Over', 'Audio Editing', 'Music Production', 'Podcast Editing', 'Sound Design', 'Jingles']
  },
  business: {
    label: 'Business & Consulting',
    skills: ['Business Plan', 'Financial Analysis', 'Market Research', 'Strategy', 'Project Management', 'HR']
  },
  admin: {
    label: 'Admin & Support',
    skills: ['Virtual Assistant', 'Data Entry', 'Research', 'Scheduling', 'Email Management', 'Bookkeeping']
  },
  customer_service: {
    label: 'Customer Service',
    skills: ['Phone Support', 'Chat Support', 'Email Support', 'CRM', 'Zendesk', 'Intercom']
  },
  data_entry: {
    label: 'Data Entry',
    skills: ['Data Entry', 'Excel', 'Google Sheets', 'Data Mining', 'Web Scraping', 'Typing']
  },
  ai_ml: {
    label: 'AI & Machine Learning',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Data Science', 'ChatGPT', 'LLMs']
  },
  other: {
    label: 'Other',
    skills: []
  }
};

// Proposal templates by tone
const PROPOSAL_TEMPLATES: Record<ProposalTone, { opening: string; closing: string; style: string }> = {
  professional: {
    opening: "Thank you for posting this opportunity. I've reviewed your requirements carefully and believe I'm well-suited to deliver exceptional results.",
    closing: "I look forward to discussing how I can contribute to your project's success. Please feel free to reach out if you have any questions.",
    style: 'formal, structured, results-oriented'
  },
  friendly: {
    opening: "Hey there! I came across your project and got genuinely excited - this is right up my alley!",
    closing: "Would love to chat more about your vision. Drop me a message anytime - I'm always happy to answer questions!",
    style: 'warm, approachable, enthusiastic'
  },
  confident: {
    opening: "I've successfully completed over [X] similar projects with a 100% satisfaction rate. Here's exactly how I'll handle yours.",
    closing: "I'm confident I can exceed your expectations. Let's get started.",
    style: 'assertive, achievement-focused, direct'
  },
  consultative: {
    opening: "Before diving into the solution, I'd like to understand a few things about your goals to ensure we're aligned.",
    closing: "I'd suggest we start with a brief call to map out the optimal approach. What times work for you?",
    style: 'questioning, strategic, partnership-focused'
  },
  value_focused: {
    opening: "I noticed you're looking for [X]. Here's the specific value I can bring and the ROI you can expect.",
    closing: "The investment you make here will pay for itself within [timeframe] through [specific benefit]. Ready to discuss?",
    style: 'ROI-driven, specific metrics, business impact'
  }
};

// Main Service Class
export class FreelanceHubService {
  private accounts: Map<string, FreelanceAccount> = new Map();
  private jobs: Map<string, FreelanceJob> = new Map();
  private proposals: Map<string, Proposal> = new Map();
  private packages: Map<string, ServicePackage> = new Map();

  constructor() {
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData(): void {
    // Demo accounts
    const demoAccounts: FreelanceAccount[] = [
      {
        id: 'acc-1',
        platform: 'upwork',
        username: 'johndoe_dev',
        displayName: 'John Doe',
        profileUrl: 'https://upwork.com/freelancers/johndoe',
        connected: true,
        lastSynced: new Date().toISOString(),
        metrics: {
          rating: 4.9,
          reviewCount: 47,
          completedJobs: 52,
          successRate: 98,
          responseTime: '< 1 hour',
          earnings: 125000,
          level: 'Top Rated Plus'
        },
        settings: {
          autoApply: false,
          maxBidsPerDay: 10,
          minBudget: 500,
          maxBudget: 50000,
          preferredCategories: ['web_development', 'mobile_development', 'ai_ml'],
          excludeKeywords: ['unpaid', 'intern', 'free'],
          includeKeywords: ['react', 'node', 'fullstack', 'senior'],
          notifyNewJobs: true
        }
      },
      {
        id: 'acc-2',
        platform: 'fiverr',
        username: 'prodev_studio',
        displayName: 'ProDev Studio',
        profileUrl: 'https://fiverr.com/prodev_studio',
        connected: true,
        lastSynced: new Date().toISOString(),
        metrics: {
          rating: 4.8,
          reviewCount: 234,
          completedJobs: 312,
          successRate: 99,
          responseTime: '30 mins',
          earnings: 89000,
          level: 'Top Rated Seller'
        },
        settings: {
          autoApply: true,
          maxBidsPerDay: 20,
          minBudget: 50,
          maxBudget: 10000,
          preferredCategories: ['web_development', 'design'],
          excludeKeywords: [],
          includeKeywords: [],
          notifyNewJobs: true
        }
      },
      {
        id: 'acc-3',
        platform: 'freelancer',
        username: 'fullstack_pro',
        displayName: 'FullStack Pro',
        profileUrl: 'https://freelancer.com/u/fullstack_pro',
        connected: false,
        metrics: {
          rating: 4.7,
          reviewCount: 89,
          completedJobs: 102,
          successRate: 94,
          responseTime: '2 hours',
          earnings: 67000,
          level: 'Preferred Freelancer'
        },
        settings: {
          autoApply: false,
          maxBidsPerDay: 15,
          minBudget: 200,
          maxBudget: 25000,
          preferredCategories: ['web_development'],
          excludeKeywords: [],
          includeKeywords: [],
          notifyNewJobs: false
        }
      }
    ];

    demoAccounts.forEach(acc => this.accounts.set(acc.id, acc));

    // Demo jobs
    const demoJobs: FreelanceJob[] = [
      {
        id: 'job-1',
        platform: 'upwork',
        externalId: 'up-12345',
        title: 'Senior React Developer for SaaS Dashboard',
        description: 'We need an experienced React developer to build a modern analytics dashboard. Must have experience with TypeScript, Redux, and data visualization libraries like Chart.js or D3.',
        category: 'web_development',
        skills: ['React', 'TypeScript', 'Redux', 'Chart.js', 'REST API'],
        budgetType: 'fixed',
        budgetFixed: 5000,
        duration: '1-3 months',
        postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        client: {
          name: 'Tech Startup Inc',
          location: 'United States',
          rating: 4.8,
          reviewCount: 23,
          totalSpent: 150000,
          hireRate: 85,
          jobsPosted: 34,
          verified: true
        },
        proposals: 12,
        interviewing: 2,
        matchScore: 95,
        qualityScore: 88,
        competitionScore: 75,
        clientScore: 92,
        overallScore: 88,
        status: 'new',
        url: 'https://upwork.com/jobs/12345'
      },
      {
        id: 'job-2',
        platform: 'upwork',
        externalId: 'up-12346',
        title: 'Full-Stack Developer for E-commerce Platform',
        description: 'Looking for a full-stack developer to enhance our Shopify-based e-commerce platform. Need someone who can work with React frontend and Node.js backend.',
        category: 'web_development',
        skills: ['React', 'Node.js', 'Shopify', 'MongoDB', 'GraphQL'],
        budgetType: 'hourly',
        budgetMin: 50,
        budgetMax: 80,
        duration: '3-6 months',
        postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        client: {
          name: 'E-Shop Global',
          location: 'Canada',
          rating: 4.9,
          reviewCount: 56,
          totalSpent: 320000,
          hireRate: 92,
          jobsPosted: 78,
          verified: true
        },
        proposals: 25,
        interviewing: 4,
        matchScore: 92,
        qualityScore: 90,
        competitionScore: 65,
        clientScore: 95,
        overallScore: 86,
        status: 'new',
        url: 'https://upwork.com/jobs/12346'
      },
      {
        id: 'job-3',
        platform: 'fiverr',
        externalId: 'fv-78901',
        title: 'Build a Custom CRM System',
        description: 'Need a developer to create a custom CRM for my real estate business. Should include lead management, pipeline tracking, and email automation.',
        category: 'web_development',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Email API'],
        budgetType: 'fixed',
        budgetFixed: 3500,
        postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        client: {
          name: 'Real Estate Pro',
          location: 'United States',
          rating: 4.6,
          reviewCount: 8,
          totalSpent: 12000,
          hireRate: 78,
          verified: true
        },
        proposals: 8,
        matchScore: 98,
        qualityScore: 85,
        competitionScore: 82,
        clientScore: 80,
        overallScore: 86,
        status: 'new',
        url: 'https://fiverr.com/requests/78901'
      },
      {
        id: 'job-4',
        platform: 'freelancer',
        externalId: 'fr-45678',
        title: 'AI-Powered Chatbot Development',
        description: 'Looking for an AI expert to build a customer service chatbot using GPT-4 or similar. Must integrate with our existing website and CRM.',
        category: 'ai_ml',
        skills: ['Python', 'OpenAI API', 'NLP', 'REST API', 'JavaScript'],
        budgetType: 'fixed',
        budgetFixed: 8000,
        duration: '1-2 months',
        postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        client: {
          name: 'ServiceTech Solutions',
          location: 'United Kingdom',
          rating: 4.5,
          reviewCount: 15,
          totalSpent: 45000,
          hireRate: 70,
          jobsPosted: 22,
          verified: true
        },
        proposals: 35,
        matchScore: 90,
        qualityScore: 92,
        competitionScore: 55,
        clientScore: 82,
        overallScore: 80,
        status: 'saved',
        url: 'https://freelancer.com/projects/45678'
      }
    ];

    demoJobs.forEach(job => this.jobs.set(job.id, job));
  }

  // Account Management
  getAccounts(): FreelanceAccount[] {
    return Array.from(this.accounts.values());
  }

  getAccount(id: string): FreelanceAccount | undefined {
    return this.accounts.get(id);
  }

  async connectAccount(platform: FreelancePlatform, credentials: any): Promise<FreelanceAccount> {
    const id = `acc-${Date.now()}`;
    const account: FreelanceAccount = {
      id,
      platform,
      username: credentials.username,
      displayName: credentials.displayName || credentials.username,
      profileUrl: `https://${platform}.com/${credentials.username}`,
      connected: true,
      lastSynced: new Date().toISOString(),
      metrics: {
        rating: 0,
        reviewCount: 0,
        completedJobs: 0,
        successRate: 0,
        responseTime: 'N/A',
        earnings: 0
      },
      settings: {
        autoApply: false,
        maxBidsPerDay: 10,
        minBudget: 100,
        maxBudget: 10000,
        preferredCategories: [],
        excludeKeywords: [],
        includeKeywords: [],
        notifyNewJobs: true
      }
    };

    this.accounts.set(id, account);
    return account;
  }

  async disconnectAccount(accountId: string): Promise<void> {
    const account = this.accounts.get(accountId);
    if (account) {
      account.connected = false;
      account.credentials = undefined;
    }
  }

  updateAccountSettings(accountId: string, settings: Partial<FreelanceAccount['settings']>): FreelanceAccount | undefined {
    const account = this.accounts.get(accountId);
    if (account) {
      account.settings = { ...account.settings, ...settings };
      return account;
    }
    return undefined;
  }

  // Job Discovery
  getJobs(filters?: {
    platform?: FreelancePlatform;
    category?: JobCategory;
    minBudget?: number;
    maxBudget?: number;
    minScore?: number;
    status?: FreelanceJob['status'];
    skills?: string[];
    search?: string;
  }): FreelanceJob[] {
    let jobs = Array.from(this.jobs.values());

    if (filters) {
      if (filters.platform) {
        jobs = jobs.filter(j => j.platform === filters.platform);
      }
      if (filters.category) {
        jobs = jobs.filter(j => j.category === filters.category);
      }
      if (filters.minBudget !== undefined) {
        jobs = jobs.filter(j => {
          const budget = j.budgetFixed || j.budgetMin || 0;
          return budget >= filters.minBudget!;
        });
      }
      if (filters.maxBudget !== undefined) {
        jobs = jobs.filter(j => {
          const budget = j.budgetFixed || j.budgetMax || Infinity;
          return budget <= filters.maxBudget!;
        });
      }
      if (filters.minScore !== undefined) {
        jobs = jobs.filter(j => j.overallScore >= filters.minScore!);
      }
      if (filters.status) {
        jobs = jobs.filter(j => j.status === filters.status);
      }
      if (filters.skills && filters.skills.length > 0) {
        jobs = jobs.filter(j =>
          filters.skills!.some(skill =>
            j.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
          )
        );
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        jobs = jobs.filter(j =>
          j.title.toLowerCase().includes(search) ||
          j.description.toLowerCase().includes(search)
        );
      }
    }

    return jobs.sort((a, b) => b.overallScore - a.overallScore);
  }

  getJob(id: string): FreelanceJob | undefined {
    return this.jobs.get(id);
  }

  updateJobStatus(jobId: string, status: FreelanceJob['status']): FreelanceJob | undefined {
    const job = this.jobs.get(jobId);
    if (job) {
      job.status = status;
      return job;
    }
    return undefined;
  }

  // Proposal Generation
  async generateProposal(
    jobId: string,
    accountId: string,
    options: {
      tone: ProposalTone;
      bidAmount?: number;
      customInstructions?: string;
      includePortfolio?: string[];
    }
  ): Promise<Proposal> {
    const job = this.jobs.get(jobId);
    const account = this.accounts.get(accountId);

    if (!job || !account) {
      throw new Error('Job or account not found');
    }

    const template = PROPOSAL_TEMPLATES[options.tone];

    // Generate cover letter based on job and tone
    const coverLetter = this.generateCoverLetter(job, account, template, options.customInstructions);

    // Calculate suggested bid
    const suggestedBid = options.bidAmount || this.calculateSuggestedBid(job, account);

    const proposal: Proposal = {
      id: `prop-${Date.now()}`,
      jobId,
      accountId,
      coverLetter,
      bidAmount: suggestedBid,
      bidType: job.budgetType,
      tone: options.tone,
      aiGenerated: true,
      status: 'draft',
      portfolioItems: options.includePortfolio
    };

    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  private generateCoverLetter(
    job: FreelanceJob,
    account: FreelanceAccount,
    template: typeof PROPOSAL_TEMPLATES[ProposalTone],
    customInstructions?: string
  ): string {
    // In production, this would call an AI service
    // For now, generate a structured template

    const skillMatches = job.skills.filter(s =>
      account.settings.preferredCategories.some(cat =>
        CATEGORY_CONFIG[cat]?.skills.some(skill =>
          skill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );

    return `${template.opening}

## Why I'm the Right Fit

${skillMatches.length > 0 ? `I have extensive experience with ${skillMatches.slice(0, 3).join(', ')} - exactly what you need for this project.` : ''}

Based on my ${account.metrics.completedJobs}+ completed projects with a ${account.metrics.successRate}% success rate, here's my approach:

1. **Discovery Phase**: I'll start by understanding your specific requirements and goals
2. **Development**: Implement the solution using industry best practices
3. **Testing & Refinement**: Thorough QA to ensure everything works perfectly
4. **Delivery & Support**: Hand over with documentation and continued support

## My Relevant Experience

With ${account.metrics.reviewCount} five-star reviews and ${account.metrics.level ? `${account.metrics.level} status` : 'proven track record'}, I've consistently delivered results that exceed expectations.

${customInstructions ? `\n## Additional Notes\n${customInstructions}\n` : ''}
${template.closing}

Best regards,
${account.displayName}`;
  }

  private calculateSuggestedBid(job: FreelanceJob, account: FreelanceAccount): number {
    if (job.budgetFixed) {
      // For fixed price, bid slightly below to be competitive
      return Math.round(job.budgetFixed * 0.95);
    }

    if (job.budgetMin && job.budgetMax) {
      // For hourly, suggest middle of range adjusted by experience
      const midpoint = (job.budgetMin + job.budgetMax) / 2;
      const experienceMultiplier = account.metrics.successRate > 95 ? 1.1 : 1;
      return Math.round(midpoint * experienceMultiplier);
    }

    return account.settings.minBudget;
  }

  getProposals(filters?: {
    accountId?: string;
    jobId?: string;
    status?: Proposal['status'];
  }): Proposal[] {
    let proposals = Array.from(this.proposals.values());

    if (filters) {
      if (filters.accountId) {
        proposals = proposals.filter(p => p.accountId === filters.accountId);
      }
      if (filters.jobId) {
        proposals = proposals.filter(p => p.jobId === filters.jobId);
      }
      if (filters.status) {
        proposals = proposals.filter(p => p.status === filters.status);
      }
    }

    return proposals;
  }

  updateProposal(proposalId: string, updates: Partial<Proposal>): Proposal | undefined {
    const proposal = this.proposals.get(proposalId);
    if (proposal) {
      Object.assign(proposal, updates);
      return proposal;
    }
    return undefined;
  }

  async submitProposal(proposalId: string): Promise<Proposal> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    // In production, this would submit to the platform API
    proposal.status = 'submitted';
    proposal.submittedAt = new Date().toISOString();

    // Update job status
    const job = this.jobs.get(proposal.jobId);
    if (job) {
      job.status = 'applied';
      job.appliedAt = proposal.submittedAt;
    }

    return proposal;
  }

  // Package Generation (for Fiverr-style platforms)
  async generatePackage(
    accountId: string,
    options: {
      category: JobCategory;
      serviceName: string;
      description: string;
      basePrice: number;
    }
  ): Promise<ServicePackage> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Generate three-tier pricing
    const pkg: ServicePackage = {
      id: `pkg-${Date.now()}`,
      accountId,
      platform: account.platform,
      name: options.serviceName,
      description: options.description,
      category: options.category,
      tiers: {
        basic: {
          name: 'Basic',
          description: 'Essential package for small projects',
          price: options.basePrice,
          deliveryDays: 7,
          revisions: 2,
          features: ['Source files', 'Basic support', '1 concept']
        },
        standard: {
          name: 'Standard',
          description: 'Most popular - great value for growing businesses',
          price: Math.round(options.basePrice * 2),
          deliveryDays: 5,
          revisions: 4,
          features: ['Source files', 'Priority support', '3 concepts', 'Revisions', 'Commercial use']
        },
        premium: {
          name: 'Premium',
          description: 'Complete solution with all features',
          price: Math.round(options.basePrice * 3.5),
          deliveryDays: 3,
          revisions: -1, // Unlimited
          features: ['Source files', 'VIP support', 'Unlimited concepts', 'Unlimited revisions', 'Commercial use', 'Rush delivery', 'Consultation']
        }
      },
      tags: CATEGORY_CONFIG[options.category]?.skills.slice(0, 5) || [],
      status: 'draft',
      stats: {
        impressions: 0,
        clicks: 0,
        orders: 0,
        revenue: 0,
        avgRating: 0
      }
    };

    this.packages.set(pkg.id, pkg);
    return pkg;
  }

  getPackages(accountId?: string): ServicePackage[] {
    let packages = Array.from(this.packages.values());
    if (accountId) {
      packages = packages.filter(p => p.accountId === accountId);
    }
    return packages;
  }

  updatePackage(packageId: string, updates: Partial<ServicePackage>): ServicePackage | undefined {
    const pkg = this.packages.get(packageId);
    if (pkg) {
      Object.assign(pkg, updates);
      return pkg;
    }
    return undefined;
  }

  // Analytics
  getAnalytics(period: FreelanceAnalytics['period'] = 'month'): FreelanceAnalytics {
    const accounts = this.getAccounts();
    const jobs = this.getJobs({ status: 'applied' });

    // Calculate aggregated stats
    const totalEarnings = accounts.reduce((sum, a) => sum + a.metrics.earnings, 0);
    const totalJobs = accounts.reduce((sum, a) => sum + a.metrics.completedJobs, 0);

    const byPlatform: FreelanceAnalytics['byPlatform'] = {} as any;
    accounts.forEach(acc => {
      byPlatform[acc.platform] = {
        earnings: acc.metrics.earnings,
        jobs: acc.metrics.completedJobs,
        proposals: jobs.filter(j => j.platform === acc.platform).length,
        hires: Math.round(acc.metrics.completedJobs * 0.3),
        avgRating: acc.metrics.rating
      };
    });

    return {
      period,
      totalEarnings,
      totalJobs,
      avgJobValue: totalJobs > 0 ? Math.round(totalEarnings / totalJobs) : 0,
      successRate: accounts.length > 0 ? accounts.reduce((sum, a) => sum + a.metrics.successRate, 0) / accounts.length : 0,
      jobsApplied: jobs.length,
      proposalsSent: this.proposals.size,
      interviews: Math.round(jobs.length * 0.25),
      hires: Math.round(jobs.length * 0.15),
      applicationToInterview: 25,
      interviewToHire: 60,
      overallConversion: 15,
      byPlatform,
      byCategory: {
        web_development: { earnings: Math.round(totalEarnings * 0.5), jobs: Math.round(totalJobs * 0.5), avgRate: 75 },
        mobile_development: { earnings: Math.round(totalEarnings * 0.2), jobs: Math.round(totalJobs * 0.2), avgRate: 85 },
        ai_ml: { earnings: Math.round(totalEarnings * 0.15), jobs: Math.round(totalJobs * 0.15), avgRate: 100 },
        design: { earnings: Math.round(totalEarnings * 0.1), jobs: Math.round(totalJobs * 0.1), avgRate: 60 },
        other: { earnings: Math.round(totalEarnings * 0.05), jobs: Math.round(totalJobs * 0.05), avgRate: 50 }
      } as any,
      earningsTrend: this.generateTrendData(30, 2000, 8000),
      jobsTrend: this.generateTrendData(30, 1, 5).map(d => ({ ...d, count: d.amount }))
    };
  }

  private generateTrendData(days: number, min: number, max: number): { date: string; amount: number }[] {
    const data: { date: string; amount: number }[] = [];
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        amount: Math.round(min + Math.random() * (max - min))
      });
    }

    return data;
  }

  // Auto-apply functionality
  async autoApply(accountId: string): Promise<{ applied: number; skipped: number; errors: string[] }> {
    const account = this.accounts.get(accountId);
    if (!account || !account.settings.autoApply) {
      return { applied: 0, skipped: 0, errors: ['Account not configured for auto-apply'] };
    }

    const jobs = this.getJobs({
      platform: account.platform,
      status: 'new',
      minScore: 75
    });

    let applied = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const job of jobs.slice(0, account.settings.maxBidsPerDay)) {
      // Check if job matches account preferences
      if (job.budgetFixed && (job.budgetFixed < account.settings.minBudget || job.budgetFixed > account.settings.maxBudget)) {
        skipped++;
        continue;
      }

      // Check exclude keywords
      if (account.settings.excludeKeywords.some(kw =>
        job.title.toLowerCase().includes(kw.toLowerCase()) ||
        job.description.toLowerCase().includes(kw.toLowerCase())
      )) {
        skipped++;
        continue;
      }

      try {
        const proposal = await this.generateProposal(job.id, accountId, {
          tone: 'professional'
        });
        await this.submitProposal(proposal.id);
        applied++;
      } catch (err: any) {
        errors.push(`Failed to apply to ${job.title}: ${err.message}`);
      }
    }

    return { applied, skipped, errors };
  }
}

// Factory function
export function createFreelanceHubService(): FreelanceHubService {
  return new FreelanceHubService();
}

// Export singleton instance
export const freelanceHub = createFreelanceHubService();
