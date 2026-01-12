/**
 * Freelance Hub Dashboard
 * Unified management for all freelance platforms - discover jobs, auto-generate proposals, manage leads
 */

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Zap,
  Globe,
  Plus,
  Settings,
  X,
  ChevronRight,
  ExternalLink,
  Copy,
  Edit3,
  Trash2,
  Play,
  Pause,
  MoreVertical,
  FileText,
  Award,
  BarChart3,
  Calendar,
  Link2,
  Unlink,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Package,
  Layers,
  Bot,
  ArrowRight
} from 'lucide-react';

// Types from service
type FreelancePlatform = 'upwork' | 'fiverr' | 'freelancer' | 'toptal' | 'guru' | 'peopleperhour' | '99designs' | 'contra' | 'flexjobs';
type JobCategory = 'web_development' | 'mobile_development' | 'design' | 'writing' | 'marketing' | 'video' | 'music' | 'business' | 'admin' | 'customer_service' | 'data_entry' | 'ai_ml' | 'other';
type ProposalTone = 'professional' | 'friendly' | 'confident' | 'consultative' | 'value_focused';

interface FreelanceAccount {
  id: string;
  platform: FreelancePlatform;
  username: string;
  displayName: string;
  profileUrl: string;
  connected: boolean;
  metrics: {
    rating: number;
    reviewCount: number;
    completedJobs: number;
    successRate: number;
    responseTime: string;
    earnings: number;
    level?: string;
  };
  settings: {
    autoApply: boolean;
    maxBidsPerDay: number;
    minBudget: number;
    maxBudget: number;
  };
}

interface FreelanceJob {
  id: string;
  platform: FreelancePlatform;
  title: string;
  description: string;
  category: JobCategory;
  skills: string[];
  budgetType: 'fixed' | 'hourly';
  budgetMin?: number;
  budgetMax?: number;
  budgetFixed?: number;
  duration?: string;
  postedAt: string;
  client: {
    name?: string;
    location?: string;
    rating?: number;
    totalSpent?: number;
    hireRate?: number;
    verified?: boolean;
  };
  proposals: number;
  matchScore: number;
  overallScore: number;
  status: 'new' | 'viewed' | 'applied' | 'interviewing' | 'hired' | 'rejected' | 'closed' | 'saved';
  url: string;
}

// Platform configuration
const PLATFORM_CONFIG: Record<FreelancePlatform, { name: string; color: string; icon: string }> = {
  upwork: { name: 'Upwork', color: '#14A800', icon: 'UP' },
  fiverr: { name: 'Fiverr', color: '#1DBF73', icon: 'FV' },
  freelancer: { name: 'Freelancer', color: '#29B2FE', icon: 'FR' },
  toptal: { name: 'Toptal', color: '#204ECF', icon: 'TT' },
  guru: { name: 'Guru', color: '#5BBB7B', icon: 'GU' },
  peopleperhour: { name: 'PeoplePerHour', color: '#00B3E3', icon: 'PPH' },
  '99designs': { name: '99designs', color: '#F26322', icon: '99' },
  contra: { name: 'Contra', color: '#000000', icon: 'CO' },
  flexjobs: { name: 'FlexJobs', color: '#2D6187', icon: 'FJ' }
};

const TONE_CONFIG: Record<ProposalTone, { label: string; description: string }> = {
  professional: { label: 'Professional', description: 'Formal and structured' },
  friendly: { label: 'Friendly', description: 'Warm and approachable' },
  confident: { label: 'Confident', description: 'Assertive and achievement-focused' },
  consultative: { label: 'Consultative', description: 'Strategic partnership approach' },
  value_focused: { label: 'Value-Focused', description: 'ROI and business impact' }
};

const CATEGORY_CONFIG: Record<JobCategory, { label: string }> = {
  web_development: { label: 'Web Development' },
  mobile_development: { label: 'Mobile Development' },
  design: { label: 'Design' },
  writing: { label: 'Writing & Content' },
  marketing: { label: 'Marketing' },
  video: { label: 'Video & Animation' },
  music: { label: 'Music & Audio' },
  business: { label: 'Business & Consulting' },
  admin: { label: 'Admin & Support' },
  customer_service: { label: 'Customer Service' },
  data_entry: { label: 'Data Entry' },
  ai_ml: { label: 'AI & Machine Learning' },
  other: { label: 'Other' }
};

