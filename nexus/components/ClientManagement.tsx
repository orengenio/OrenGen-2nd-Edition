/**
 * Client / Tenant Management
 * Super Admin interface for agencies to manage sub-accounts and client tenants
 */

import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Mail,
  Phone,
  ExternalLink,
  Copy,
  Key,
  Globe,
  Settings,
  BarChart3,
  TrendingUp,
  DollarSign,
  UserPlus,
  UserMinus,
  Shield,
  Lock,
  Unlock,
  Calendar,
  Activity,
  Palette,
  Link2,
  Send,
  Download,
  Upload,
  Zap,
  Star,
  Crown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Types
type ClientStatus = 'active' | 'trial' | 'suspended' | 'churned';
type ClientPlan = 'starter' | 'professional' | 'enterprise' | 'custom';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  plan: ClientPlan;
  status: ClientStatus;
  createdAt: string;
  lastActive: string;
  trialEndsAt?: string;
  mrr: number;
  users: number;
  contacts: number;
  deals: number;
  whiteLabelEnabled: boolean;
  customDomain?: string;
  brandColors?: {
    primary: string;
    secondary: string;
  };
  features: string[];
  notes?: string;
  billingContact?: {
    name: string;
    email: string;
  };
  usage: {
    emailsSent: number;
    smsSent: number;
    apiCalls: number;
    storage: number; // in MB
  };
}

interface ClientStats {
  totalClients: number;
  activeClients: number;
  trialingClients: number;
  totalMrr: number;
  avgMrrPerClient: number;
  totalUsers: number;
  totalContacts: number;
  churnedThisMonth: number;
  newThisMonth: number;
}

// Mock data
const generateMockData = () => {
  const clients: Client[] = [
    {
      id: 'client-1',
      name: 'Acme Marketing Co',
      email: 'admin@acmemarketing.com',
      phone: '+1 (555) 123-4567',
      website: 'https://acmemarketing.com',
      plan: 'professional',
      status: 'active',
      createdAt: '2023-06-15',
      lastActive: '2024-01-12',
      mrr: 297,
      users: 5,
      contacts: 12500,
      deals: 45,
      whiteLabelEnabled: true,
      customDomain: 'crm.acmemarketing.com',
      brandColors: { primary: '#3B82F6', secondary: '#1E40AF' },
      features: ['crm', 'email_campaigns', 'reputation', 'freelance_hub'],
      billingContact: { name: 'John Smith', email: 'billing@acmemarketing.com' },
      usage: { emailsSent: 15000, smsSent: 2500, apiCalls: 45000, storage: 2500 }
    },
    {
      id: 'client-2',
      name: 'TechStart Solutions',
      email: 'hello@techstart.io',
      phone: '+1 (555) 234-5678',
      website: 'https://techstart.io',
      plan: 'enterprise',
      status: 'active',
      createdAt: '2023-09-20',
      lastActive: '2024-01-11',
      mrr: 697,
      users: 18,
      contacts: 45000,
      deals: 120,
      whiteLabelEnabled: true,
      customDomain: 'app.techstart.io',
      brandColors: { primary: '#8B5CF6', secondary: '#6D28D9' },
      features: ['crm', 'email_campaigns', 'sms_campaigns', 'reputation', 'ai_agents', 'sim_integration'],
      usage: { emailsSent: 85000, smsSent: 12000, apiCalls: 250000, storage: 8500 }
    },
    {
      id: 'client-3',
      name: 'Local Plumber Pro',
      email: 'mike@localplumber.com',
      plan: 'starter',
      status: 'trial',
      createdAt: '2024-01-05',
      lastActive: '2024-01-10',
      trialEndsAt: '2024-01-19',
      mrr: 0,
      users: 1,
      contacts: 250,
      deals: 8,
      whiteLabelEnabled: false,
      features: ['crm', 'email_campaigns'],
      usage: { emailsSent: 150, smsSent: 25, apiCalls: 500, storage: 50 }
    },
    {
      id: 'client-4',
      name: 'Premier Real Estate Group',
      email: 'admin@premierrealty.com',
      phone: '+1 (555) 345-6789',
      website: 'https://premierrealty.com',
      plan: 'custom',
      status: 'active',
      createdAt: '2023-03-10',
      lastActive: '2024-01-12',
      mrr: 1200,
      users: 25,
      contacts: 85000,
      deals: 350,
      whiteLabelEnabled: true,
      customDomain: 'portal.premierrealty.com',
      brandColors: { primary: '#059669', secondary: '#047857' },
      features: ['crm', 'email_campaigns', 'sms_campaigns', 'reputation', 'ai_agents', 'sim_integration', 'federal_suite'],
      notes: 'Enterprise custom deal with dedicated support',
      billingContact: { name: 'Sarah Davis', email: 'finance@premierrealty.com' },
      usage: { emailsSent: 250000, smsSent: 45000, apiCalls: 750000, storage: 25000 }
    },
    {
      id: 'client-5',
      name: 'Creative Design Studio',
      email: 'studio@creativedesign.co',
      plan: 'professional',
      status: 'suspended',
      createdAt: '2023-08-15',
      lastActive: '2023-12-20',
      mrr: 0,
      users: 3,
      contacts: 5000,
      deals: 20,
      whiteLabelEnabled: false,
      features: ['crm', 'email_campaigns'],
      notes: 'Payment failed - awaiting resolution',
      usage: { emailsSent: 8000, smsSent: 500, apiCalls: 15000, storage: 1200 }
    },
    {
      id: 'client-6',
      name: 'Sunset Insurance',
      email: 'ops@sunsetinsurance.com',
      phone: '+1 (555) 456-7890',
      plan: 'enterprise',
      status: 'churned',
      createdAt: '2023-04-01',
      lastActive: '2023-11-15',
      mrr: 0,
      users: 0,
      contacts: 0,
      deals: 0,
      whiteLabelEnabled: false,
      features: [],
      notes: 'Churned - moved to competitor',
      usage: { emailsSent: 0, smsSent: 0, apiCalls: 0, storage: 0 }
    }
  ];

  const stats: ClientStats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    trialingClients: clients.filter(c => c.status === 'trial').length,
    totalMrr: clients.reduce((sum, c) => sum + c.mrr, 0),
    avgMrrPerClient: Math.round(clients.filter(c => c.mrr > 0).reduce((sum, c) => sum + c.mrr, 0) / clients.filter(c => c.mrr > 0).length),
    totalUsers: clients.reduce((sum, c) => sum + c.users, 0),
    totalContacts: clients.reduce((sum, c) => sum + c.contacts, 0),
    churnedThisMonth: 1,
    newThisMonth: 2
  };

  return { clients, stats };
};

