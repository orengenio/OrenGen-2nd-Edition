/**
 * RFP Intelligence Dashboard
 * Automated RFP discovery, analysis, and proposal management
 */

import React, { useState, useEffect } from 'react';
import {
  FileSearch,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Eye,
  Edit3,
  Trash2,
  Send,
  Calendar,
  Users,
  DollarSign,
  Building,
  FileText,
  Download,
  Upload,
  Filter,
  Search,
  Bot,
  Zap,
  Star,
  TrendingUp,
  TrendingDown,
  Bell,
  Settings,
  Play,
  Pause,
  ExternalLink,
  Copy,
  MessageSquare,
  Mail,
  Phone,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Briefcase,
  Award,
  Flag,
  Sparkles,
  Link2
} from 'lucide-react';

// Types
type RFPStatus = 'discovered' | 'analyzing' | 'go_pending' | 'pursuing' | 'submitted' | 'won' | 'lost' | 'no_bid';
type MatchRecommendation = 'strong_go' | 'go' | 'maybe' | 'no_go';
type Priority = 'critical' | 'high' | 'medium' | 'low';

interface SimplifiedRFP {
  id: string;
  title: string;
  agency: string;
  notice_id: string;
  type: string;
  posted_date: string;
  deadline: string;
  estimated_value?: { min: number; max: number };
  set_aside?: string;
  naics_code?: string;
  status: RFPStatus;

  summary: {
    one_liner: string;
    what_they_need: string;
    who_can_bid: string;
    timeline: string;
  };

  match_score: number;
  recommendation: MatchRecommendation;
  strengths: string[];
  weaknesses: string[];
  gaps: string[];

  requirements: {
    technical: string[];
    personnel: string[];
    certifications: string[];
    clearances: string[];
  };

  action_items: {
    id: string;
    title: string;
    due_date: string;
    priority: Priority;
    status: 'pending' | 'in_progress' | 'completed';
    type: string;
    calendar_synced: boolean;
  }[];

  workflow_step: number;
  proposal_progress: number;
  last_updated: string;
  auto_response_sent?: boolean;
}

interface RFPStats {
  total_discovered: number;
  pursuing: number;
  submitted: number;
  won: number;
  win_rate: number;
  pipeline_value: number;
  avg_match_score: number;
  auto_responses_sent: number;
}