// Mock data
const generateMockData = () => {
  const accounts: FreelanceAccount[] = [
    {
      id: 'acc-1',
      platform: 'upwork',
      username: 'johndoe_dev',
      displayName: 'John Doe',
      profileUrl: 'https://upwork.com/freelancers/johndoe',
      connected: true,
      metrics: { rating: 4.9, reviewCount: 47, completedJobs: 52, successRate: 98, responseTime: '< 1 hour', earnings: 125000, level: 'Top Rated Plus' },
      settings: { autoApply: false, maxBidsPerDay: 10, minBudget: 500, maxBudget: 50000 }
    },
    {
      id: 'acc-2',
      platform: 'fiverr',
      username: 'prodev_studio',
      displayName: 'ProDev Studio',
      profileUrl: 'https://fiverr.com/prodev_studio',
      connected: true,
      metrics: { rating: 4.8, reviewCount: 234, completedJobs: 312, successRate: 99, responseTime: '30 mins', earnings: 89000, level: 'Top Rated Seller' },
      settings: { autoApply: true, maxBidsPerDay: 20, minBudget: 50, maxBudget: 10000 }
    },
    {
      id: 'acc-3',
      platform: 'freelancer',
      username: 'fullstack_pro',
      displayName: 'FullStack Pro',
      profileUrl: 'https://freelancer.com/u/fullstack_pro',
      connected: false,
      metrics: { rating: 4.7, reviewCount: 89, completedJobs: 102, successRate: 94, responseTime: '2 hours', earnings: 67000, level: 'Preferred Freelancer' },
      settings: { autoApply: false, maxBidsPerDay: 15, minBudget: 200, maxBudget: 25000 }
    },
    {
      id: 'acc-4',
      platform: 'toptal',
      username: 'john_toptal',
      displayName: 'John D.',
      profileUrl: 'https://toptal.com/resume/john',
      connected: false,
      metrics: { rating: 5.0, reviewCount: 12, completedJobs: 15, successRate: 100, responseTime: '1 hour', earnings: 180000, level: 'Top 3%' },
      settings: { autoApply: false, maxBidsPerDay: 5, minBudget: 5000, maxBudget: 100000 }
    }
  ];

  const jobs: FreelanceJob[] = [
    {
      id: 'job-1',
      platform: 'upwork',
      title: 'Senior React Developer for SaaS Dashboard',
      description: 'We need an experienced React developer to build a modern analytics dashboard. Must have experience with TypeScript, Redux, and data visualization libraries.',
      category: 'web_development',
      skills: ['React', 'TypeScript', 'Redux', 'Chart.js'],
      budgetType: 'fixed',
      budgetFixed: 5000,
      duration: '1-3 months',
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      client: { name: 'Tech Startup Inc', location: 'United States', rating: 4.8, totalSpent: 150000, hireRate: 85, verified: true },
      proposals: 12,
      matchScore: 95,
      overallScore: 88,
      status: 'new',
      url: 'https://upwork.com/jobs/12345'
    },
    {
      id: 'job-2',
      platform: 'upwork',
      title: 'Full-Stack Developer for E-commerce Platform',
      description: 'Looking for a full-stack developer to enhance our Shopify-based e-commerce platform.',
      category: 'web_development',
      skills: ['React', 'Node.js', 'Shopify', 'GraphQL'],
      budgetType: 'hourly',
      budgetMin: 50,
      budgetMax: 80,
      duration: '3-6 months',
      postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      client: { name: 'E-Shop Global', location: 'Canada', rating: 4.9, totalSpent: 320000, hireRate: 92, verified: true },
      proposals: 25,
      matchScore: 92,
      overallScore: 86,
      status: 'new',
      url: 'https://upwork.com/jobs/12346'
    },
    {
      id: 'job-3',
      platform: 'fiverr',
      title: 'Build a Custom CRM System',
      description: 'Need a developer to create a custom CRM for my real estate business.',
      category: 'web_development',
      skills: ['React', 'Node.js', 'PostgreSQL'],
      budgetType: 'fixed',
      budgetFixed: 3500,
      postedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      client: { name: 'Real Estate Pro', location: 'United States', rating: 4.6, totalSpent: 12000, hireRate: 78, verified: true },
      proposals: 8,
      matchScore: 98,
      overallScore: 86,
      status: 'new',
      url: 'https://fiverr.com/requests/78901'
    },
    {
      id: 'job-4',
      platform: 'freelancer',
      title: 'AI-Powered Chatbot Development',
      description: 'Looking for an AI expert to build a customer service chatbot using GPT-4.',
      category: 'ai_ml',
      skills: ['Python', 'OpenAI API', 'NLP', 'JavaScript'],
      budgetType: 'fixed',
      budgetFixed: 8000,
      duration: '1-2 months',
      postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      client: { name: 'ServiceTech', location: 'United Kingdom', rating: 4.5, totalSpent: 45000, hireRate: 70, verified: true },
      proposals: 35,
      matchScore: 90,
      overallScore: 80,
      status: 'saved',
      url: 'https://freelancer.com/projects/45678'
    },
    {
      id: 'job-5',
      platform: 'upwork',
      title: 'Mobile App Developer - React Native',
      description: 'We need a React Native developer to build a fitness tracking app for iOS and Android.',
      category: 'mobile_development',
      skills: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
      budgetType: 'fixed',
      budgetFixed: 12000,
      duration: '2-3 months',
      postedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      client: { name: 'FitTech Labs', location: 'Australia', rating: 4.9, totalSpent: 200000, hireRate: 90, verified: true },
      proposals: 8,
      matchScore: 88,
      overallScore: 90,
      status: 'new',
      url: 'https://upwork.com/jobs/12347'
    }
  ];

  return { accounts, jobs };
};