// Status badge
const StatusBadge: React.FC<{ status: ClientStatus }> = ({ status }) => {
  const config: Record<ClientStatus, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    trial: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trial' },
    suspended: { bg: 'bg-red-100', text: 'text-red-700', label: 'Suspended' },
    churned: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Churned' }
  };
  const { bg, text, label } = config[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>{label}</span>;
};

// Plan badge
const PlanBadge: React.FC<{ plan: ClientPlan }> = ({ plan }) => {
  const config: Record<ClientPlan, { bg: string; text: string; icon: React.ComponentType<any>; label: string }> = {
    starter: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Zap, label: 'Starter' },
    professional: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Star, label: 'Professional' },
    enterprise: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Crown, label: 'Enterprise' },
    custom: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Settings, label: 'Custom' }
  };
  const { bg, text, icon: Icon, label } = config[plan];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

// Main Component
const ClientManagement: React.FC = () => {
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'trial' | 'suspended' | 'churned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

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

  const { clients, stats } = data;

  // Filter clients
  const filteredClients = clients.filter(client => {
    if (activeTab !== 'all' && client.status !== activeTab) return false;
    if (searchQuery &&
        !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !client.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
          <p className="text-slate-600">Manage sub-accounts and client tenants</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            <Send className="w-4 h-4" />
            Invite Client
          </button>
          <button
            onClick={() => setNewClientModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Clients</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{stats.totalClients}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Active</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">{stats.activeClients}</span>
            <span className="text-sm text-blue-600">+{stats.trialingClients} trial</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total MRR</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">${stats.totalMrr.toLocaleString()}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Users</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{stats.totalUsers}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Contacts</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{(stats.totalContacts / 1000).toFixed(0)}K</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">+{stats.newThisMonth}</div>
              <div className="text-sm text-green-600">New clients this month</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700">${stats.avgMrrPerClient}</div>
              <div className="text-sm text-orange-600">Average MRR per client</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <UserMinus className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">{stats.churnedThisMonth}</div>
              <div className="text-sm text-red-600">Churned this month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Clients', count: clients.length },
              { id: 'active', label: 'Active', count: clients.filter(c => c.status === 'active').length },
              { id: 'trial', label: 'Trial', count: clients.filter(c => c.status === 'trial').length },
              { id: 'suspended', label: 'Suspended', count: clients.filter(c => c.status === 'suspended').length },
              { id: 'churned', label: 'Churned', count: clients.filter(c => c.status === 'churned').length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <div
            key={client.id}
            className={`bg-white rounded-xl border p-6 hover:shadow-lg transition cursor-pointer ${
              client.status === 'suspended' ? 'border-red-200' :
              client.status === 'churned' ? 'border-slate-300 opacity-60' :
              'border-slate-200'
            }`}
            onClick={() => {
              setSelectedClient(client);
              setClientModalOpen(true);
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {client.logo ? (
                  <img src={client.logo} alt={client.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: client.brandColors?.primary || '#6366F1' }}
                  >
                    {client.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{client.name}</h3>
                    {client.whiteLabelEnabled && (
                      <Palette className="w-4 h-4 text-purple-500" title="White-label enabled" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{client.email}</p>
                </div>
              </div>
              <StatusBadge status={client.status} />
            </div>

            {/* Plan & Stats */}
            <div className="flex items-center gap-2 mb-4">
              <PlanBadge plan={client.plan} />
              {client.customDomain && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                  <Globe className="w-3 h-3" />
                  Custom Domain
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="text-lg font-bold text-slate-900">{client.users}</div>
                <div className="text-xs text-slate-500">Users</div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="text-lg font-bold text-slate-900">
                  {client.contacts >= 1000 ? `${(client.contacts / 1000).toFixed(0)}K` : client.contacts}
                </div>
                <div className="text-xs text-slate-500">Contacts</div>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <div className="text-lg font-bold text-slate-900">{client.deals}</div>
                <div className="text-xs text-slate-500">Deals</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                {client.mrr > 0 ? (
                  <span className="text-lg font-bold text-green-600">${client.mrr}/mo</span>
                ) : client.status === 'trial' && client.trialEndsAt ? (
                  <span className="text-sm text-blue-600">
                    Trial ends {new Date(client.trialEndsAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-sm text-slate-400">No active subscription</span>
                )}
              </div>
              <div className="text-xs text-slate-400">
                Last active: {new Date(client.lastActive).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No clients found matching your criteria</p>
        </div>
      )}

      {/* Client Detail Modal */}
      {clientModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: selectedClient.brandColors?.primary || '#6366F1' }}
                  >
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-slate-900">{selectedClient.name}</h2>
                      <StatusBadge status={selectedClient.status} />
                      <PlanBadge plan={selectedClient.plan} />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span>{selectedClient.email}</span>
                      {selectedClient.phone && <span>{selectedClient.phone}</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setClientModalOpen(false);
                    setSelectedClient(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Account Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-slate-900">{selectedClient.users}</div>
                  <div className="text-xs text-slate-500">Users</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-slate-900">{selectedClient.contacts.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">Contacts</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-slate-900">{selectedClient.deals}</div>
                  <div className="text-xs text-slate-500">Deals</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">${selectedClient.mrr}</div>
                  <div className="text-xs text-green-600">MRR</div>
                </div>
              </div>

              {/* Usage */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Usage This Period</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{selectedClient.usage.emailsSent.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Emails Sent</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{selectedClient.usage.smsSent.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">SMS Sent</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{selectedClient.usage.apiCalls.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">API Calls</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{(selectedClient.usage.storage / 1000).toFixed(1)} GB</div>
                    <div className="text-xs text-slate-500">Storage</div>
                  </div>
                </div>
              </div>

              {/* White-Label Settings */}
              {selectedClient.whiteLabelEnabled && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">White-Label Configuration</h3>
                  <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                    {selectedClient.customDomain && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-700">Custom Domain</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-900">{selectedClient.customDomain}</span>
                          <button className="p-1 hover:bg-slate-200 rounded">
                            <Copy className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    )}
                    {selectedClient.brandColors && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-700">Brand Colors</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-slate-200"
                            style={{ backgroundColor: selectedClient.brandColors.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded border border-slate-200"
                            style={{ backgroundColor: selectedClient.brandColors.secondary }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Enabled Features */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Enabled Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.features.map(feature => (
                    <span key={feature} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {feature.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedClient.notes && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Notes</h3>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    {selectedClient.notes}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                  <Edit3 className="w-4 h-4" />
                  Edit Client
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                  <Key className="w-4 h-4" />
                  Login as Client
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
                {selectedClient.status === 'active' && (
                  <button className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                    <Lock className="w-4 h-4" />
                    Suspend
                  </button>
                )}
                {selectedClient.status === 'suspended' && (
                  <button className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition">
                    <Unlock className="w-4 h-4" />
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {newClientModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Add New Client</h2>
                <button
                  onClick={() => setNewClientModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  placeholder="admin@company.com"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="starter">Starter - $97/mo</option>
                  <option value="professional">Professional - $297/mo</option>
                  <option value="enterprise">Enterprise - $697/mo</option>
                  <option value="custom">Custom Plan</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="trial" className="rounded text-orange-500 focus:ring-orange-500" />
                <label htmlFor="trial" className="text-sm text-slate-700">Start with 14-day trial</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="whitelabel" className="rounded text-orange-500 focus:ring-orange-500" />
                <label htmlFor="whitelabel" className="text-sm text-slate-700">Enable white-label branding</label>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setNewClientModalOpen(false)}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Create Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Invite Client</h2>
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm">
                Send an invitation email to a potential client. They'll receive a link to sign up and get started.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="client@company.com"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name (optional)</label>
                <input
                  type="text"
                  placeholder="Their Company"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Personal Message (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Add a personal note to your invitation..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setInviteModalOpen(false)}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                <Send className="w-4 h-4" />
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
