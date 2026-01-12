/**
 * Onboarding Wizard Configuration
 * Super Admin interface for configuring and managing the new user onboarding experience
 */

import React, { useState } from 'react';
import {
  Rocket,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Edit3,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Copy,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  Link2,
  Image,
  Mail,
  Users,
  Target,
  Settings,
  Calendar,
  Database,
  Bot,
  Phone,
  Star,
  MessageSquare,
  Briefcase,
  BarChart3,
  Zap,
  ArrowRight,
  Play,
  Award,
  Flag,
  Lightbulb,
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

// Types
type StepType = 'welcome' | 'profile' | 'integration' | 'feature_tour' | 'video' | 'checklist' | 'complete';
type ContentType = 'text' | 'video' | 'image' | 'interactive' | 'checklist';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  type: StepType;
  contentType: ContentType;
  content: {
    heading?: string;
    description?: string;
    videoUrl?: string;
    imageUrl?: string;
    cta?: string;
    ctaAction?: string;
    tips?: string[];
    checklist?: { id: string; label: string; required: boolean }[];
  };
  icon: React.ComponentType<any>;
  duration: number; // estimated minutes
  required: boolean;
  enabled: boolean;
  order: number;
  conditions?: {
    plan?: string[];
    role?: string[];
  };
}

interface OnboardingFlow {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  steps: OnboardingStep[];
  enabled: boolean;
  completionReward?: string;
  createdAt: string;
  updatedAt: string;
}

interface OnboardingStats {
  totalStarted: number;
  totalCompleted: number;
  completionRate: number;
  avgCompletionTime: number;
  dropoffByStep: { step: string; dropoff: number }[];
  completionByPlan: Record<string, number>;
}