// Mock data
const generateMockData = () => {
  const rfps: SimplifiedRFP[] = [
    {
      id: 'rfp-1',
      title: 'Enterprise Cloud Migration Services',
      agency: 'Department of Defense',
      notice_id: 'W912DQ24Q1234',
      type: 'Solicitation',
      posted_date: '2024-01-15',
      deadline: '2024-02-15',
      estimated_value: { min: 5000000, max: 15000000 },
      set_aside: '8(a) Business Development',
      naics_code: '541512',
      status: 'pursuing',
      summary: {
        one_liner: 'DoD solicitation for cloud migration (~$10M)',
        what_they_need: 'Migrate 50+ legacy systems to AWS GovCloud with FedRAMP compliance',
        who_can_bid: '8(a) Set-Aside | NAICS 541512',
        timeline: '28 days left'
      },
      match_score: 92,
      recommendation: 'strong_go',
      strengths: ['Direct NAICS match', 'Past DoD experience', '8(a) eligible', 'AWS partnership'],
      weaknesses: ['No Army Corps specific experience'],
      gaps: [],
      requirements: {
        technical: ['AWS migration expertise', 'FedRAMP authorization', 'DevSecOps pipeline'],
        personnel: ['Project Manager', 'Cloud Architect', 'Security Engineer'],
        certifications: ['AWS Solutions Architect', 'FedRAMP 3PAO'],
        clearances: ['Secret']
      },
      action_items: [
        { id: 'a1', title: 'Go/No-Go Decision', due_date: '2024-01-18', priority: 'critical', status: 'completed', type: 'meeting', calendar_synced: true },
        { id: 'a2', title: 'Submit Questions', due_date: '2024-01-25', priority: 'high', status: 'in_progress', type: 'communication', calendar_synced: true },
        { id: 'a3', title: 'Draft Technical', due_date: '2024-02-05', priority: 'high', status: 'pending', type: 'document', calendar_synced: true },
        { id: 'a4', title: 'Pink Team Review', due_date: '2024-02-10', priority: 'high', status: 'pending', type: 'review', calendar_synced: true }
      ],
      workflow_step: 4,
      proposal_progress: 35,
      last_updated: '2024-01-16T10:30:00Z'
    },
    {
      id: 'rfp-2',
      title: 'Cybersecurity Operations Center Support',
      agency: 'Department of Energy',
      notice_id: 'DE-SOL-0012345',
      type: 'Combined',
      posted_date: '2024-01-10',
      deadline: '2024-02-28',
      estimated_value: { min: 10000000, max: 25000000 },
      set_aside: 'Small Business',
      naics_code: '541519',
      status: 'analyzing',
      summary: {
        one_liner: 'DOE combined for SOC support (~$17.5M)',
        what_they_need: '24/7 SOC operations, incident response, threat hunting',
        who_can_bid: 'Small Business Set-Aside | NAICS 541519',
        timeline: '43 days left'
      },
      match_score: 78,
      recommendation: 'go',
      strengths: ['NAICS match', 'SOC experience', 'Small business eligible'],
      weaknesses: ['No DOE past performance', 'Missing some certifications'],
      gaps: ['CISM certification needed'],
      requirements: {
        technical: ['SIEM management', 'Incident response', 'Threat intelligence'],
        personnel: ['SOC Manager', 'Senior Analysts', 'Threat Hunters'],
        certifications: ['CISSP', 'CISM', 'GCIA'],
        clearances: ['Top Secret']
      },
      action_items: [
        { id: 'b1', title: 'Go/No-Go Decision', due_date: '2024-01-20', priority: 'critical', status: 'pending', type: 'meeting', calendar_synced: false }
      ],
      workflow_step: 2,
      proposal_progress: 0,
      last_updated: '2024-01-15T14:00:00Z'
    },
    {
      id: 'rfp-3',
      title: 'Healthcare Data Analytics Platform',
      agency: 'HHS - CMS',
      notice_id: 'HHSN-2024-00123',
      type: 'PreSolicitation',
      posted_date: '2024-01-08',
      deadline: '2024-03-15',
      estimated_value: { min: 15000000, max: 50000000 },
      naics_code: '541511',
      status: 'discovered',
      summary: {
        one_liner: 'CMS pre-sol for data analytics platform (~$32.5M)',
        what_they_need: 'Modern analytics platform for Medicare/Medicaid claims data',
        who_can_bid: 'Full & Open | NAICS 541511',
        timeline: '59 days left'
      },
      match_score: 65,
      recommendation: 'maybe',
      strengths: ['Data analytics experience', 'Healthcare sector knowledge'],
      weaknesses: ['No CMS past performance', 'Full & open competition'],
      gaps: ['HIPAA compliance experience limited', 'No FedRAMP ATO'],
      requirements: {
        technical: ['Big data processing', 'ML/AI analytics', 'HIPAA compliance'],
        personnel: ['Data Scientists', 'Healthcare SMEs', 'Cloud Engineers'],
        certifications: ['HIPAA', 'FedRAMP'],
        clearances: ['Public Trust']
      },
      action_items: [
        { id: 'c1', title: 'Initial Review', due_date: '2024-01-22', priority: 'medium', status: 'pending', type: 'review', calendar_synced: false }
      ],
      workflow_step: 1,
      proposal_progress: 0,
      last_updated: '2024-01-12T09:00:00Z'
    },
    {
      id: 'rfp-4',
      title: 'IT Modernization Support Services',
      agency: 'General Services Administration',
      notice_id: 'GSA-ITS-2024-001',
      type: 'Sources Sought',
      posted_date: '2024-01-12',
      deadline: '2024-01-26',
      naics_code: '541512',
      status: 'discovered',
      summary: {
        one_liner: 'GSA sources sought for IT modernization',
        what_they_need: 'Market research for IT modernization services',
        who_can_bid: 'All interested vendors',
        timeline: '10 days left - AUTO-RESPONSE SENT'
      },
      match_score: 88,
      recommendation: 'strong_go',
      strengths: ['Direct NAICS match', 'GSA experience', 'IT modernization expertise'],
      weaknesses: [],
      gaps: [],
      requirements: {
        technical: ['Legacy modernization', 'Cloud services', 'Agile development'],
        personnel: [],
        certifications: [],
        clearances: []
      },
      action_items: [],
      workflow_step: 1,
      proposal_progress: 100,
      last_updated: '2024-01-12T11:00:00Z',
      auto_response_sent: true
    },
    {
      id: 'rfp-5',
      title: 'Satellite Communications Support',
      agency: 'NASA',
      notice_id: 'NNH24-SATCOM-001',
      type: 'Solicitation',
      posted_date: '2024-01-05',
      deadline: '2024-01-20',
      estimated_value: { min: 20000000, max: 50000000 },
      naics_code: '541330',
      status: 'no_bid',
      summary: {
        one_liner: 'NASA solicitation for satellite communications (~$35M)',
        what_they_need: 'Ground station operations and satellite communications',
        who_can_bid: 'Full & Open | NAICS 541330',
        timeline: 'PASSED'
      },
      match_score: 32,
      recommendation: 'no_go',
      strengths: [],
      weaknesses: ['No satellite experience', 'NAICS mismatch', 'No NASA past performance'],
      gaps: ['Completely outside core competencies'],
      requirements: {
        technical: ['Satellite ground stations', 'RF engineering', 'Space systems'],
        personnel: ['RF Engineers', 'Space Systems Engineers'],
        certifications: ['Security clearances'],
        clearances: ['Top Secret/SCI']
      },
      action_items: [],
      workflow_step: 0,
      proposal_progress: 0,
      last_updated: '2024-01-06T08:00:00Z'
    }
  ];

  const stats: RFPStats = {
    total_discovered: 24,
    pursuing: 3,
    submitted: 8,
    won: 5,
    win_rate: 62.5,
    pipeline_value: 45000000,
    avg_match_score: 74,
    auto_responses_sent: 12
  };

  return { rfps, stats };
};

