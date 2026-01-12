/**
 * Feature Management / Package Configuration
 * Super Admin interface for managing feature flags, plan features, and add-ons
 */

import React, { useState } from 'react';
import {
  Package,
  Settings,
  ToggleLeft,
  ToggleRight,
  Plus,
  X,
  Edit3,
  Trash2,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Save,
  Zap,
  Star,
  Crown,
  Building,
  Users,
  Database,
  Phone,
  Bot,
  Globe,
  BarChart3,
  MessageSquare,
  Mail,
  Calendar,
  Shield,
  FileText,
  Code,
  Layers,
  Target,
  Briefcase,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Info,
  Copy,
  ExternalLink
} from 'lucide-react';

// Types
type PlanTier = 'starter' | 'professional' | 'enterprise' | 'agency';
type FeatureCategory = 'core' | 'crm' | 'marketing' | 'communication' | 'ai' | 'integrations' | 'federal' | 'admin';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  icon: React.ComponentType<any>;
  availableIn: PlanTier[];
  limitByPlan?: Record<PlanTier, number | string>;
  enabled: boolean;
  beta?: boolean;
  new?: boolean;
  comingSoon?: boolean;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  pricePer: 'month' | 'unit' | 'one-time';
  unit?: string;
  icon: React.ComponentType<any>;
  availableIn: PlanTier[];
  enabled: boolean;
}

