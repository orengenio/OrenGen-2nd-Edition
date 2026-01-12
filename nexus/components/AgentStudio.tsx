'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Play,
  Pause,
  Settings,
  Activity,
  Zap,
  Brain,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  ChevronRight,
  BarChart3,
  Cpu,
  Network,
  Terminal,
  Code,
  FileText,
  Users,
  Target,
  Megaphone,
  PenTool,
  Shield,
} from 'lucide-react';

// Agent Types
interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: 'active' | 'idle' | 'error' | 'paused';
  description: string;
  capabilities: string[];
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  taskCount: number;
  successRate: number;
  avgResponseTime: number;
  lastActive: string;
  icon: React.ElementType;
  color: string;
}

type AgentType =
  | 'brand_guardian'
  | 'web_architect'
  | 'creator_manager'
  | 'campaign_orchestrator'
  | 'opportunity_scout'
  | 'proposal_writer'
  | 'compliance_auditor'
  | 'data_analyst'
  | 'customer_support';

interface Task {
  id: string;
  agentId: string;
  type: string;
  input: string;
  output?: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  agents: string[];
  triggers: string[];
  status: 'active' | 'paused' | 'draft';
  runsToday: number;
  successRate: number;
}

// Default Agents
const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'brand_guardian',
    name: 'Brand Guardian',
    type: 'brand_guardian',
    status: 'active',
    description: 'Enforces brand consistency across all content and assets',
    capabilities: ['Brand voice analysis', 'Content review', 'Style guide enforcement', 'Asset validation'],
    model: 'gemini-1.5-pro',
    temperature: 0.3,
    maxTokens: 4096,
    systemPrompt: 'You are a brand guardian agent. Ensure all content aligns with brand guidelines...',
    taskCount: 156,
    successRate: 98.2,
    avgResponseTime: 1.2,
    lastActive: '2 min ago',
    icon: PenTool,
    color: 'orange',
  },
  {
    id: 'web_architect',
    name: 'Web Architect',
    type: 'web_architect',
    status: 'active',
    description: 'Designs and optimizes web experiences and funnels',
    capabilities: ['Landing page design', 'UX optimization', 'Conversion analysis', 'A/B test suggestions'],
    model: 'gemini-1.5-pro',
    temperature: 0.5,
    maxTokens: 8192,
    systemPrompt: 'You are a web architect agent. Design optimal user experiences...',
    taskCount: 89,
    successRate: 95.5,
    avgResponseTime: 2.1,
    lastActive: '5 min ago',
    icon: Code,
    color: 'blue',
  },
  {
    id: 'creator_manager',
    name: 'Creator Manager',
    type: 'creator_manager',
    status: 'idle',
    description: 'Manages UGC creators and content production',
    capabilities: ['Script generation', 'Creator matching', 'Content scheduling', 'Performance tracking'],
    model: 'gemini-1.5-flash',
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: 'You are a creator manager agent. Help coordinate UGC production...',
    taskCount: 234,
    successRate: 91.3,
    avgResponseTime: 0.8,
    lastActive: '15 min ago',
    icon: Users,
    color: 'pink',
  },
  {
    id: 'campaign_orchestrator',
    name: 'Campaign Orchestrator',
    type: 'campaign_orchestrator',
    status: 'active',
    description: 'Coordinates multi-channel marketing campaigns',
    capabilities: ['Email sequences', 'SMS campaigns', 'Social scheduling', 'Performance optimization'],
    model: 'gemini-1.5-pro',
    temperature: 0.4,
    maxTokens: 4096,
    systemPrompt: 'You are a campaign orchestrator. Manage omni-channel marketing...',
    taskCount: 412,
    successRate: 94.7,
    avgResponseTime: 1.5,
    lastActive: '1 min ago',
    icon: Megaphone,
    color: 'purple',
  },
  {
    id: 'opportunity_scout',
    name: 'Opportunity Scout',
    type: 'opportunity_scout',
    status: 'active',
    description: 'Discovers and qualifies federal contracting opportunities',
    capabilities: ['SAM.gov monitoring', 'RFP analysis', 'Match scoring', 'Deadline tracking'],
    model: 'gemini-1.5-pro',
    temperature: 0.2,
    maxTokens: 8192,
    systemPrompt: 'You are an opportunity scout. Find and analyze government contracts...',
    taskCount: 78,
    successRate: 97.1,
    avgResponseTime: 3.2,
    lastActive: '30 min ago',
    icon: Target,
    color: 'emerald',
  },
  {
    id: 'proposal_writer',
    name: 'Proposal Writer',
    type: 'proposal_writer',
    status: 'idle',
    description: 'Drafts and refines proposal content for RFPs',
    capabilities: ['Technical writing', 'Compliance mapping', 'Past performance', 'Pricing support'],
    model: 'gemini-1.5-pro',
    temperature: 0.3,
    maxTokens: 16384,
    systemPrompt: 'You are a proposal writer. Create compelling government proposals...',
    taskCount: 23,
    successRate: 89.5,
    avgResponseTime: 8.5,
    lastActive: '2 hours ago',
    icon: FileText,
    color: 'indigo',
  },
  {
    id: 'compliance_auditor',
    name: 'Compliance Auditor',
    type: 'compliance_auditor',
    status: 'active',
    description: 'Reviews documents for regulatory compliance',
    capabilities: ['FAR/DFAR compliance', 'Section 508', 'Privacy review', 'Risk assessment'],
    model: 'gemini-1.5-pro',
    temperature: 0.1,
    maxTokens: 8192,
    systemPrompt: 'You are a compliance auditor. Ensure regulatory requirements are met...',
    taskCount: 45,
    successRate: 99.1,
    avgResponseTime: 2.8,
    lastActive: '10 min ago',
    icon: Shield,
    color: 'red',
  },
  {
    id: 'data_analyst',
    name: 'Data Analyst',
    type: 'data_analyst',
    status: 'active',
    description: 'Analyzes data and generates insights',
    capabilities: ['Report generation', 'Trend analysis', 'Forecasting', 'Visualization'],
    model: 'gemini-1.5-flash',
    temperature: 0.2,
    maxTokens: 4096,
    systemPrompt: 'You are a data analyst. Extract insights from business data...',
    taskCount: 189,
    successRate: 96.8,
    avgResponseTime: 1.1,
    lastActive: '3 min ago',
    icon: BarChart3,
    color: 'cyan',
  },
];

