/**
 * Plans & Billing Management
 * Super Admin interface for managing subscription plans, billing, and customer accounts
 */

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Plus,
  Settings,
  X,
  ChevronRight,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Building,
  Crown,
  Zap,
  Shield,
  Star,
  Gift,
  Percent,
  Receipt,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Send,
  Ban,
  PlayCircle,
  PauseCircle
} from 'lucide-react';

// Types
type PlanTier = 'starter' | 'professional' | 'enterprise' | 'agency';
type BillingCycle = 'monthly' | 'annual';
type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused';
type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';

interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limits: {
    users: number;
    contacts: number;
    leads: number;
    pipelines: number;
    simNumbers: number;
    aiAgents: number;
    locations: number;
  };
  popular?: boolean;
  foundingPrice?: {
    monthly: number;
    annual: number;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  plan: PlanTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  mrr: number;
  ltv: number;
  createdAt: string;
  trialEndsAt?: string;
  cancelAt?: string;
  foundingMember?: boolean;
  paymentMethod?: {
    type: 'card' | 'bank';
    last4: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  usage: {
    users: number;
    contacts: number;
    leads: number;
    pipelines: number;
  };
}

interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  invoiceNumber: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

interface BillingStats {
  mrr: number;
  arr: number;
  mrrGrowth: number;
  activeSubscriptions: number;
  trialingCustomers: number;
  churnRate: number;
  avgRevenuePerUser: number;
  ltv: number;
  revenueByPlan: Record<PlanTier, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

// Plan configurations
const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tier: 'starter',
    description: 'Perfect for solopreneurs and small teams',
    monthlyPrice: 97,
    annualPrice: 924,
    foundingPrice: { monthly: 49, annual: 468 },
    features: [
      'CRM (up to 2,500 contacts)',
      'Lead Generation (100/month)',
      'Basic Email Campaigns',
      'Calendar Integration (1 provider)',
      'Knowledge Wiki',
      'Mobile App Access',
      'Email Support'
    ],
    limits: { users: 1, contacts: 2500, leads: 100, pipelines: 1, simNumbers: 0, aiAgents: 0, locations: 0 }
  },
  {
    id: 'professional',
    name: 'Professional',
    tier: 'professional',
    description: 'For growing businesses and agencies',
    monthlyPrice: 297,
    annualPrice: 2844,
    foundingPrice: { monthly: 149, annual: 1428 },
    popular: true,
    features: [
      'Everything in Starter',
      'CRM (up to 25,000 contacts)',
      'Lead Generation (500/month)',
      'Reputation Manager (3 locations)',
      'Smart Social Commenting',
      'Universal Calendar (all providers)',
      'Campaign Studio (email + SMS)',
      'Freelance Hub (3 platforms)',
      'White-Label Branding',
      'Priority Support'
    ],
    limits: { users: 5, contacts: 25000, leads: 500, pipelines: 5, simNumbers: 0, aiAgents: 0, locations: 3 }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    description: 'Full-featured business operating system',
    monthlyPrice: 697,
    annualPrice: 6684,
    foundingPrice: { monthly: 349, annual: 3348 },
    features: [
      'Everything in Professional',
      'Unlimited Contacts',
      'Unlimited Leads',
      'Reputation Manager (unlimited)',
      'SIM Integration (3 numbers)',
      'AI Agent Studio (all 8 agents)',
      'Federal Contracting Suite',
      'Freelance Hub (all platforms)',
      'Custom Integrations',
      'Dedicated Success Manager',
      'Phone + Chat Support',
      'SLA Guarantee'
    ],
    limits: { users: 25, contacts: -1, leads: -1, pipelines: -1, simNumbers: 3, aiAgents: 8, locations: -1 }
  },
  {
    id: 'agency',
    name: 'Agency',
    tier: 'agency',
    description: 'For agencies managing multiple clients',
    monthlyPrice: 1497,
    annualPrice: 14364,
    foundingPrice: { monthly: 749, annual: 7188 },
    features: [
      'Everything in Enterprise',
      'Multi-tenant Architecture',
      'Unlimited Sub-accounts',
      'Client Billing Management',
      'Agency Dashboard',
      'Reseller Pricing',
      'Full API Access',
      'Custom Development Hours',
      'White-glove Onboarding'
    ],
    limits: { users: -1, contacts: -1, leads: -1, pipelines: -1, simNumbers: -1, aiAgents: 8, locations: -1 }
  }
];