// Feature configurations
const FEATURES: Feature[] = [
  // Core
  { id: 'dashboard', name: 'Control Room Dashboard', description: 'Central dashboard with system metrics', category: 'core', icon: BarChart3, availableIn: ['starter', 'professional', 'enterprise', 'agency'], enabled: true },
  { id: 'projects', name: 'Project Management', description: 'Create and manage projects', category: 'core', icon: Layers, availableIn: ['starter', 'professional', 'enterprise', 'agency'], enabled: true },
  { id: 'wiki', name: 'Knowledge Wiki', description: 'Internal documentation system', category: 'core', icon: FileText, availableIn: ['starter', 'professional', 'enterprise', 'agency'], enabled: true },

  // CRM
  { id: 'contacts', name: 'Contact Management', description: 'Store and manage contacts', category: 'crm', icon: Users, availableIn: ['starter', 'professional', 'enterprise', 'agency'], limitByPlan: { starter: '2,500', professional: '25,000', enterprise: 'Unlimited', agency: 'Unlimited' }, enabled: true },
  { id: 'companies', name: 'Company Management', description: 'Track organizations', category: 'crm', icon: Building, availableIn: ['starter', 'professional', 'enterprise', 'agency'], enabled: true },
  { id: 'deals', name: 'Deal Pipeline', description: 'Sales pipeline management', category: 'crm', icon: Target, availableIn: ['starter', 'professional', 'enterprise', 'agency'], limitByPlan: { starter: '1', professional: '5', enterprise: 'Unlimited', agency: 'Unlimited' }, enabled: true },
  { id: 'leadgen', name: 'Lead Generation', description: 'Domain discovery and enrichment', category: 'crm', icon: Target, availableIn: ['starter', 'professional', 'enterprise', 'agency'], limitByPlan: { starter: '100/mo', professional: '500/mo', enterprise: 'Unlimited', agency: 'Unlimited' }, enabled: true },

  // Marketing
  { id: 'email_campaigns', name: 'Email Campaigns', description: 'Create and send email sequences', category: 'marketing', icon: Mail, availableIn: ['starter', 'professional', 'enterprise', 'agency'], enabled: true },
  { id: 'sms_campaigns', name: 'SMS Campaigns', description: 'Bulk SMS marketing', category: 'marketing', icon: MessageSquare, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'reputation', name: 'Reputation Manager', description: 'Review monitoring and responses', category: 'marketing', icon: Star, availableIn: ['professional', 'enterprise', 'agency'], limitByPlan: { professional: '3 locations', enterprise: 'Unlimited', agency: 'Unlimited' }, enabled: true },
  { id: 'social_commenting', name: 'Smart Social Commenting', description: 'AI-powered social engagement', category: 'marketing', icon: MessageSquare, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'ugc', name: 'UGC / Creator Studio', description: 'User-generated content management', category: 'marketing', icon: Users, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },

  // Communication
  { id: 'calendar', name: 'Universal Calendar', description: 'Multi-provider calendar sync', category: 'communication', icon: Calendar, availableIn: ['starter', 'professional', 'enterprise', 'agency'], limitByPlan: { starter: '1 provider', professional: 'All', enterprise: 'All', agency: 'All' }, enabled: true },
  { id: 'sim_integration', name: 'SIM & Number Integration', description: 'Route personal numbers through CRM', category: 'communication', icon: Phone, availableIn: ['enterprise', 'agency'], limitByPlan: { enterprise: '3 numbers', agency: 'Unlimited' }, enabled: true, new: true },
  { id: 'voip', name: 'VoIP Numbers', description: 'Virtual phone numbers', category: 'communication', icon: Phone, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'call_recording', name: 'Call Recording', description: 'Record and transcribe calls', category: 'communication', icon: Phone, availableIn: ['enterprise', 'agency'], enabled: true },

  // AI
  { id: 'ai_agents', name: 'AI Agent Studio', description: '8 specialized AI agents', category: 'ai', icon: Bot, availableIn: ['enterprise', 'agency'], limitByPlan: { enterprise: '8 agents', agency: '8 agents' }, enabled: true },
  { id: 'ai_proposals', name: 'AI Proposal Writer', description: 'Generate proposals with AI', category: 'ai', icon: FileText, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'ai_responses', name: 'AI Response Generator', description: 'Generate review responses', category: 'ai', icon: MessageSquare, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },

  // Integrations
  { id: 'freelance_hub', name: 'Freelance Hub', description: 'Upwork, Fiverr, etc. integration', category: 'integrations', icon: Briefcase, availableIn: ['professional', 'enterprise', 'agency'], limitByPlan: { professional: '3 platforms', enterprise: 'All', agency: 'All' }, enabled: true, new: true },
  { id: 'webhooks', name: 'Webhooks', description: 'Custom webhook integrations', category: 'integrations', icon: Code, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'api_access', name: 'API Access', description: 'Full REST API access', category: 'integrations', icon: Code, availableIn: ['enterprise', 'agency'], enabled: true },
  { id: 'zapier', name: 'Zapier Integration', description: 'Connect with 5000+ apps', category: 'integrations', icon: Zap, availableIn: ['professional', 'enterprise', 'agency'], enabled: true, comingSoon: true },

  // Federal
  { id: 'federal_opportunities', name: 'Opportunity Studio', description: 'SAM.gov integration', category: 'federal', icon: Globe, availableIn: ['enterprise', 'agency'], enabled: true },
  { id: 'federal_rfp', name: 'RFP Intelligence', description: 'RFP parsing and analysis', category: 'federal', icon: FileText, availableIn: ['enterprise', 'agency'], enabled: true },
  { id: 'federal_proposals', name: 'Proposal Studio', description: 'Government proposal builder', category: 'federal', icon: FileText, availableIn: ['enterprise', 'agency'], enabled: true },
  { id: 'federal_compliance', name: 'Compliance Manager', description: 'FAR/DFAR compliance', category: 'federal', icon: Shield, availableIn: ['enterprise', 'agency'], enabled: true },

  // Admin
  { id: 'white_label', name: 'White-Label Branding', description: 'Custom branding and logos', category: 'admin', icon: Settings, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'multi_tenant', name: 'Multi-tenant', description: 'Sub-accounts for clients', category: 'admin', icon: Building, availableIn: ['agency'], enabled: true },
  { id: 'team_management', name: 'Team Management', description: 'User roles and permissions', category: 'admin', icon: Users, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'audit_log', name: 'Audit Log', description: 'Activity tracking', category: 'admin', icon: FileText, availableIn: ['enterprise', 'agency'], enabled: true }
];

