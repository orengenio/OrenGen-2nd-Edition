/**
 * MCP Hub
 * Connect to any MCP, browse marketplace, and create custom OrenGen MCPs
 */

import React, { useState, useEffect } from 'react';
import {
  Plug,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Settings,
  X,
  ChevronRight,
  ChevronDown,
  Eye,
  Edit3,
  Trash2,
  Download,
  Upload,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Star,
  Code,
  Terminal,
  Package,
  Globe,
  Database,
  Bot,
  MessageSquare,
  Zap,
  Shield,
  BarChart3,
  Activity,
  Clock,
  Users,
  Sparkles,
  Rocket,
  FileCode,
  TestTube,
  Send,
  Link2,
  Layers,
  Box,
  Server,
  Cpu,
  GitBranch,
  Save
} from 'lucide-react';

// Types
type MCPStatus = 'connected' | 'disconnected' | 'error' | 'connecting';
type MCPCategory = 'data' | 'ai' | 'productivity' | 'communication' | 'analytics' | 'integration' | 'custom';

interface MCPServer {
  id: string;
  name: string;
  description: string;
  category: MCPCategory;
  version: string;
  author: string;
  status: MCPStatus;
  tools: MCPTool[];
  resources: string[];
  prompts: string[];
  stats?: {
    totalCalls: number;
    successRate: number;
    avgLatency: number;
  };
  isOfficial?: boolean;
  isCustom?: boolean;
}

interface MCPTool {
  name: string;
  description: string;
}

interface MarketplaceEntry {
  id: string;
  name: string;
  description: string;
  category: MCPCategory;
  author: string;
  authorVerified: boolean;
  downloads: number;
  rating: number;
  reviews: number;
  version: string;
  tags: string[];
  pricing: 'free' | 'paid' | 'freemium';
  isOfficial: boolean;
  installCommand: string;
}

interface CustomMCP {
  id: string;
  name: string;
  description: string;
  version: string;
  category: MCPCategory;
  tools: MCPTool[];
  code: string;
  published: boolean;
  publishedAt?: string;
  downloads?: number;
}