// Status badge
const StatusBadge: React.FC<{ status: RFPStatus }> = ({ status }) => {
  const config: Record<RFPStatus, { bg: string; text: string; label: string }> = {
    discovered: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Discovered' },
    analyzing: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Analyzing' },
    go_pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Go/No-Go' },
    pursuing: { bg: 'bg-green-100', text: 'text-green-700', label: 'Pursuing' },
    submitted: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Submitted' },
    won: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Won' },
    lost: { bg: 'bg-red-100', text: 'text-red-700', label: 'Lost' },
    no_bid: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'No Bid' }
  };
  const { bg, text, label } = config[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>{label}</span>;
};

// Recommendation badge
const RecommendationBadge: React.FC<{ rec: MatchRecommendation; score: number }> = ({ rec, score }) => {
  const config: Record<MatchRecommendation, { bg: string; text: string; icon: React.ComponentType<any>; label: string }> = {
    strong_go: { bg: 'bg-green-500', text: 'text-white', icon: ThumbsUp, label: 'STRONG GO' },
    go: { bg: 'bg-green-100', text: 'text-green-700', icon: ThumbsUp, label: 'GO' },
    maybe: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle, label: 'MAYBE' },
    no_go: { bg: 'bg-red-100', text: 'text-red-700', icon: ThumbsDown, label: 'NO GO' }
  };
  const { bg, text, icon: Icon, label } = config[rec];
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${bg} ${text}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
      <span className="text-lg font-bold text-slate-900">{score}%</span>
    </div>
  );
};