// Mock data
const generateMockData = () => {
  const customers: Customer[] = [
    {
      id: 'cust-1',
      name: 'John Smith',
      email: 'john@acmecorp.com',
      company: 'Acme Corp',
      phone: '+1 (555) 123-4567',
      plan: 'enterprise',
      billingCycle: 'annual',
      status: 'active',
      currentPeriodStart: '2024-01-01',
      currentPeriodEnd: '2025-01-01',
      mrr: 557,
      ltv: 6684,
      createdAt: '2023-06-15',
      foundingMember: true,
      paymentMethod: { type: 'card', last4: '4242', brand: 'visa', expiryMonth: 12, expiryYear: 2026 },
      usage: { users: 12, contacts: 15000, leads: 450, pipelines: 8 }
    },
    {
      id: 'cust-2',
      name: 'Sarah Johnson',
      email: 'sarah@techstart.io',
      company: 'TechStart',
      plan: 'professional',
      billingCycle: 'monthly',
      status: 'active',
      currentPeriodStart: '2024-01-10',
      currentPeriodEnd: '2024-02-10',
      mrr: 297,
      ltv: 2376,
      createdAt: '2023-09-20',
      paymentMethod: { type: 'card', last4: '1234', brand: 'mastercard', expiryMonth: 8, expiryYear: 2025 },
      usage: { users: 3, contacts: 8500, leads: 200, pipelines: 3 }
    },
    {
      id: 'cust-3',
      name: 'Mike Williams',
      email: 'mike@freelancer.com',
      plan: 'starter',
      billingCycle: 'monthly',
      status: 'trialing',
      currentPeriodStart: '2024-01-08',
      currentPeriodEnd: '2024-01-22',
      trialEndsAt: '2024-01-22',
      mrr: 0,
      ltv: 0,
      createdAt: '2024-01-08',
      usage: { users: 1, contacts: 150, leads: 25, pipelines: 1 }
    },
    {
      id: 'cust-4',
      name: 'Emily Davis',
      email: 'emily@bigagency.com',
      company: 'Big Agency LLC',
      phone: '+1 (555) 987-6543',
      plan: 'agency',
      billingCycle: 'annual',
      status: 'active',
      currentPeriodStart: '2023-11-01',
      currentPeriodEnd: '2024-11-01',
      mrr: 1197,
      ltv: 14364,
      createdAt: '2023-03-10',
      foundingMember: true,
      paymentMethod: { type: 'card', last4: '5678', brand: 'amex', expiryMonth: 3, expiryYear: 2027 },
      usage: { users: 45, contacts: 120000, leads: 3500, pipelines: 25 }
    },
    {
      id: 'cust-5',
      name: 'Robert Chen',
      email: 'robert@smallbiz.net',
      company: 'SmallBiz Solutions',
      plan: 'professional',
      billingCycle: 'monthly',
      status: 'past_due',
      currentPeriodStart: '2023-12-15',
      currentPeriodEnd: '2024-01-15',
      mrr: 297,
      ltv: 1485,
      createdAt: '2023-08-15',
      paymentMethod: { type: 'card', last4: '9999', brand: 'visa', expiryMonth: 1, expiryYear: 2024 },
      usage: { users: 4, contacts: 12000, leads: 300, pipelines: 4 }
    },
    {
      id: 'cust-6',
      name: 'Lisa Anderson',
      email: 'lisa@creativeco.design',
      company: 'Creative Co',
      plan: 'starter',
      billingCycle: 'annual',
      status: 'canceled',
      currentPeriodStart: '2023-06-01',
      currentPeriodEnd: '2024-06-01',
      cancelAt: '2024-06-01',
      mrr: 77,
      ltv: 924,
      createdAt: '2023-06-01',
      paymentMethod: { type: 'card', last4: '3333', brand: 'visa', expiryMonth: 9, expiryYear: 2025 },
      usage: { users: 1, contacts: 800, leads: 50, pipelines: 1 }
    }
  ];

  const invoices: Invoice[] = [
    {
      id: 'inv-1',
      customerId: 'cust-1',
      customerName: 'John Smith (Acme Corp)',
      amount: 6684,
      status: 'succeeded',
      dueDate: '2024-01-01',
      paidAt: '2024-01-01',
      invoiceNumber: 'INV-2024-001',
      items: [{ description: 'Enterprise Plan (Annual)', quantity: 1, unitPrice: 6684, total: 6684 }]
    },
    {
      id: 'inv-2',
      customerId: 'cust-2',
      customerName: 'Sarah Johnson (TechStart)',
      amount: 297,
      status: 'succeeded',
      dueDate: '2024-01-10',
      paidAt: '2024-01-10',
      invoiceNumber: 'INV-2024-002',
      items: [{ description: 'Professional Plan (Monthly)', quantity: 1, unitPrice: 297, total: 297 }]
    },
    {
      id: 'inv-3',
      customerId: 'cust-5',
      customerName: 'Robert Chen (SmallBiz)',
      amount: 297,
      status: 'failed',
      dueDate: '2024-01-15',
      invoiceNumber: 'INV-2024-003',
      items: [{ description: 'Professional Plan (Monthly)', quantity: 1, unitPrice: 297, total: 297 }]
    },
    {
      id: 'inv-4',
      customerId: 'cust-4',
      customerName: 'Emily Davis (Big Agency)',
      amount: 14364,
      status: 'succeeded',
      dueDate: '2023-11-01',
      paidAt: '2023-11-01',
      invoiceNumber: 'INV-2023-089',
      items: [{ description: 'Agency Plan (Annual - Founding)', quantity: 1, unitPrice: 14364, total: 14364 }]
    }
  ];

  const stats: BillingStats = {
    mrr: 2425,
    arr: 29100,
    mrrGrowth: 12.5,
    activeSubscriptions: 4,
    trialingCustomers: 1,
    churnRate: 2.3,
    avgRevenuePerUser: 485,
    ltv: 25833,
    revenueByPlan: { starter: 924, professional: 3861, enterprise: 6684, agency: 14364 },
    revenueByMonth: [
      { month: 'Aug', revenue: 1850 },
      { month: 'Sep', revenue: 2100 },
      { month: 'Oct', revenue: 2250 },
      { month: 'Nov', revenue: 2400 },
      { month: 'Dec', revenue: 2350 },
      { month: 'Jan', revenue: 2425 }
    ]
  };

  return { customers, invoices, stats };
};