const DEFAULT_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'New Lead Qualification',
    description: 'Automatically qualify and score new leads using AI analysis',
    agents: ['data_analyst', 'campaign_orchestrator'],
    triggers: ['New lead created', 'Lead updated'],
    status: 'active',
    runsToday: 47,
    successRate: 94.5,
  },
  {
    id: 'wf-2',
    name: 'Content Review Pipeline',
    description: 'Review all content for brand consistency before publishing',
    agents: ['brand_guardian', 'compliance_auditor'],
    triggers: ['Content submitted', 'Asset uploaded'],
    status: 'active',
    runsToday: 23,
    successRate: 98.2,
  },
  {
    id: 'wf-3',
    name: 'Federal Opportunity Alert',
    description: 'Monitor SAM.gov and alert on matching opportunities',
    agents: ['opportunity_scout', 'proposal_writer'],
    triggers: ['Daily at 6 AM', 'New SAM.gov posting'],
    status: 'active',
    runsToday: 3,
    successRate: 100,
  },
];

const AgentStudio: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [workflows, setWorkflows] = useState<Workflow[]>(DEFAULT_WORKFLOWS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState<'agents' | 'workflows' | 'tasks' | 'logs'>('agents');
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Stats
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalTasks = agents.reduce((sum, a) => sum + a.taskCount, 0);
  const avgSuccessRate = agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'idle': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'paused': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    };
    return colors[color] || colors.blue;
  };

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return {
          ...agent,
          status: agent.status === 'active' ? 'paused' : 'active',
        };
      }
      return agent;
    }));
  };

  const runAgent = async (agent: Agent, input: string) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      agentId: agent.id,
      type: 'manual',
      input,
      status: 'running',
      startedAt: new Date().toISOString(),
    };

    setTasks(prev => [task, ...prev]);

    // Simulate agent execution
    setTimeout(() => {
      setTasks(prev => prev.map(t => {
        if (t.id === task.id) {
          return {
            ...t,
            status: 'completed',
            output: `Agent ${agent.name} processed: "${input.slice(0, 50)}..."`,
            completedAt: new Date().toISOString(),
          };
        }
        return t;
      }));
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-orange-500" />
              Agent Studio
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Orchestrate and manage AI workforce
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            <Plus className="w-4 h-4" />
            New Agent
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Activity className="w-4 h-4" />
              Active Agents
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {activeAgents}/{agents.length}
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Zap className="w-4 h-4" />
              Tasks Today
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalTasks.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <CheckCircle className="w-4 h-4" />
              Success Rate
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {avgSuccessRate.toFixed(1)}%
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Network className="w-4 h-4" />
              Active Workflows
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {workflows.filter(w => w.status === 'active').length}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex gap-4">
          {(['agents', 'workflows', 'tasks', 'logs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium rounded-lg transition ${
                activeTab === tab
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {agents.map(agent => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${getColorClasses(agent.color)}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {agent.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                            <span className="text-xs text-slate-500 capitalize">{agent.status}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAgentStatus(agent.id)}
                        className={`p-2 rounded-lg transition ${
                          agent.status === 'active'
                            ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {agent.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {agent.capabilities.slice(0, 3).map(cap => (
                        <span
                          key={cap}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded"
                        >
                          {cap}
                        </span>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">
                          +{agent.capabilities.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 dark:border-slate-700 pt-4">
                      <div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {agent.taskCount}
                        </div>
                        <div className="text-xs text-slate-500">Tasks</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-emerald-600">
                          {agent.successRate}%
                        </div>
                        <div className="text-xs text-slate-500">Success</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {agent.avgResponseTime}s
                        </div>
                        <div className="text-xs text-slate-500">Avg Time</div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {agent.lastActive}
                    </span>
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
                    >
                      Configure
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-4">
            {workflows.map(workflow => (
              <div
                key={workflow.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {workflow.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        workflow.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {workflow.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{workflow.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                      <Edit3 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                      <Play className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-xs text-slate-500 mb-2">Agents</div>
                    <div className="flex -space-x-2">
                      {workflow.agents.map(agentId => {
                        const agent = agents.find(a => a.id === agentId);
                        if (!agent) return null;
                        const Icon = agent.icon;
                        return (
                          <div
                            key={agentId}
                            className={`w-8 h-8 rounded-full ${getColorClasses(agent.color)} flex items-center justify-center border-2 border-white dark:border-slate-800`}
                            title={agent.name}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 mb-2">Triggers</div>
                    <div className="flex flex-wrap gap-1">
                      {workflow.triggers.map(trigger => (
                        <span
                          key={trigger}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="ml-auto text-right">
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {workflow.runsToday}
                    </div>
                    <div className="text-xs text-slate-500">runs today</div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold text-emerald-600">
                      {workflow.successRate}%
                    </div>
                    <div className="text-xs text-slate-500">success</div>
                  </div>
                </div>
              </div>
            ))}

            <button className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 hover:border-orange-400 hover:text-orange-500 transition flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Workflow
            </button>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 dark:text-white">Recent Tasks</h3>
              <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Terminal className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No recent tasks. Run an agent to see task history.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {tasks.map(task => {
                  const agent = agents.find(a => a.id === task.agentId);
                  return (
                    <div key={task.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {task.status === 'running' && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />}
                          {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          {task.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                          {task.status === 'queued' && <Clock className="w-4 h-4 text-yellow-500" />}
                          <span className="font-medium text-slate-900 dark:text-white">
                            {agent?.name || 'Unknown Agent'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {task.startedAt && new Date(task.startedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 truncate">
                        {task.input}
                      </p>
                      {task.output && (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                          {task.output}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 font-mono text-sm">
            <div className="text-slate-400 mb-2"># Agent Activity Logs</div>
            <div className="space-y-1">
              <div className="text-emerald-400">[{new Date().toISOString()}] Brand Guardian: Content review completed</div>
              <div className="text-blue-400">[{new Date().toISOString()}] Data Analyst: Report generated for Q1 metrics</div>
              <div className="text-yellow-400">[{new Date().toISOString()}] Opportunity Scout: 3 new SAM.gov opportunities found</div>
              <div className="text-purple-400">[{new Date().toISOString()}] Campaign Orchestrator: Email sequence triggered for 47 leads</div>
              <div className="text-cyan-400">[{new Date().toISOString()}] Web Architect: Landing page A/B test analysis complete</div>
            </div>
          </div>
        )}
      </div>

      {/* Agent Config Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <Settings className="w-6 h-6 text-orange-500" />
                  Configure {selectedAgent.name}
                </h2>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Model
                </label>
                <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900">
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Temperature: {selectedAgent.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue={selectedAgent.temperature}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  System Prompt
                </label>
                <textarea
                  rows={6}
                  defaultValue={selectedAgent.systemPrompt}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Test Agent
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter a test prompt..."
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
                  />
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                    Run
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentStudio;