// Default onboarding steps
const DEFAULT_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to OrenGen',
    subtitle: 'Your business operating system',
    type: 'welcome',
    contentType: 'text',
    content: {
      heading: 'Welcome aboard!',
      description: 'OrenGen is the most comprehensive all-in-one business operating system. Let\'s get you set up for success.',
      cta: 'Get Started',
      ctaAction: 'next'
    },
    icon: Rocket,
    duration: 1,
    required: true,
    enabled: true,
    order: 1
  },
  {
    id: 'profile',
    title: 'Complete Your Profile',
    subtitle: 'Tell us about your business',
    type: 'profile',
    contentType: 'interactive',
    content: {
      heading: 'Let\'s personalize your experience',
      description: 'Help us understand your business so we can customize OrenGen for you.',
      checklist: [
        { id: 'name', label: 'Your full name', required: true },
        { id: 'company', label: 'Company name', required: true },
        { id: 'industry', label: 'Industry', required: true },
        { id: 'size', label: 'Team size', required: false },
        { id: 'goals', label: 'Primary goals', required: false }
      ]
    },
    icon: Users,
    duration: 3,
    required: true,
    enabled: true,
    order: 2
  },
  {
    id: 'crm_tour',
    title: 'CRM Database',
    subtitle: 'Manage contacts, companies & deals',
    type: 'feature_tour',
    contentType: 'video',
    content: {
      heading: 'Your Customer Command Center',
      description: 'Store and manage all your contacts, companies, and deals in one place.',
      videoUrl: 'https://example.com/crm-tour.mp4',
      tips: [
        'Import contacts from CSV or sync from Google',
        'Create custom fields for any data you need',
        'Track deals through your sales pipeline'
      ],
      cta: 'Explore CRM',
      ctaAction: '/crm'
    },
    icon: Database,
    duration: 5,
    required: false,
    enabled: true,
    order: 3
  },
  {
    id: 'leadgen_tour',
    title: 'Lead Generation',
    subtitle: 'Discover and qualify leads',
    type: 'feature_tour',
    contentType: 'video',
    content: {
      heading: 'Find Your Next Customers',
      description: 'Automatically discover, enrich, and score leads from any domain.',
      videoUrl: 'https://example.com/leadgen-tour.mp4',
      tips: [
        'Add domains and we\'ll find contact info',
        'AI-powered lead scoring from 0-100',
        'Bulk import with automatic enrichment'
      ],
      cta: 'Try Lead Gen',
      ctaAction: '/leadgen-studio'
    },
    icon: Target,
    duration: 5,
    required: false,
    enabled: true,
    order: 4
  },
  {
    id: 'calendar_setup',
    title: 'Calendar Integration',
    subtitle: 'Connect your calendars',
    type: 'integration',
    contentType: 'interactive',
    content: {
      heading: 'Sync Your Calendars',
      description: 'Connect Google, Outlook, or iCloud to see all your appointments in one place.',
      checklist: [
        { id: 'google', label: 'Connect Google Calendar', required: false },
        { id: 'outlook', label: 'Connect Outlook', required: false },
        { id: 'icloud', label: 'Connect iCloud', required: false }
      ],
      cta: 'Connect Calendars',
      ctaAction: '/calendar-studio'
    },
    icon: Calendar,
    duration: 3,
    required: false,
    enabled: true,
    order: 5
  },
  {
    id: 'reputation_tour',
    title: 'Reputation Manager',
    subtitle: 'Monitor and respond to reviews',
    type: 'feature_tour',
    contentType: 'video',
    content: {
      heading: 'Protect Your Online Reputation',
      description: 'Monitor reviews across Google, Yelp, and more. Generate AI-powered responses.',
      videoUrl: 'https://example.com/reputation-tour.mp4',
      tips: [
        'Get alerts for new reviews instantly',
        'AI generates professional responses',
        'Request reviews via email or SMS'
      ],
      cta: 'Manage Reputation',
      ctaAction: '/reputation'
    },
    icon: Star,
    duration: 4,
    required: false,
    enabled: true,
    order: 6,
    conditions: { plan: ['professional', 'enterprise', 'agency'] }
  },
  {
    id: 'ai_agents_tour',
    title: 'AI Agent Studio',
    subtitle: '8 AI agents at your service',
    type: 'feature_tour',
    contentType: 'video',
    content: {
      heading: 'Meet Your AI Team',
      description: '8 specialized AI agents ready to help with brand, content, campaigns, and more.',
      videoUrl: 'https://example.com/ai-agents-tour.mp4',
      tips: [
        'Brand Guardian ensures consistent messaging',
        'Campaign Orchestrator automates marketing',
        'Proposal Writer creates winning bids'
      ],
      cta: 'Meet the Agents',
      ctaAction: '/agent-studio'
    },
    icon: Bot,
    duration: 5,
    required: false,
    enabled: true,
    order: 7,
    conditions: { plan: ['enterprise', 'agency'] }
  },
  {
    id: 'sim_integration',
    title: 'SIM Integration',
    subtitle: 'Route your personal number through CRM',
    type: 'feature_tour',
    contentType: 'video',
    content: {
      heading: 'Keep Business & Personal Separate',
      description: 'Route your personal cell number through the CRM. Track, record, and manage all calls.',
      videoUrl: 'https://example.com/sim-tour.mp4',
      tips: [
        'Works with Verizon, AT&T, T-Mobile, Sprint',
        'Calls don\'t show on your personal device',
        'AI can answer after hours'
      ],
      cta: 'Set Up SIM',
      ctaAction: '/sim-integration'
    },
    icon: Phone,
    duration: 5,
    required: false,
    enabled: true,
    order: 8,
    conditions: { plan: ['enterprise', 'agency'] }
  },
  {
    id: 'freelance_tour',
    title: 'Freelance Hub',
    subtitle: 'Manage all your freelance accounts',
    type: 'feature_tour',
    contentType: 'video',
    content: {
      heading: 'Freelance from One Dashboard',
      description: 'Connect Upwork, Fiverr, and more. AI writes proposals and tracks earnings.',
      videoUrl: 'https://example.com/freelance-tour.mp4',
      tips: [
        'One dashboard for all platforms',
        'AI proposal generator in 5 tones',
        'Create service packages easily'
      ],
      cta: 'Explore Freelance Hub',
      ctaAction: '/freelance-hub'
    },
    icon: Briefcase,
    duration: 4,
    required: false,
    enabled: true,
    order: 9,
    conditions: { plan: ['professional', 'enterprise', 'agency'] }
  },
  {
    id: 'first_task',
    title: 'Your First Task',
    subtitle: 'Let\'s do something together',
    type: 'checklist',
    contentType: 'checklist',
    content: {
      heading: 'Complete Your First Actions',
      description: 'Try these quick wins to get familiar with OrenGen.',
      checklist: [
        { id: 'add_contact', label: 'Add your first contact', required: true },
        { id: 'add_deal', label: 'Create a deal', required: false },
        { id: 'send_email', label: 'Send a test email', required: false },
        { id: 'explore_wiki', label: 'Browse the Knowledge Wiki', required: false }
      ]
    },
    icon: Flag,
    duration: 10,
    required: true,
    enabled: true,
    order: 10
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    subtitle: 'Ready to crush your goals',
    type: 'complete',
    contentType: 'text',
    content: {
      heading: 'Congratulations!',
      description: 'You\'ve completed onboarding. You\'re now ready to take your business to the next level with OrenGen.',
      cta: 'Go to Dashboard',
      ctaAction: '/dashboard',
      tips: [
        'Check out the Knowledge Wiki for tutorials',
        'Join our community on Discord',
        'Contact support anytime you need help'
      ]
    },
    icon: Award,
    duration: 1,
    required: true,
    enabled: true,
    order: 11
  }
];