// Mock data
const generateMockData = () => {
  const connectedServers: MCPServer[] = [
    {
      id: 'mcp-filesystem',
      name: 'Filesystem',
      description: 'Read, write, and manage files',
      category: 'productivity',
      version: '1.0.3',
      author: 'Anthropic',
      status: 'connected',
      tools: [
        { name: 'read_file', description: 'Read file contents' },
        { name: 'write_file', description: 'Write to a file' },
        { name: 'list_directory', description: 'List directory contents' },
        { name: 'search_files', description: 'Search for files' }
      ],
      resources: ['file://', 'directory://'],
      prompts: [],
      stats: { totalCalls: 1250, successRate: 99.2, avgLatency: 45 },
      isOfficial: true
    },
    {
      id: 'mcp-github',
      name: 'GitHub',
      description: 'Interact with GitHub repos',
      category: 'productivity',
      version: '1.0.2',
      author: 'Anthropic',
      status: 'connected',
      tools: [
        { name: 'create_issue', description: 'Create a GitHub issue' },
        { name: 'create_pr', description: 'Create a pull request' },
        { name: 'list_repos', description: 'List repositories' }
      ],
      resources: ['github://'],
      prompts: ['code_review'],
      stats: { totalCalls: 890, successRate: 98.5, avgLatency: 120 },
      isOfficial: true
    },
    {
      id: 'custom-crm-sync',
      name: 'CRM Sync (Custom)',
      description: 'Sync contacts between CRMs',
      category: 'integration',
      version: '1.0.0',
      author: 'OrenGen',
      status: 'connected',
      tools: [
        { name: 'sync_contacts', description: 'Sync contacts' },
        { name: 'sync_deals', description: 'Sync deals' }
      ],
      resources: [],
      prompts: [],
      stats: { totalCalls: 456, successRate: 97.8, avgLatency: 200 },
      isCustom: true
    }
  ];

  const marketplace: MarketplaceEntry[] = [
    {
      id: 'mcp-postgres',
      name: 'PostgreSQL',
      description: 'Query and manage PostgreSQL databases',
      category: 'data',
      author: 'Anthropic',
      authorVerified: true,
      downloads: 67000,
      rating: 4.6,
      reviews: 189,
      version: '1.0.1',
      tags: ['database', 'sql', 'postgres'],
      pricing: 'free',
      isOfficial: true,
      installCommand: 'npx @anthropic/mcp-server-postgres'
    },
    {
      id: 'mcp-slack',
      name: 'Slack',
      description: 'Send messages and manage Slack workspaces',
      category: 'communication',
      author: 'Anthropic',
      authorVerified: true,
      downloads: 54000,
      rating: 4.5,
      reviews: 167,
      version: '1.0.0',
      tags: ['slack', 'messaging', 'chat'],
      pricing: 'free',
      isOfficial: true,
      installCommand: 'npx @anthropic/mcp-server-slack'
    },
    {
      id: 'mcp-brave',
      name: 'Brave Search',
      description: 'Search the web using Brave',
      category: 'data',
      author: 'Anthropic',
      authorVerified: true,
      downloads: 45000,
      rating: 4.4,
      reviews: 134,
      version: '1.0.0',
      tags: ['search', 'web', 'brave'],
      pricing: 'free',
      isOfficial: true,
      installCommand: 'npx @anthropic/mcp-server-brave-search'
    },
    {
      id: 'mcp-notion',
      name: 'Notion',
      description: 'Interact with Notion pages and databases',
      category: 'productivity',
      author: 'Community',
      authorVerified: false,
      downloads: 28000,
      rating: 4.4,
      reviews: 89,
      version: '1.0.0',
      tags: ['notion', 'notes', 'wiki'],
      pricing: 'free',
      isOfficial: false,
      installCommand: 'npx mcp-server-notion'
    },
    {
      id: 'mcp-salesforce',
      name: 'Salesforce',
      description: 'Connect to Salesforce CRM',
      category: 'integration',
      author: 'Community',
      authorVerified: false,
      downloads: 12000,
      rating: 4.3,
      reviews: 45,
      version: '0.9.2',
      tags: ['crm', 'salesforce', 'sales'],
      pricing: 'free',
      isOfficial: false,
      installCommand: 'npx mcp-server-salesforce'
    },
    {
      id: 'mcp-puppeteer',
      name: 'Puppeteer',
      description: 'Browser automation and scraping',
      category: 'productivity',
      author: 'Anthropic',
      authorVerified: true,
      downloads: 38000,
      rating: 4.6,
      reviews: 98,
      version: '1.0.1',
      tags: ['browser', 'automation', 'scraping'],
      pricing: 'free',
      isOfficial: true,
      installCommand: 'npx @anthropic/mcp-server-puppeteer'
    }
  ];

  const customMCPs: CustomMCP[] = [
    {
      id: 'custom-1',
      name: 'CRM Sync',
      description: 'Sync contacts and deals between CRM systems',
      version: '1.0.0',
      category: 'integration',
      tools: [
        { name: 'sync_contacts', description: 'Sync contacts from source to destination' },
        { name: 'sync_deals', description: 'Sync deals/opportunities' }
      ],
      code: '// CRM Sync MCP code...',
      published: true,
      publishedAt: '2024-01-10',
      downloads: 156
    },
    {
      id: 'custom-2',
      name: 'Data Enrichment',
      description: 'Enrich contact and company data',
      version: '0.9.0',
      category: 'data',
      tools: [
        { name: 'enrich_contact', description: 'Enrich a contact with additional data' },
        { name: 'enrich_company', description: 'Enrich company data' }
      ],
      code: '// Data Enrichment MCP code...',
      published: false
    }
  ];

  return { connectedServers, marketplace, customMCPs };
};