// Components
const PlanBadge: React.FC<{ tier: PlanTier }> = ({ tier }) => {
  const config: Record<PlanTier, { bg: string; text: string; icon: React.ComponentType<any> }> = {
    starter: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Zap },
    professional: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Star },
    enterprise: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Crown },
    agency: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Building }
  };
  const { bg, text, icon: Icon } = config[tier];
  const plan = PLANS.find(p => p.tier === tier);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {plan?.name}
    </span>
  );
};

const StatusBadge: React.FC<{ status: SubscriptionStatus }> = ({ status }) => {
  const config: Record<SubscriptionStatus, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    trialing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trial' },
    past_due: { bg: 'bg-red-100', text: 'text-red-700', label: 'Past Due' },
    canceled: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Canceled' },
    paused: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Paused' }
  };
  const { bg, text, label } = config[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>{label}</span>;
};

const PaymentBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const config: Record<PaymentStatus, { bg: string; text: string; label: string }> = {
    succeeded: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
    refunded: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Refunded' }
  };
  const { bg, text, label } = config[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>{label}</span>;
};

// Main Component
const PlansBilling: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'plans' | 'invoices' | 'coupons'>('overview');
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');

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

  const { customers, invoices, stats } = data;

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.company?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterPlan !== 'all' && c.plan !== filterPlan) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Plans & Billing</h1>
          <p className="text-slate-600">Manage subscriptions, customers, and revenue</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCouponModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            <Gift className="w-4 h-4" />
            Coupons
          </button>
          <button
            onClick={() => setPlanModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Monthly Recurring Revenue</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">${stats.mrr.toLocaleString()}</span>
            <span className={`flex items-center text-sm ${stats.mrrGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.mrrGrowth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(stats.mrrGrowth)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Annual Revenue</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-green-600">${stats.arr.toLocaleString()}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Active Subscriptions</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.activeSubscriptions}</span>
            <span className="text-sm text-blue-600">+{stats.trialingCustomers} trial</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Churn Rate</span>
            <TrendingDown className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{stats.churnRate}%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: PieChart },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'plans', label: 'Plans', icon: Package },
            { id: 'invoices', label: 'Invoices', icon: Receipt },
            { id: 'coupons', label: 'Coupons', icon: Gift }
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
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue by Plan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue by Plan</h2>
            <div className="space-y-4">
              {PLANS.map(plan => {
                const revenue = stats.revenueByPlan[plan.tier] || 0;
                const percentage = (revenue / stats.arr) * 100;
                return (
                  <div key={plan.id} className="flex items-center gap-4">
                    <PlanBadge tier={plan.tier} />
                    <div className="flex-1">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-20 text-right">
                      ${revenue.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">MRR Trend</h2>
            <div className="h-48 flex items-end gap-2">
              {stats.revenueByMonth.map((item, index) => {
                const maxRevenue = Math.max(...stats.revenueByMonth.map(r => r.revenue));
                const height = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={`w-full rounded-t transition-all ${
                        index === stats.revenueByMonth.length - 1 ? 'bg-orange-500' : 'bg-slate-200'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-slate-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">${stats.avgRevenuePerUser}</div>
              <div className="text-xs text-slate-500">Avg Revenue per User</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">${stats.ltv.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Customer Lifetime Value</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{customers.filter(c => c.foundingMember).length}</div>
              <div className="text-xs text-slate-500">Founding Members</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{customers.filter(c => c.billingCycle === 'annual').length}</div>
              <div className="text-xs text-slate-500">Annual Subscribers</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers..."
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
              <option value="active">Active</option>
              <option value="trialing">Trial</option>
              <option value="past_due">Past Due</option>
              <option value="canceled">Canceled</option>
            </select>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Plans</option>
              {PLANS.map(plan => (
                <option key={plan.id} value={plan.tier}>{plan.name}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Customer List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Plan</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">MRR</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Since</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{customer.name}</span>
                            {customer.foundingMember && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                                <Crown className="w-3 h-3" /> Founder
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500">{customer.email}</div>
                          {customer.company && <div className="text-xs text-slate-400">{customer.company}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PlanBadge tier={customer.plan} />
                      <div className="text-xs text-slate-500 mt-1">
                        {customer.billingCycle === 'annual' ? 'Annual' : 'Monthly'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={customer.status} />
                      {customer.trialEndsAt && (
                        <div className="text-xs text-slate-500 mt-1">
                          Ends {new Date(customer.trialEndsAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">${customer.mrr}</span>
                      <div className="text-xs text-slate-500">LTV: ${customer.ltv.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setCustomerModalOpen(true);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                          <Mail className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                          <MoreVertical className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border-2 p-6 relative ${
                plan.popular ? 'border-orange-500' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>

                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">${plan.monthlyPrice}</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                  {plan.foundingPrice && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-sm text-slate-400 line-through">${plan.monthlyPrice}</span>
                      <span className="text-sm font-medium text-green-600">
                        ${plan.foundingPrice.monthly}/mo founding
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-1">
                    or ${plan.annualPrice}/year (save 20%)
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.slice(0, 6).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{feature}</span>
                  </div>
                ))}
                {plan.features.length > 6 && (
                  <div className="text-sm text-orange-600 font-medium">
                    +{plan.features.length - 6} more features
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Users</span>
                  <span className="font-medium text-slate-700">{plan.limits.users === -1 ? 'Unlimited' : plan.limits.users}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Contacts</span>
                  <span className="font-medium text-slate-700">{plan.limits.contacts === -1 ? 'Unlimited' : plan.limits.contacts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Leads/mo</span>
                  <span className="font-medium text-slate-700">{plan.limits.leads === -1 ? 'Unlimited' : plan.limits.leads}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">SIM Numbers</span>
                  <span className="font-medium text-slate-700">{plan.limits.simNumbers === -1 ? 'Unlimited' : plan.limits.simNumbers || '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">AI Agents</span>
                  <span className="font-medium text-slate-700">{plan.limits.aiAgents || '—'}</span>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
                <Edit3 className="w-4 h-4 inline mr-2" />
                Edit Plan
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Invoices</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition">
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Invoice</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Due Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-900">{invoice.invoiceNumber}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{invoice.customerName}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4"><PaymentBadge status={invoice.status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Download className="w-4 h-4 text-slate-500" />
                      </button>
                      {invoice.status === 'failed' && (
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                          <RefreshCw className="w-4 h-4 text-orange-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-600">Manage discount codes and promotional offers</p>
            <button
              onClick={() => setCouponModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Create Coupon
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Code</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Discount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Usage</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Valid Until</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">FOUNDING50</span>
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-medium">50% off forever</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">47 / 100 used</td>
                  <td className="px-6 py-4 text-sm text-slate-500">Limited availability</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <Edit3 className="w-4 h-4 text-slate-500" />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">ANNUAL20</span>
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-medium">20% off annual</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">Unlimited</td>
                  <td className="px-6 py-4 text-sm text-slate-500">No expiry</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <Edit3 className="w-4 h-4 text-slate-500" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {customerModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-slate-900">{selectedCustomer.name}</h2>
                      {selectedCustomer.foundingMember && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                          <Crown className="w-3 h-3" /> Founding Member
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">{selectedCustomer.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCustomerModalOpen(false);
                    setSelectedCustomer(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Subscription Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Plan</div>
                  <div className="flex items-center gap-2">
                    <PlanBadge tier={selectedCustomer.plan} />
                    <span className="text-sm text-slate-600">
                      ({selectedCustomer.billingCycle})
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Status</div>
                  <StatusBadge status={selectedCustomer.status} />
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">MRR</div>
                  <div className="text-xl font-bold text-slate-900">${selectedCustomer.mrr}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-500 mb-1">Lifetime Value</div>
                  <div className="text-xl font-bold text-green-600">${selectedCustomer.ltv.toLocaleString()}</div>
                </div>
              </div>

              {/* Usage */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Usage</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{selectedCustomer.usage.users}</div>
                    <div className="text-xs text-slate-500">Users</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{selectedCustomer.usage.contacts.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Contacts</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{selectedCustomer.usage.leads}</div>
                    <div className="text-xs text-slate-500">Leads</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{selectedCustomer.usage.pipelines}</div>
                    <div className="text-xs text-slate-500">Pipelines</div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              {selectedCustomer.paymentMethod && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Payment Method</h3>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <CreditCard className="w-8 h-8 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-900">
                        {selectedCustomer.paymentMethod.brand?.toUpperCase()} •••• {selectedCustomer.paymentMethod.last4}
                      </div>
                      <div className="text-sm text-slate-500">
                        Expires {selectedCustomer.paymentMethod.expiryMonth}/{selectedCustomer.paymentMethod.expiryYear}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                  <Edit3 className="w-4 h-4" />
                  Edit Plan
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                  <Gift className="w-4 h-4" />
                  Apply Coupon
                </button>
                {selectedCustomer.status === 'active' && (
                  <button className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                    <PauseCircle className="w-4 h-4" />
                    Pause
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Create Coupon</h2>
                <button
                  onClick={() => setCouponModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g., SAVE20"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="percent">Percentage Off</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Discount Value</label>
                <input
                  type="number"
                  placeholder="20"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="once">Once</option>
                  <option value="repeating">Multiple months</option>
                  <option value="forever">Forever</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Usage Limit (optional)</label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Applies to Plans</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PLANS.map(plan => (
                    <label key={plan.id} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
                      <span className="text-sm">{plan.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setCouponModalOpen(false)}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansBilling;