const ADD_ONS: AddOn[] = [
  { id: 'extra_sim', name: 'Extra SIM Numbers', description: 'Additional personal number routing', price: 29, pricePer: 'month', unit: 'number', icon: Phone, availableIn: ['enterprise', 'agency'], enabled: true },
  { id: 'ai_credits', name: 'AI Agent Credits', description: '10,000 additional AI interactions', price: 99, pricePer: 'month', icon: Bot, availableIn: ['enterprise', 'agency'], enabled: true },
  { id: 'extra_users', name: 'Extra Users', description: 'Additional team members', price: 29, pricePer: 'month', unit: 'user', icon: Users, availableIn: ['starter', 'professional', 'enterprise'], enabled: true },
  { id: 'sms_credits', name: 'SMS Credits', description: 'SMS messages', price: 0.02, pricePer: 'unit', unit: 'message', icon: MessageSquare, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'api_addon', name: 'API Access', description: 'Full API for Starter/Pro plans', price: 99, pricePer: 'month', icon: Code, availableIn: ['starter', 'professional'], enabled: true },
  { id: 'dedicated_ip', name: 'Dedicated IP', description: 'For email deliverability', price: 49, pricePer: 'month', icon: Globe, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'custom_integration', name: 'Custom Integration', description: 'Connect any platform', price: 499, pricePer: 'one-time', icon: Code, availableIn: ['professional', 'enterprise', 'agency'], enabled: true },
  { id: 'priority_support', name: 'Priority Support', description: 'Phone + chat support', price: 99, pricePer: 'month', icon: MessageSquare, availableIn: ['starter', 'professional'], enabled: true }
];

const CATEGORY_CONFIG: Record<FeatureCategory, { label: string; icon: React.ComponentType<any>; color: string }> = {
  core: { label: 'Core Platform', icon: Layers, color: 'bg-slate-100 text-slate-700' },
  crm: { label: 'CRM & Sales', icon: Users, color: 'bg-blue-100 text-blue-700' },
  marketing: { label: 'Marketing', icon: Mail, color: 'bg-purple-100 text-purple-700' },
  communication: { label: 'Communication', icon: Phone, color: 'bg-green-100 text-green-700' },
  ai: { label: 'AI & Automation', icon: Bot, color: 'bg-orange-100 text-orange-700' },
  integrations: { label: 'Integrations', icon: Code, color: 'bg-cyan-100 text-cyan-700' },
  federal: { label: 'Federal', icon: Shield, color: 'bg-red-100 text-red-700' },
  admin: { label: 'Admin & Settings', icon: Settings, color: 'bg-yellow-100 text-yellow-700' }
};

const PLAN_CONFIG: Record<PlanTier, { label: string; icon: React.ComponentType<any>; color: string }> = {
  starter: { label: 'Starter', icon: Zap, color: 'bg-slate-100 text-slate-700' },
  professional: { label: 'Professional', icon: Star, color: 'bg-blue-100 text-blue-700' },
  enterprise: { label: 'Enterprise', icon: Crown, color: 'bg-purple-100 text-purple-700' },
  agency: { label: 'Agency', icon: Building, color: 'bg-orange-100 text-orange-700' }
};