// Priority badge
const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const config: Record<Priority, string> = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-slate-100 text-slate-700'
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium capitalize ${config[priority]}`}>
      {priority}
    </span>
  );
};

// Workflow steps
const WORKFLOW_STEPS = [
  'Discovery',
  'Analysis',
  'Go/No-Go',
  'Questions',
  'Development',
  'Review',
  'Final',
  'Submit',
  'Award'
];

// Main Component
const RFPIntelligence: React.FC = () => {
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'discovered' | 'automation' | 'analytics'>('pipeline');
  const [selectedRFP, setSelectedRFP] = useState<SimplifiedRFP | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [autoDiscoveryEnabled, setAutoDiscoveryEnabled] = useState(true);
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(true);

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

  const { rfps, stats } = data;

  // Filter RFPs
  const filteredRFPs = rfps.filter(rfp => {
    if (searchQuery &&
        !rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !rfp.agency.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== 'all' && rfp.status !== filterStatus) return false;
    return true;
  });

  // Pipeline RFPs (active ones)
  const pipelineRFPs = filteredRFPs.filter(r =>
    ['pursuing', 'analyzing', 'go_pending', 'submitted'].includes(r.status)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">RFP Intelligence</h1>
          <p className="text-slate-600">AI-powered RFP discovery, analysis, and proposal automation</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <Settings className="w-4 h-4" />
            Capabilities
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            <RefreshCw className="w-4 h-4" />
            Scan Now
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Discovered</div>
          <div className="text-2xl font-bold text-slate-900">{stats.total_discovered}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Pursuing</div>
          <div className="text-2xl font-bold text-green-600">{stats.pursuing}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Submitted</div>
          <div className="text-2xl font-bold text-orange-600">{stats.submitted}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Won</div>
          <div className="text-2xl font-bold text-emerald-600">{stats.won}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-slate-900">{stats.win_rate}%</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Pipeline Value</div>
          <div className="text-2xl font-bold text-slate-900">${(stats.pipeline_value / 1000000).toFixed(0)}M</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Avg Match</div>
          <div className="text-2xl font-bold text-slate-900">{stats.avg_match_score}%</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Auto-Responses</div>
          <div className="text-2xl font-bold text-purple-600">{stats.auto_responses_sent}</div>
        </div>
      </div>

      {/* Automation Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`rounded-xl border p-4 ${autoDiscoveryEnabled ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${autoDiscoveryEnabled ? 'bg-green-100' : 'bg-slate-100'}`}>
                <Bot className={`w-5 h-5 ${autoDiscoveryEnabled ? 'text-green-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Auto-Discovery</h3>
                <p className="text-sm text-slate-500">Scanning SAM.gov every 6 hours</p>
              </div>
            </div>
            <button
              onClick={() => setAutoDiscoveryEnabled(!autoDiscoveryEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors ${autoDiscoveryEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${autoDiscoveryEnabled ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className={`rounded-xl border p-4 ${autoResponseEnabled ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${autoResponseEnabled ? 'bg-purple-100' : 'bg-slate-100'}`}>
                <Send className={`w-5 h-5 ${autoResponseEnabled ? 'text-purple-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Auto-Response</h3>
                <p className="text-sm text-slate-500">RFIs & Sources Sought (requires approval)</p>
              </div>
            </div>
            <button
              onClick={() => setAutoResponseEnabled(!autoResponseEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors ${autoResponseEnabled ? 'bg-purple-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${autoResponseEnabled ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'pipeline', label: 'Pipeline', icon: Target, count: pipelineRFPs.length },
            { id: 'discovered', label: 'Discovered', icon: FileSearch, count: rfps.filter(r => r.status === 'discovered').length },
            { id: 'automation', label: 'Automation', icon: Bot },
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
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      {(activeTab === 'pipeline' || activeTab === 'discovered') && (
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search RFPs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="discovered">Discovered</option>
            <option value="analyzing">Analyzing</option>
            <option value="pursuing">Pursuing</option>
            <option value="submitted">Submitted</option>
            <option value="won">Won</option>
            <option value="no_bid">No Bid</option>
          </select>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          {pipelineRFPs.map(rfp => (
            <div
              key={rfp.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                setSelectedRFP(rfp);
                setDetailOpen(true);
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={rfp.status} />
                    <span className="text-xs text-slate-500 font-mono">{rfp.notice_id}</span>
                    {rfp.auto_response_sent && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                        <Bot className="w-3 h-3" />
                        Auto-responded
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg">{rfp.title}</h3>
                  <p className="text-slate-600 text-sm mt-1">{rfp.summary.one_liner}</p>
                </div>
                <RecommendationBadge rec={rfp.recommendation} score={rfp.match_score} />
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{rfp.agency}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">
                    {rfp.estimated_value
                      ? `$${(rfp.estimated_value.min / 1000000).toFixed(0)}M - $${(rfp.estimated_value.max / 1000000).toFixed(0)}M`
                      : 'TBD'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{rfp.summary.timeline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{rfp.set_aside || 'Full & Open'}</span>
                </div>
              </div>

              {/* Workflow Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Workflow Progress</span>
                  <span className="text-xs font-medium text-slate-700">Step {rfp.workflow_step} of {WORKFLOW_STEPS.length}</span>
                </div>
                <div className="flex gap-1">
                  {WORKFLOW_STEPS.map((step, idx) => (
                    <div
                      key={step}
                      className={`flex-1 h-2 rounded-full ${
                        idx < rfp.workflow_step ? 'bg-green-500' :
                        idx === rfp.workflow_step ? 'bg-orange-500' : 'bg-slate-200'
                      }`}
                      title={step}
                    />
                  ))}
                </div>
              </div>

              {/* Action Items */}
              {rfp.action_items.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">Next Actions</span>
                    <span className="text-xs text-green-600">
                      {rfp.action_items.filter(a => a.calendar_synced).length} synced to calendar
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rfp.action_items.slice(0, 4).map(action => (
                      <div
                        key={action.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                          action.status === 'completed' ? 'bg-green-50 text-green-700' :
                          action.status === 'in_progress' ? 'bg-orange-50 text-orange-700' :
                          'bg-slate-50 text-slate-700'
                        }`}
                      >
                        {action.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {action.title}
                        <PriorityBadge priority={action.priority} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {pipelineRFPs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No active RFPs in pipeline</p>
              <p className="text-sm text-slate-400">Discovered RFPs will appear here once you decide to pursue them</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'discovered' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRFPs.filter(r => r.status === 'discovered').map(rfp => (
            <div
              key={rfp.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                setSelectedRFP(rfp);
                setDetailOpen(true);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-slate-500 font-mono">{rfp.notice_id}</span>
                <RecommendationBadge rec={rfp.recommendation} score={rfp.match_score} />
              </div>

              <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{rfp.title}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{rfp.summary.what_they_need}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building className="w-4 h-4 text-slate-400" />
                  {rfp.agency}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  {rfp.estimated_value
                    ? `$${(rfp.estimated_value.min / 1000000).toFixed(0)}M - $${(rfp.estimated_value.max / 1000000).toFixed(0)}M`
                    : 'TBD'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {rfp.summary.timeline}
                </div>
              </div>

              {rfp.strengths.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {rfp.strengths.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm">
                  <ThumbsUp className="w-4 h-4" />
                  Pursue
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm">
                  <ThumbsDown className="w-4 h-4" />
                  No Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Automation Settings */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Automation Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Auto-Discovery</h4>
                  <p className="text-sm text-slate-500">Scan SAM.gov for matching opportunities</p>
                </div>
                <select className="px-3 py-2 border border-slate-200 rounded-lg">
                  <option>Every 6 hours</option>
                  <option>Every 12 hours</option>
                  <option>Daily</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Match Threshold</h4>
                  <p className="text-sm text-slate-500">Minimum match score to notify</p>
                </div>
                <select className="px-3 py-2 border border-slate-200 rounded-lg">
                  <option>60% and above</option>
                  <option>70% and above</option>
                  <option>80% and above</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Auto-Response Types</h4>
                  <p className="text-sm text-slate-500">Automatically respond to these</p>
                </div>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    <input type="checkbox" defaultChecked className="w-3 h-3" />
                    RFI
                  </label>
                  <label className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    <input type="checkbox" defaultChecked className="w-3 h-3" />
                    Sources Sought
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Calendar Sync</h4>
                  <p className="text-sm text-slate-500">Auto-add deadlines & meetings</p>
                </div>
                <select className="px-3 py-2 border border-slate-200 rounded-lg">
                  <option>All action items</option>
                  <option>Critical & High only</option>
                  <option>Deadlines only</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Human Review Notifications</h4>
                  <p className="text-sm text-slate-500">Ping when ready for review</p>
                </div>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    <input type="checkbox" defaultChecked className="w-3 h-3" />
                    Email
                  </label>
                  <label className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    <input type="checkbox" defaultChecked className="w-3 h-3" />
                    Slack
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Auto-Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Auto-Actions</h3>

            <div className="space-y-3">
              {[
                { action: 'Discovered new RFP', rfp: 'Cloud Migration Services', time: '2 hours ago', type: 'discovery' },
                { action: 'Auto-responded to Sources Sought', rfp: 'IT Modernization', time: '5 hours ago', type: 'response' },
                { action: 'Created calendar events', rfp: 'Cybersecurity SOC', time: '1 day ago', type: 'calendar' },
                { action: 'Sent review notification', rfp: 'Data Analytics', time: '1 day ago', type: 'notification' },
                { action: 'Generated proposal draft', rfp: 'Enterprise Cloud', time: '2 days ago', type: 'proposal' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.type === 'discovery' ? 'bg-blue-100' :
                    item.type === 'response' ? 'bg-purple-100' :
                    item.type === 'calendar' ? 'bg-green-100' :
                    item.type === 'notification' ? 'bg-orange-100' : 'bg-slate-100'
                  }`}>
                    {item.type === 'discovery' ? <FileSearch className="w-4 h-4 text-blue-600" /> :
                     item.type === 'response' ? <Send className="w-4 h-4 text-purple-600" /> :
                     item.type === 'calendar' ? <Calendar className="w-4 h-4 text-green-600" /> :
                     item.type === 'notification' ? <Bell className="w-4 h-4 text-orange-600" /> :
                     <FileText className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 text-sm">{item.action}</div>
                    <div className="text-xs text-slate-500">{item.rfp}</div>
                  </div>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Win Rate Trend */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Win Rate Trend</h3>
            <div className="h-48 flex items-end gap-2">
              {[45, 52, 58, 55, 62, 65].map((rate, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t ${idx === 5 ? 'bg-orange-500' : 'bg-slate-200'}`}
                    style={{ height: `${rate * 2}px` }}
                  />
                  <span className="text-xs text-slate-500">
                    {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline by Stage */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Pipeline by Stage</h3>
            <div className="space-y-3">
              {[
                { stage: 'Discovery', count: 8, value: 120 },
                { stage: 'Analysis', count: 4, value: 65 },
                { stage: 'Pursuing', count: 3, value: 45 },
                { stage: 'Submitted', count: 2, value: 28 },
                { stage: 'Awaiting Award', count: 1, value: 15 }
              ].map(item => (
                <div key={item.stage} className="flex items-center gap-4">
                  <span className="w-32 text-sm text-slate-600">{item.stage}</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${(item.value / 120) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-16 text-right">${item.value}M</span>
                </div>
              ))}
            </div>
          </div>

          {/* Match Score Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Match Score Distribution</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-xs text-green-600">Strong Go (85%+)</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-xs text-blue-600">Go (70-84%)</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">6</div>
                <div className="text-xs text-yellow-600">Maybe (55-69%)</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">4</div>
                <div className="text-xs text-red-600">No Go (&lt;55%)</div>
              </div>
            </div>
          </div>

          {/* Time Savings */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Automation Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">156</div>
                <div className="text-sm text-purple-600">Hours Saved</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">12</div>
                <div className="text-sm text-green-600">Auto-Responses</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">48</div>
                <div className="text-sm text-blue-600">Calendar Events</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">24</div>
                <div className="text-sm text-orange-600">RFPs Analyzed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RFP Detail Modal */}
      {detailOpen && selectedRFP && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={selectedRFP.status} />
                    <span className="text-sm text-slate-500 font-mono">{selectedRFP.notice_id}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">{selectedRFP.title}</h2>
                  <p className="text-slate-600 mt-1">{selectedRFP.agency}</p>
                </div>
                <div className="flex items-center gap-3">
                  <RecommendationBadge rec={selectedRFP.recommendation} score={selectedRFP.match_score} />
                  <button
                    onClick={() => setDetailOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Simplified Summary */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  AI-Simplified Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">What They Need</div>
                    <p className="text-slate-700">{selectedRFP.summary.what_they_need}</p>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Who Can Bid</div>
                    <p className="text-slate-700">{selectedRFP.summary.who_can_bid}</p>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Timeline</div>
                    <p className="text-slate-700 font-medium">{selectedRFP.summary.timeline}</p>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Estimated Value</div>
                    <p className="text-slate-700 font-medium">
                      {selectedRFP.estimated_value
                        ? `$${selectedRFP.estimated_value.min.toLocaleString()} - $${selectedRFP.estimated_value.max.toLocaleString()}`
                        : 'TBD'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Match Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" /> Strengths
                  </h4>
                  <ul className="space-y-1">
                    {selectedRFP.strengths.map((s, idx) => (
                      <li key={idx} className="text-sm text-green-600 flex items-start gap-1">
                        <span>+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-medium text-yellow-700 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {selectedRFP.weaknesses.map((w, idx) => (
                      <li key={idx} className="text-sm text-yellow-600 flex items-start gap-1">
                        <span>-</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <h4 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Gaps
                  </h4>
                  <ul className="space-y-1">
                    {selectedRFP.gaps.length > 0 ? selectedRFP.gaps.map((g, idx) => (
                      <li key={idx} className="text-sm text-red-600 flex items-start gap-1">
                        <span>!</span> {g}
                      </li>
                    )) : (
                      <li className="text-sm text-green-600">No critical gaps identified</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Key Requirements</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-xs text-slate-500 mb-2">Technical</h4>
                    <ul className="space-y-1">
                      {selectedRFP.requirements.technical.map((r, idx) => (
                        <li key={idx} className="text-sm text-slate-700">{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 mb-2">Personnel</h4>
                    <ul className="space-y-1">
                      {selectedRFP.requirements.personnel.map((r, idx) => (
                        <li key={idx} className="text-sm text-slate-700">{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 mb-2">Certifications</h4>
                    <ul className="space-y-1">
                      {selectedRFP.requirements.certifications.map((r, idx) => (
                        <li key={idx} className="text-sm text-slate-700">{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs text-slate-500 mb-2">Clearances</h4>
                    <ul className="space-y-1">
                      {selectedRFP.requirements.clearances.map((r, idx) => (
                        <li key={idx} className="text-sm text-slate-700">{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              {selectedRFP.action_items.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Action Items</h3>
                    <button className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Sync All to Calendar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedRFP.action_items.map(action => (
                      <div
                        key={action.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          action.status === 'completed' ? 'bg-green-50' :
                          action.status === 'in_progress' ? 'bg-orange-50' : 'bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {action.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : action.status === 'in_progress' ? (
                            <Clock className="w-5 h-5 text-orange-500" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                          )}
                          <div>
                            <div className="font-medium text-slate-900">{action.title}</div>
                            <div className="text-sm text-slate-500">Due: {action.due_date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <PriorityBadge priority={action.priority} />
                          {action.calendar_synced && (
                            <span className="text-green-600">
                              <Calendar className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                  <FileText className="w-4 h-4" />
                  Generate Proposal Draft
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                  <Calendar className="w-4 h-4" />
                  Add to Calendar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                  <Send className="w-4 h-4" />
                  Submit Questions
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                  <ExternalLink className="w-4 h-4" />
                  View on SAM.gov
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFPIntelligence;