// Mock stats
const MOCK_STATS: OnboardingStats = {
  totalStarted: 1250,
  totalCompleted: 875,
  completionRate: 70,
  avgCompletionTime: 18,
  dropoffByStep: [
    { step: 'Welcome', dropoff: 5 },
    { step: 'Profile', dropoff: 12 },
    { step: 'CRM Tour', dropoff: 8 },
    { step: 'Lead Gen', dropoff: 15 },
    { step: 'Calendar', dropoff: 10 },
    { step: 'First Task', dropoff: 20 }
  ],
  completionByPlan: {
    starter: 65,
    professional: 72,
    enterprise: 78,
    agency: 85
  }
};

// Main Component
const OnboardingWizard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'analytics'>('builder');
  const [steps, setSteps] = useState<OnboardingStep[]>(DEFAULT_STEPS);
  const [selectedStep, setSelectedStep] = useState<OnboardingStep | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewStep, setPreviewStep] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  // Toggle step enabled
  const toggleStep = (stepId: string) => {
    setSteps(prev => prev.map(s =>
      s.id === stepId ? { ...s, enabled: !s.enabled } : s
    ));
    setHasChanges(true);
  };

  // Save changes
  const saveChanges = () => {
    setHasChanges(false);
    alert('Onboarding flow saved successfully!');
  };

  // Get enabled steps for preview
  const enabledSteps = steps.filter(s => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Onboarding Setup</h1>
          <p className="text-slate-600">Configure the new user onboarding experience</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <button
              onClick={saveChanges}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Started Onboarding</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{MOCK_STATS.totalStarted.toLocaleString()}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Completed</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-3xl font-bold text-green-600">{MOCK_STATS.totalCompleted.toLocaleString()}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Completion Rate</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{MOCK_STATS.completionRate}%</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Avg. Time</span>
            <Zap className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{MOCK_STATS.avgCompletionTime} min</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'builder', label: 'Flow Builder', icon: Edit3 },
            { id: 'preview', label: 'Preview', icon: Eye },
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
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps List */}
          <div className="lg:col-span-2 space-y-3">
            {steps.sort((a, b) => a.order - b.order).map((step, index) => (
              <div
                key={step.id}
                className={`bg-white rounded-xl border p-4 ${
                  step.enabled ? 'border-slate-200' : 'border-slate-100 opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                      {index + 1}
                    </span>
                  </div>

                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    step.enabled ? 'bg-orange-100' : 'bg-slate-100'
                  }`}>
                    <step.icon className={`w-5 h-5 ${step.enabled ? 'text-orange-600' : 'text-slate-400'}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{step.title}</h3>
                      {step.required && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs">Required</span>
                      )}
                      {step.conditions?.plan && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          {step.conditions.plan.join(', ')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{step.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{step.duration} min</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      step.contentType === 'video' ? 'bg-blue-100 text-blue-700' :
                      step.contentType === 'interactive' ? 'bg-green-100 text-green-700' :
                      step.contentType === 'checklist' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {step.contentType}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedStep(step);
                        setEditModalOpen(true);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => toggleStep(step.id)}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        step.enabled ? 'bg-green-500' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                          step.enabled ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:text-orange-500 hover:border-orange-300 transition flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Add Custom Step
            </button>
          </div>

          {/* Settings Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Flow Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Flow Name</label>
                  <input
                    type="text"
                    defaultValue="Default Onboarding"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>All New Users</option>
                    <option>Starter Plan Users</option>
                    <option>Professional Plan Users</option>
                    <option>Enterprise Plan Users</option>
                    <option>Agency Plan Users</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-slate-100">
                  <span className="text-sm text-slate-700">Allow Skip</span>
                  <button className="w-10 h-6 rounded-full relative bg-green-500 transition-colors">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-slate-100">
                  <span className="text-sm text-slate-700">Show Progress Bar</span>
                  <button className="w-10 h-6 rounded-full relative bg-green-500 transition-colors">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-slate-100">
                  <span className="text-sm text-slate-700">Completion Reward</span>
                  <button className="w-10 h-6 rounded-full relative bg-slate-200 transition-colors">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Steps</span>
                  <span className="font-medium text-slate-900">{steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Steps</span>
                  <span className="font-medium text-green-600">{steps.filter(s => s.enabled).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Required Steps</span>
                  <span className="font-medium text-slate-900">{steps.filter(s => s.required && s.enabled).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Duration</span>
                  <span className="font-medium text-slate-900">
                    {steps.filter(s => s.enabled).reduce((sum, s) => sum + s.duration, 0)} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="max-w-2xl mx-auto">
          {/* Preview Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-slate-100">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${((previewStep + 1) / enabledSteps.length) * 100}%` }}
              />
            </div>

            {/* Step Content */}
            {enabledSteps[previewStep] && (
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                    {React.createElement(enabledSteps[previewStep].icon, {
                      className: 'w-8 h-8 text-orange-600'
                    })}
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {enabledSteps[previewStep].content.heading || enabledSteps[previewStep].title}
                  </h2>
                  <p className="text-slate-600">
                    {enabledSteps[previewStep].content.description || enabledSteps[previewStep].subtitle}
                  </p>
                </div>

                {/* Video placeholder */}
                {enabledSteps[previewStep].contentType === 'video' && (
                  <div className="aspect-video bg-slate-100 rounded-xl mb-6 flex items-center justify-center">
                    <button className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white">
                      <Play className="w-6 h-6 ml-1" />
                    </button>
                  </div>
                )}

                {/* Checklist */}
                {enabledSteps[previewStep].content.checklist && (
                  <div className="space-y-3 mb-6">
                    {enabledSteps[previewStep].content.checklist?.map(item => (
                      <label key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-slate-700">{item.label}</span>
                        {item.required && <span className="text-xs text-red-500">*</span>}
                      </label>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {enabledSteps[previewStep].content.tips && (
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-700 text-sm">Pro Tips</span>
                    </div>
                    <ul className="space-y-1">
                      {enabledSteps[previewStep].content.tips?.map((tip, idx) => (
                        <li key={idx} className="text-sm text-blue-600 flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setPreviewStep(Math.max(0, previewStep - 1))}
                    disabled={previewStep === 0}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <span className="text-sm text-slate-500">
                    {previewStep + 1} of {enabledSteps.length}
                  </span>

                  <button
                    onClick={() => setPreviewStep(Math.min(enabledSteps.length - 1, previewStep + 1))}
                    disabled={previewStep === enabledSteps.length - 1}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {enabledSteps[previewStep].content.cta || 'Next'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {enabledSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setPreviewStep(idx)}
                className={`w-2 h-2 rounded-full transition ${
                  idx === previewStep ? 'bg-orange-500 w-8' :
                  idx < previewStep ? 'bg-green-500' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Rate by Plan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Completion Rate by Plan</h3>
            <div className="space-y-4">
              {Object.entries(MOCK_STATS.completionByPlan).map(([plan, rate]) => (
                <div key={plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 capitalize">{plan}</span>
                    <span className="text-sm font-medium text-slate-900">{rate}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop-off by Step */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Drop-off by Step</h3>
            <div className="space-y-4">
              {MOCK_STATS.dropoffByStep.map(item => (
                <div key={item.step}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">{item.step}</span>
                    <span className={`text-sm font-medium ${item.dropoff > 15 ? 'text-red-600' : 'text-slate-900'}`}>
                      {item.dropoff}% dropoff
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.dropoff > 15 ? 'bg-red-500' : 'bg-slate-400'}`}
                      style={{ width: `${item.dropoff}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Onboarding Funnel</h3>
            <div className="flex items-center justify-center gap-4">
              {[
                { label: 'Started', value: 1250, color: 'bg-orange-500' },
                { label: 'Profile', value: 1100, color: 'bg-orange-400' },
                { label: 'Features', value: 950, color: 'bg-orange-400' },
                { label: 'Setup', value: 900, color: 'bg-orange-400' },
                { label: 'First Task', value: 875, color: 'bg-green-500' }
              ].map((stage, idx) => (
                <React.Fragment key={stage.label}>
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 rounded-xl ${stage.color} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {stage.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">{stage.label}</div>
                  </div>
                  {idx < 4 && <ArrowRight className="w-6 h-6 text-slate-300" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Step Modal */}
      {editModalOpen && selectedStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Edit Step</h2>
                <button
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedStep(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  defaultValue={selectedStep.title}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  defaultValue={selectedStep.subtitle}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  defaultValue={selectedStep.content.description}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content Type</label>
                <select
                  defaultValue={selectedStep.contentType}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="interactive">Interactive</option>
                  <option value="checklist">Checklist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  defaultValue={selectedStep.duration}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  defaultChecked={selectedStep.required}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="required" className="text-sm text-slate-700">Required step</label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedStep(null);
                }}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedStep(null);
                  setHasChanges(true);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingWizard;