// Main Component
const FeatureManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'features' | 'addons' | 'matrix'>('features');
  const [features, setFeatures] = useState<Feature[]>(FEATURES);
  const [addOns, setAddOns] = useState<AddOn[]>(ADD_ONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Filter features
  const filteredFeatures = features.filter(f => {
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !f.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterCategory !== 'all' && f.category !== filterCategory) return false;
    return true;
  });

  // Toggle feature
  const toggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(f =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
    setHasChanges(true);
  };

  // Toggle add-on
  const toggleAddOn = (addOnId: string) => {
    setAddOns(prev => prev.map(a =>
      a.id === addOnId ? { ...a, enabled: !a.enabled } : a
    ));
    setHasChanges(true);
  };

  // Save changes
  const saveChanges = () => {
    // In production, this would save to backend
    setHasChanges(false);
    alert('Changes saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Feature Management</h1>
          <p className="text-slate-600">Configure features, limits, and add-ons for each plan</p>
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
            Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Features</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{features.length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Enabled</span>
            <ToggleRight className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-3xl font-bold text-green-600">{features.filter(f => f.enabled).length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Add-Ons</span>
            <Plus className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{addOns.length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Categories</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{Object.keys(CATEGORY_CONFIG).length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'features', label: 'Features', icon: Package },
            { id: 'addons', label: 'Add-Ons', icon: Plus },
            { id: 'matrix', label: 'Feature Matrix', icon: BarChart3 }
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
      {activeTab === 'features' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
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
          </div>

          {/* Feature List by Category */}
          {Object.entries(CATEGORY_CONFIG).map(([categoryKey, categoryConfig]) => {
            const categoryFeatures = filteredFeatures.filter(f => f.category === categoryKey);
            if (categoryFeatures.length === 0) return null;

            return (
              <div key={categoryKey} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryConfig.color}`}>
                    <categoryConfig.icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-900">{categoryConfig.label}</span>
                  <span className="text-sm text-slate-500">({categoryFeatures.length} features)</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {categoryFeatures.map(feature => (
                    <div key={feature.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{feature.name}</span>
                            {feature.beta && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">BETA</span>
                            )}
                            {feature.new && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">NEW</span>
                            )}
                            {feature.comingSoon && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">SOON</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{feature.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {feature.availableIn.map(plan => (
                              <span
                                key={plan}
                                className={`px-1.5 py-0.5 rounded text-xs font-medium ${PLAN_CONFIG[plan].color}`}
                              >
                                {PLAN_CONFIG[plan].label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {feature.limitByPlan && (
                          <button
                            onClick={() => {
                              setSelectedFeature(feature);
                              setEditModalOpen(true);
                            }}
                            className="text-sm text-orange-600 hover:text-orange-700"
                          >
                            Edit Limits
                          </button>
                        )}
                        <button
                          onClick={() => toggleFeature(feature.id)}
                          className={`w-12 h-6 rounded-full relative transition-colors ${
                            feature.enabled ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                              feature.enabled ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'addons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addOns.map(addon => (
            <div key={addon.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <addon.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{addon.name}</h3>
                    <p className="text-sm text-slate-500">{addon.description}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-2xl font-bold text-slate-900">
                  ${addon.price}
                  <span className="text-sm font-normal text-slate-500">
                    /{addon.pricePer === 'one-time' ? 'one-time' : addon.pricePer}
                    {addon.unit && addon.pricePer !== 'one-time' && ` per ${addon.unit}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-slate-500">Available in:</span>
                {addon.availableIn.map(plan => (
                  <span
                    key={plan}
                    className={`px-1.5 py-0.5 rounded text-xs font-medium ${PLAN_CONFIG[plan].color}`}
                  >
                    {PLAN_CONFIG[plan].label}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button className="text-sm text-orange-600 hover:text-orange-700">
                  Edit Pricing
                </button>
                <button
                  onClick={() => toggleAddOn(addon.id)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    addon.enabled ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                      addon.enabled ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">Feature</th>
                {Object.entries(PLAN_CONFIG).map(([key, config]) => (
                  <th key={key} className="text-center px-4 py-4">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${config.color}`}>
                      <config.icon className="w-4 h-4" />
                      <span className="text-sm font-semibold">{config.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(CATEGORY_CONFIG).map(([categoryKey, categoryConfig]) => (
                <React.Fragment key={categoryKey}>
                  <tr className="bg-slate-50">
                    <td colSpan={5} className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <categoryConfig.icon className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold text-slate-700">{categoryConfig.label}</span>
                      </div>
                    </td>
                  </tr>
                  {features.filter(f => f.category === categoryKey).map(feature => (
                    <tr key={feature.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-700">{feature.name}</span>
                          {feature.new && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">NEW</span>}
                        </div>
                      </td>
                      {(['starter', 'professional', 'enterprise', 'agency'] as PlanTier[]).map(plan => (
                        <td key={plan} className="text-center px-4 py-3">
                          {feature.availableIn.includes(plan) ? (
                            feature.limitByPlan?.[plan] ? (
                              <span className="text-sm text-slate-700">{feature.limitByPlan[plan]}</span>
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            )
                          ) : (
                            <X className="w-5 h-5 text-slate-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Limits Modal */}
      {editModalOpen && selectedFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Edit Feature Limits</h2>
                <button
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedFeature(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <selectedFeature.icon className="w-6 h-6 text-slate-600" />
                <div>
                  <div className="font-medium text-slate-900">{selectedFeature.name}</div>
                  <div className="text-sm text-slate-500">{selectedFeature.description}</div>
                </div>
              </div>

              {selectedFeature.limitByPlan && Object.entries(selectedFeature.limitByPlan).map(([plan, limit]) => (
                <div key={plan}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {PLAN_CONFIG[plan as PlanTier].label} Limit
                  </label>
                  <input
                    type="text"
                    defaultValue={limit}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedFeature(null);
                }}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedFeature(null);
                  setHasChanges(true);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Save Limits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureManagement;