// Status badge
const StatusBadge: React.FC<{ status: MCPStatus }> = ({ status }) => {
  const config: Record<MCPStatus, { bg: string; text: string; dot: string; label: string }> = {
    connected: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Connected' },
    disconnected: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400', label: 'Disconnected' },
    connecting: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Connecting' },
    error: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Error' }
  };
  const { bg, text, dot, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${status === 'connecting' ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  );
};

// Category badge
const CategoryBadge: React.FC<{ category: MCPCategory }> = ({ category }) => {
  const config: Record<MCPCategory, { bg: string; text: string; icon: React.ComponentType<any> }> = {
    data: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Database },
    ai: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Bot },
    productivity: { bg: 'bg-green-100', text: 'text-green-700', icon: Zap },
    communication: { bg: 'bg-orange-100', text: 'text-orange-700', icon: MessageSquare },
    analytics: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: BarChart3 },
    integration: { bg: 'bg-pink-100', text: 'text-pink-700', icon: Link2 },
    custom: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Code }
  };
  const { bg, text, icon: Icon } = config[category];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium capitalize ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {category}
    </span>
  );
};

// Main Component
const MCPHub: React.FC = () => {
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [activeTab, setActiveTab] = useState<'connected' | 'marketplace' | 'custom' | 'create'>('connected');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null);
  const [serverDetailOpen, setServerDetailOpen] = useState(false);
  const [createMCPOpen, setCreateMCPOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Create MCP state
  const [newMCP, setNewMCP] = useState({
    name: '',
    description: '',
    category: 'custom' as MCPCategory,
    tools: [{ name: '', description: '' }],
    code: ''
  });

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

  const { connectedServers, marketplace, customMCPs } = data;

  // Filter marketplace
  const filteredMarketplace = marketplace.filter(entry => {
    if (searchQuery &&
        !entry.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    if (filterCategory !== 'all' && entry.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">MCP Hub</h1>
          <p className="text-slate-600">Connect, discover, and create Model Context Protocol servers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setConnectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            <Plug className="w-4 h-4" />
            Connect Server
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            Create MCP
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Connected</span>
            <Plug className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-3xl font-bold text-green-600">{connectedServers.filter(s => s.status === 'connected').length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Calls</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">
            {connectedServers.reduce((sum, s) => sum + (s.stats?.totalCalls || 0), 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Custom MCPs</span>
            <Code className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{customMCPs.length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Published</span>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-purple-600">{customMCPs.filter(m => m.published).length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'connected', label: 'Connected', icon: Plug, count: connectedServers.length },
            { id: 'marketplace', label: 'Marketplace', icon: Package, count: marketplace.length },
            { id: 'custom', label: 'My MCPs', icon: Code, count: customMCPs.length },
            { id: 'create', label: 'Create', icon: Plus }
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

      {/* Tab Content */}
      {activeTab === 'connected' && (
        <div className="space-y-4">
          {connectedServers.map(server => (
            <div
              key={server.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                setSelectedServer(server);
                setServerDetailOpen(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    server.status === 'connected' ? 'bg-green-100' : 'bg-slate-100'
                  }`}>
                    <Server className={`w-6 h-6 ${server.status === 'connected' ? 'text-green-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{server.name}</h3>
                      <StatusBadge status={server.status} />
                      {server.isOfficial && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          <Shield className="w-3 h-3" />
                          Official
                        </span>
                      )}
                      {server.isCustom && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          <Sparkles className="w-3 h-3" />
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{server.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>v{server.version}</span>
                      <span>by {server.author}</span>
                      <CategoryBadge category={server.category} />
                    </div>
                  </div>
                </div>

                {server.stats && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{server.stats.totalCalls.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">calls</div>
                    <div className="text-sm text-green-600 mt-1">{server.stats.successRate}% success</div>
                  </div>
                )}
              </div>

              {/* Tools preview */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{server.tools.length} Tools</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {server.tools.slice(0, 5).map(tool => (
                    <span key={tool.name} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                      {tool.name}
                    </span>
                  ))}
                  {server.tools.length > 5 && (
                    <span className="px-2 py-1 text-slate-500 text-xs">
                      +{server.tools.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {connectedServers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Plug className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No MCP servers connected</p>
              <button
                onClick={() => setConnectModalOpen(true)}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Connect Your First Server
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search MCPs..."
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
              <option value="data">Data</option>
              <option value="ai">AI</option>
              <option value="productivity">Productivity</option>
              <option value="communication">Communication</option>
              <option value="integration">Integration</option>
            </select>
          </div>

          {/* Marketplace Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarketplace.map(entry => (
              <div key={entry.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Package className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{entry.name}</h3>
                        {entry.isOfficial && (
                          <Shield className="w-4 h-4 text-blue-500" title="Official" />
                        )}
                      </div>
                      <div className="text-sm text-slate-500">by {entry.author}</div>
                    </div>
                  </div>
                  <CategoryBadge category={entry.category} />
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{entry.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-slate-700">{entry.rating}</span>
                    <span className="text-slate-400">({entry.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Download className="w-4 h-4" />
                    {(entry.downloads / 1000).toFixed(0)}k
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {entry.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm">
                    <Download className="w-4 h-4" />
                    Install
                  </button>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-4">
          {/* OrenGen Worldwide Banner */}
          <div className="bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Globe className="w-6 h-6" />
                  OrenGen Worldwide MCP Registry
                </h2>
                <p className="text-white/80">Publish your custom MCPs to the OrenGen marketplace and earn revenue</p>
              </div>
              <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Custom MCPs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customMCPs.map(mcp => (
              <div key={mcp.id} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{mcp.name}</h3>
                      <span className="text-xs text-slate-500">v{mcp.version}</span>
                    </div>
                    <p className="text-sm text-slate-600">{mcp.description}</p>
                  </div>
                  {mcp.published ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      <Globe className="w-3 h-3" />
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      Draft
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-2">{mcp.tools.length} Tools</div>
                  <div className="flex flex-wrap gap-1">
                    {mcp.tools.map(tool => (
                      <span key={tool.name} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>

                {mcp.published && (
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {mcp.downloads} downloads
                    </span>
                    <span>Published {mcp.publishedAt}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-sm">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-sm">
                    <TestTube className="w-4 h-4" />
                    Test
                  </button>
                  {!mcp.published && (
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm">
                      <Rocket className="w-4 h-4" />
                      Publish
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Create New Card */}
            <div
              className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition"
              onClick={() => setActiveTab('create')}
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Create New MCP</h3>
              <p className="text-sm text-slate-500">Build a custom Model Context Protocol server</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Create Custom MCP</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">MCP Name</label>
                  <input
                    type="text"
                    value={newMCP.name}
                    onChange={(e) => setNewMCP({ ...newMCP, name: e.target.value })}
                    placeholder="e.g., My Custom MCP"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={newMCP.description}
                    onChange={(e) => setNewMCP({ ...newMCP, description: e.target.value })}
                    rows={3}
                    placeholder="What does this MCP do?"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newMCP.category}
                    onChange={(e) => setNewMCP({ ...newMCP, category: e.target.value as MCPCategory })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="data">Data</option>
                    <option value="ai">AI</option>
                    <option value="productivity">Productivity</option>
                    <option value="communication">Communication</option>
                    <option value="integration">Integration</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* Tools */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">Tools</label>
                    <button
                      onClick={() => setNewMCP({
                        ...newMCP,
                        tools: [...newMCP.tools, { name: '', description: '' }]
                      })}
                      className="text-sm text-orange-600 hover:text-orange-700"
                    >
                      + Add Tool
                    </button>
                  </div>
                  <div className="space-y-3">
                    {newMCP.tools.map((tool, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                        <input
                          type="text"
                          placeholder="Tool name"
                          value={tool.name}
                          onChange={(e) => {
                            const tools = [...newMCP.tools];
                            tools[idx].name = e.target.value;
                            setNewMCP({ ...newMCP, tools });
                          }}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={tool.description}
                          onChange={(e) => {
                            const tools = [...newMCP.tools];
                            tools[idx].description = e.target.value;
                            setNewMCP({ ...newMCP, tools });
                          }}
                          className="flex-[2] px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                        {newMCP.tools.length > 1 && (
                          <button
                            onClick={() => {
                              const tools = newMCP.tools.filter((_, i) => i !== idx);
                              setNewMCP({ ...newMCP, tools });
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Editor */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Server Code</label>
                  <div className="relative">
                    <textarea
                      value={newMCP.code}
                      onChange={(e) => setNewMCP({ ...newMCP, code: e.target.value })}
                      rows={15}
                      placeholder="// Your MCP server code here..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm bg-slate-900 text-green-400"
                    />
                    <button className="absolute top-2 right-2 px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs hover:bg-slate-600">
                      Generate Boilerplate
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition">
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                  <TestTube className="w-4 h-4" />
                  Test
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                  <Play className="w-4 h-4" />
                  Deploy
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition ml-auto">
                  <Rocket className="w-4 h-4" />
                  Publish to OrenGen
                </button>
              </div>
            </div>
          </div>

          {/* Templates */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Templates</h3>
              <div className="space-y-3">
                {[
                  { id: 'crm-sync', name: 'CRM Sync', desc: 'Sync between CRM systems' },
                  { id: 'data-enrichment', name: 'Data Enrichment', desc: 'Enrich contact data' },
                  { id: 'ai-assistant', name: 'AI Assistant', desc: 'Custom AI with knowledge' },
                  { id: 'webhook-handler', name: 'Webhook Handler', desc: 'Process webhooks' }
                ].map(template => (
                  <button
                    key={template.id}
                    className="w-full p-3 text-left bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                  >
                    <div className="font-medium text-slate-900">{template.name}</div>
                    <div className="text-sm text-slate-500">{template.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Documentation</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                  <ExternalLink className="w-4 h-4" />
                  MCP Specification
                </a>
                <a href="#" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                  <ExternalLink className="w-4 h-4" />
                  SDK Documentation
                </a>
                <a href="#" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                  <ExternalLink className="w-4 h-4" />
                  Example MCPs
                </a>
                <a href="#" className="flex items-center gap-2 text-orange-600 hover:text-orange-700">
                  <ExternalLink className="w-4 h-4" />
                  OrenGen Publishing Guide
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Server Detail Modal */}
      {serverDetailOpen && selectedServer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedServer.status === 'connected' ? 'bg-green-100' : 'bg-slate-100'
                  }`}>
                    <Server className={`w-6 h-6 ${selectedServer.status === 'connected' ? 'text-green-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{selectedServer.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={selectedServer.status} />
                      <span className="text-sm text-slate-500">v{selectedServer.version}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setServerDetailOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-slate-600">{selectedServer.description}</p>

              {selectedServer.stats && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-slate-900">{selectedServer.stats.totalCalls.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Total Calls</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedServer.stats.successRate}%</div>
                    <div className="text-xs text-green-600">Success Rate</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedServer.stats.avgLatency}ms</div>
                    <div className="text-xs text-blue-600">Avg Latency</div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Available Tools ({selectedServer.tools.length})</h3>
                <div className="space-y-2">
                  {selectedServer.tools.map(tool => (
                    <div key={tool.name} className="p-3 bg-slate-50 rounded-lg">
                      <div className="font-mono text-sm text-slate-900">{tool.name}</div>
                      <div className="text-sm text-slate-500">{tool.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedServer.resources.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Resources</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedServer.resources.map(resource => (
                      <span key={resource} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-mono">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6 border-t border-slate-200">
                {selectedServer.status === 'connected' ? (
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    <Pause className="w-4 h-4" />
                    Disconnect
                  </button>
                ) : (
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                    <Play className="w-4 h-4" />
                    Connect
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                  <Terminal className="w-4 h-4" />
                  Test Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Connect MCP Server</h2>
                <button
                  onClick={() => setConnectModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transport Type</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="stdio">stdio (Local process)</option>
                  <option value="http">HTTP/SSE</option>
                  <option value="websocket">WebSocket</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Command / URL</label>
                <input
                  type="text"
                  placeholder="npx @anthropic/mcp-server-filesystem"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Arguments (optional)</label>
                <input
                  type="text"
                  placeholder="--root /path/to/directory"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Environment Variables</label>
                <textarea
                  rows={3}
                  placeholder="KEY=value&#10;ANOTHER_KEY=another_value"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setConnectModalOpen(false)}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                <Plug className="w-4 h-4" />
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCPHub;