// Components
const PlatformBadge: React.FC<{ platform: FreelancePlatform }> = ({ platform }) => {
  const config = PLATFORM_CONFIG[platform];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white"
      style={{ backgroundColor: config.color }}
    >
      {config.icon}
    </span>
  );
};

const ScoreBadge: React.FC<{ score: number; label?: string }> = ({ score, label }) => {
  const color = score >= 85 ? 'text-green-600 bg-green-100' : score >= 70 ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {label && <span>{label}:</span>}
      {score}%
    </span>
  );
};

const StatusBadge: React.FC<{ status: FreelanceJob['status'] }> = ({ status }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'New' },
    viewed: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Viewed' },
    applied: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Applied' },
    interviewing: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Interviewing' },
    hired: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hired!' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Not Selected' },
    closed: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Closed' },
    saved: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Saved' }
  };
  const { bg, text, label } = config[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>{label}</span>;
};

// Main Component
const FreelanceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'accounts' | 'proposals' | 'packages' | 'analytics'>('jobs');
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [selectedJob, setSelectedJob] = useState<FreelanceJob | null>(null);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ProposalTone>('professional');
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [generating, setGenerating] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const { accounts, jobs } = data;

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    if (filterPlatform !== 'all' && job.platform !== filterPlatform) return false;
    if (filterCategory !== 'all' && job.category !== filterCategory) return false;
    if (job.overallScore < minScore) return false;
    return true;
  }).sort((a, b) => b.overallScore - a.overallScore);

  // Stats
  const totalEarnings = accounts.reduce((sum, a) => sum + a.metrics.earnings, 0);
  const avgRating = accounts.length > 0 ? (accounts.reduce((sum, a) => sum + a.metrics.rating, 0) / accounts.length).toFixed(1) : '0';
  const totalJobs = accounts.reduce((sum, a) => sum + a.metrics.completedJobs, 0);
  const connectedAccounts = accounts.filter(a => a.connected).length;

  // Generate proposal
  const handleGenerateProposal = async () => {
    if (!selectedJob) return;
    setGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const proposals: Record<ProposalTone, string> = {
      professional: `Dear ${selectedJob.client.name || 'Hiring Manager'},

Thank you for posting this opportunity. I've reviewed your requirements for "${selectedJob.title}" and believe I'm exceptionally well-suited to deliver outstanding results.

**Why I'm the Perfect Fit:**
• ${selectedJob.skills.slice(0, 3).join(', ')} expert with 5+ years of hands-on experience
• 98% job success rate with ${totalJobs}+ completed projects
• Proven track record of delivering on time and exceeding expectations

**My Approach:**
1. Discovery call to understand your specific needs
2. Detailed project plan with milestones
3. Regular updates and collaborative feedback loops
4. Thorough testing and documentation

I'm confident I can deliver exceptional value for your ${selectedJob.budgetType === 'fixed' ? `budget of $${selectedJob.budgetFixed?.toLocaleString()}` : `hourly rate of $${selectedJob.budgetMin}-${selectedJob.budgetMax}/hr`}.

Looking forward to discussing this opportunity further.

Best regards`,
      friendly: `Hey there! 👋

Just saw your project for "${selectedJob.title}" and got really excited - this is exactly the kind of work I love doing!

I've been working with ${selectedJob.skills.slice(0, 2).join(' and ')} for years now, and I've helped tons of clients build exactly what you're describing.

A few quick things about me:
✅ ${avgRating} star rating across ${accounts.reduce((sum, a) => sum + a.metrics.reviewCount, 0)}+ reviews
✅ ${totalJobs}+ projects completed successfully
✅ Quick communicator - I usually respond within an hour

I'd love to hop on a quick call to learn more about your vision. What times work for you?

Cheers!`,
      confident: `I've delivered ${totalJobs}+ successful projects with a ${accounts[0]?.metrics.successRate || 98}% success rate. Here's exactly how I'll handle "${selectedJob.title}":

**My Qualifications:**
• Expert-level proficiency in ${selectedJob.skills.join(', ')}
• ${accounts[0]?.metrics.level || 'Top Rated'} status across platforms
• $${totalEarnings.toLocaleString()}+ earned with zero disputes

**What You'll Get:**
✓ Production-ready code delivered on schedule
✓ Comprehensive documentation
✓ 30-day support after delivery

I've successfully completed similar projects for companies like yours. The results speak for themselves.

Ready to start immediately. Let's discuss.`,
      consultative: `Before I dive into my proposal, I'd like to understand a few things about your goals for "${selectedJob.title}":

1. What's driving this project - is there a specific business outcome you're targeting?
2. Are there any existing systems this needs to integrate with?
3. What does success look like for you in 3-6 months?

I ask because I've found that understanding the "why" behind a project leads to much better outcomes than just building to spec.

**About My Approach:**
I treat every project as a partnership. With ${totalJobs}+ successful deliveries and a ${avgRating} rating, I've developed a methodology that consistently exceeds expectations.

Would you be open to a 15-minute discovery call? I have availability this week.`,
      value_focused: `**ROI Analysis for "${selectedJob.title}"**

Based on my experience with similar projects, here's what you can expect:

**Investment:** ${selectedJob.budgetType === 'fixed' ? `$${selectedJob.budgetFixed?.toLocaleString()}` : `$${selectedJob.budgetMin}-${selectedJob.budgetMax}/hr`}
**Expected Return:** 3-5x within 6 months based on:
• Increased efficiency: 40% time savings
• Improved user experience: 25% higher engagement
• Reduced maintenance: 50% fewer issues

**Why This Matters:**
With ${totalJobs}+ projects delivered at $${totalEarnings.toLocaleString()}+ total value, I've consistently helped clients achieve measurable business outcomes.

**My Guarantee:**
I don't just deliver code - I deliver results. Let's discuss how this project can generate real value for your business.`
    };

    setGeneratedProposal(proposals[selectedTone]);
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Freelance Hub</h1>
          <p className="text-slate-600">Discover jobs, generate proposals, and manage all your freelance platforms in one place</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setConnectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            Connect Platform
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Earnings</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-bold text-green-600">${totalEarnings.toLocaleString()}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Jobs Completed</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-bold text-slate-900">{totalJobs}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Avg Rating</span>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
          <span className="text-2xl font-bold text-slate-900">{avgRating}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Platforms</span>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{connectedAccounts}</span>
            <span className="text-sm text-slate-500">/ {accounts.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">New Jobs</span>
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-bold text-orange-600">{jobs.filter(j => j.status === 'new').length}</span>
        </div>
      </div>

      {/* Connected Platforms Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Connected Platforms</h2>
          <button
            onClick={() => setActiveTab('accounts')}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            Manage All
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {accounts.map(account => (
            <div
              key={account.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                account.connected ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: PLATFORM_CONFIG[account.platform].color }}
              >
                {PLATFORM_CONFIG[account.platform].icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{PLATFORM_CONFIG[account.platform].name}</span>
                  {account.connected ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {account.metrics.rating}
                  <span>•</span>
                  <span>${account.metrics.earnings.toLocaleString()}</span>
                  {account.metrics.level && (
                    <>
                      <span>•</span>
                      <span className="text-orange-600">{account.metrics.level}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setConnectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:border-orange-500 hover:text-orange-600 transition"
          >
            <Plus className="w-5 h-5" />
            Add Platform
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'jobs', label: 'Job Discovery', icon: Briefcase },
            { id: 'accounts', label: 'Accounts', icon: Users },
            { id: 'proposals', label: 'Proposals', icon: FileText },
            { id: 'packages', label: 'Packages/Gigs', icon: Package },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Platforms</option>
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Min Score:</span>
              <input
                type="range"
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm font-medium text-slate-700">{minScore}%</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition ml-auto">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-orange-200 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <PlatformBadge platform={job.platform} />
                      <ScoreBadge score={job.matchScore} label="Match" />
                      <StatusBadge status={job.status} />
                      <span className="text-xs text-slate-500">
                        {new Date(job.postedAt).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-green-600">
                      {job.budgetType === 'fixed' ? (
                        `$${job.budgetFixed?.toLocaleString()}`
                      ) : (
                        `$${job.budgetMin}-${job.budgetMax}/hr`
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{job.budgetType}</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Client & Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.proposals} proposals
                    </span>
                    {job.client.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {job.client.rating} client rating
                      </span>
                    )}
                    {job.client.totalSpent && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${(job.client.totalSpent / 1000).toFixed(0)}k spent
                      </span>
                    )}
                    {job.client.verified && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-slate-600 text-sm hover:bg-slate-100 rounded-lg transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setProposalModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate Proposal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: PLATFORM_CONFIG[account.platform].color }}
                  >
                    {PLATFORM_CONFIG[account.platform].icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold text-slate-900">{PLATFORM_CONFIG[account.platform].name}</span>
                      {account.connected ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                          <CheckCircle className="w-3 h-3" /> Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                          <Unlink className="w-3 h-3" /> Disconnected
                        </span>
                      )}
                      {account.metrics.level && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                          <Award className="w-3 h-3" /> {account.metrics.level}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">@{account.username}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {account.connected ? (
                    <button className="px-3 py-1.5 text-red-600 text-sm hover:bg-red-50 rounded-lg transition">
                      Disconnect
                    </button>
                  ) : (
                    <button className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition">
                      Connect
                    </button>
                  )}
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                    <Settings className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-slate-900">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    {account.metrics.rating}
                  </div>
                  <div className="text-xs text-slate-500">{account.metrics.reviewCount} reviews</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{account.metrics.completedJobs}</div>
                  <div className="text-xs text-slate-500">Completed</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{account.metrics.successRate}%</div>
                  <div className="text-xs text-slate-500">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">${(account.metrics.earnings / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-slate-500">Earned</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{account.metrics.responseTime}</div>
                  <div className="text-xs text-slate-500">Response Time</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={account.settings.autoApply}
                      className="rounded text-orange-500 focus:ring-orange-500"
                      onChange={() => {}}
                    />
                    <span className="text-slate-700">Auto-apply to matching jobs</span>
                  </label>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500">Max {account.settings.maxBidsPerDay} bids/day</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500">${account.settings.minBudget}-${account.settings.maxBudget} budget range</span>
                </div>
                <a
                  href={account.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                >
                  View Profile <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'proposals' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Proposals Yet</h3>
          <p className="text-slate-600 mb-4">Generate your first AI-powered proposal from the Jobs tab</p>
          <button
            onClick={() => setActiveTab('jobs')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Browse Jobs
          </button>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Create service packages for Fiverr, PeoplePerHour, and similar platforms</p>
            <button
              onClick={() => setPackageModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Create Package
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Packages Created</h3>
            <p className="text-slate-600 mb-4">Create your first service package with AI-generated pricing tiers</p>
            <button
              onClick={() => setPackageModalOpen(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Create Package
            </button>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Earnings by Platform</h2>
            <div className="space-y-4">
              {accounts.filter(a => a.connected).map(account => {
                const percentage = (account.metrics.earnings / totalEarnings) * 100;
                return (
                  <div key={account.id} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: PLATFORM_CONFIG[account.platform].color }}
                    >
                      {PLATFORM_CONFIG[account.platform].icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900">{PLATFORM_CONFIG[account.platform].name}</span>
                        <span className="text-sm font-medium text-slate-900">${account.metrics.earnings.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${percentage}%`, backgroundColor: PLATFORM_CONFIG[account.platform].color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Conversion Funnel</h2>
            <div className="space-y-3">
              {[
                { label: 'Jobs Viewed', value: 156, percentage: 100 },
                { label: 'Proposals Sent', value: 45, percentage: 29 },
                { label: 'Interviews', value: 18, percentage: 40 },
                { label: 'Hired', value: 12, percentage: 67 }
              ].map((step, index) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{step.label}</span>
                      <span className="text-sm font-medium text-slate-900">{step.value}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${step.percentage}%` }}
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <span className="text-sm text-green-600 font-medium w-12 text-right">{step.percentage}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">${Math.round(totalEarnings / totalJobs).toLocaleString()}</div>
                <div className="text-sm text-slate-500">Avg Job Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">96%</div>
                <div className="text-sm text-slate-500">On-Time Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">45 min</div>
                <div className="text-sm text-slate-500">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">26%</div>
                <div className="text-sm text-slate-500">Win Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {proposalModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Generate Proposal</h2>
                <button
                  onClick={() => {
                    setProposalModalOpen(false);
                    setSelectedJob(null);
                    setGeneratedProposal('');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Job Preview */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <PlatformBadge platform={selectedJob.platform} />
                  <span className="text-sm text-slate-500">{selectedJob.client.name}</span>
                </div>
                <h3 className="font-semibold text-slate-900">{selectedJob.title}</h3>
                <div className="text-sm text-green-600 mt-1">
                  {selectedJob.budgetType === 'fixed' ? `$${selectedJob.budgetFixed?.toLocaleString()}` : `$${selectedJob.budgetMin}-${selectedJob.budgetMax}/hr`}
                </div>
              </div>

              {/* Tone Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">Proposal Tone</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(TONE_CONFIG).map(([tone, config]) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone as ProposalTone)}
                      className={`p-3 rounded-lg border text-left transition ${
                        selectedTone === tone
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 hover:border-orange-300'
                      }`}
                    >
                      <div className={`text-sm font-medium ${selectedTone === tone ? 'text-orange-600' : 'text-slate-700'}`}>
                        {config.label}
                      </div>
                      <div className="text-xs text-slate-500">{config.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              {!generatedProposal && (
                <button
                  onClick={handleGenerateProposal}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating AI Proposal...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Proposal
                    </>
                  )}
                </button>
              )}

              {/* Generated Proposal */}
              {generatedProposal && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">Generated Proposal</label>
                    <button
                      onClick={handleGenerateProposal}
                      className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                  </div>
                  <textarea
                    value={generatedProposal}
                    onChange={(e) => setGeneratedProposal(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{generatedProposal.length} characters</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedProposal)}
                      className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setProposalModalOpen(false);
                  setSelectedJob(null);
                  setGeneratedProposal('');
                }}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              {generatedProposal && (
                <>
                  <button className="px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition">
                    Save Draft
                  </button>
                  <a
                    href={selectedJob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    <Send className="w-4 h-4" />
                    Submit on {PLATFORM_CONFIG[selectedJob.platform].name}
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Connect Platform Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Connect Platform</h2>
                <button
                  onClick={() => setConnectModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-4">Select a platform to connect:</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
                  const isConnected = accounts.some(a => a.platform === key && a.connected);
                  return (
                    <button
                      key={key}
                      disabled={isConnected}
                      className={`p-4 rounded-lg border text-left transition ${
                        isConnected
                          ? 'border-green-200 bg-green-50 cursor-not-allowed'
                          : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: config.color }}
                        >
                          {config.icon}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{config.name}</div>
                          {isConnected && (
                            <div className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Connected
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setConnectModalOpen(false)}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Package Modal */}
      {packageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Create Service Package</h2>
                <button
                  onClick={() => setPackageModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  placeholder="e.g., Professional Website Development"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe your service..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base Price ($)</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-slate-500 mt-1">AI will generate Basic, Standard, and Premium tiers based on this</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setPackageModalOpen(false)}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                <Sparkles className="w-4 h-4" />
                Generate Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelanceHub;
