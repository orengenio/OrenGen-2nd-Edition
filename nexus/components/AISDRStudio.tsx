import React, { useState } from 'react';
import { Bot, MessageSquare, Calendar, Target, TrendingUp, Play, Pause, Settings, Plus, Users, Mail, Linkedin, Phone, ChevronRight, Clock, CheckCircle, AlertCircle, Zap, Filter, BarChart3 } from 'lucide-react';

interface SDRAgent {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'paused';
  conversations: number;
  meetings: number;
  conversionRate: number;
  sentiment: { positive: number; neutral: number; negative: number };
}

interface Conversation {
  id: string;
  lead: string;
  company: string;
  channel: 'email' | 'linkedin' | 'sms';
  status: 'active' | 'replied' | 'meeting_scheduled';
  lastMessage: string;
  sentiment: 'positive' | 'neutral' | 'interested';
  time: string;
}

const AISDRStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'conversations' | 'sequences' | 'analytics'>('agents');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents: SDRAgent[] = [
    { id: '1', name: 'Sofia', avatar: '👩‍💼', status: 'active', conversations: 156, meetings: 23, conversionRate: 14.7, sentiment: { positive: 65, neutral: 28, negative: 7 } },
    { id: '2', name: 'Marcus', avatar: '👨‍💼', status: 'active', conversations: 89, meetings: 12, conversionRate: 13.5, sentiment: { positive: 58, neutral: 35, negative: 7 } },
  ];

  const conversations: Conversation[] = [
    { id: '1', lead: 'Sarah Chen', company: 'TechCorp', channel: 'email', status: 'meeting_scheduled', lastMessage: 'Great, Tuesday at 2pm works!', sentiment: 'positive', time: '5m ago' },
    { id: '2', lead: 'Mike Johnson', company: 'Acme Inc', channel: 'linkedin', status: 'active', lastMessage: 'Tell me more about pricing...', sentiment: 'interested', time: '12m ago' },
    { id: '3', lead: 'Lisa Park', company: 'Growth Labs', channel: 'email', status: 'replied', lastMessage: 'What makes you different from...', sentiment: 'neutral', time: '1h ago' },
  ];

  const channelIcons = { email: Mail, linkedin: Linkedin, sms: Phone };
  const sentimentColors = { positive: 'text-green-400', neutral: 'text-gray-400', interested: 'text-blue-400', negative: 'text-red-400' };
  const statusColors = { active: 'bg-yellow-500/20 text-yellow-400', replied: 'bg-blue-500/20 text-blue-400', meeting_scheduled: 'bg-green-500/20 text-green-400' };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bot className="text-orange-500" /> AI SDR Studio
          </h1>
          <p className="text-gray-400 mt-1">Autonomous sales agents that book meetings while you sleep</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Create SDR Agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Conversations', value: '245', change: '+12%', icon: MessageSquare, color: 'text-blue-400' },
          { label: 'Meetings Booked', value: '35', change: '+23%', icon: Calendar, color: 'text-green-400' },
          { label: 'Avg Response Time', value: '2.3m', change: '-15%', icon: Clock, color: 'text-purple-400' },
          { label: 'Conversion Rate', value: '14.2%', change: '+5%', icon: Target, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <stat.icon className={stat.color} size={20} />
              <span className="text-green-400 text-sm">{stat.change}</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {['agents', 'conversations', 'sequences', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-2 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">
                    {agent.avatar}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{agent.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg">
                    {agent.status === 'active' ? <Pause size={18} className="text-gray-400" /> : <Play size={18} className="text-green-400" />}
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg">
                    <Settings size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{agent.conversations}</div>
                  <div className="text-xs text-gray-500">Conversations</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{agent.meetings}</div>
                  <div className="text-xs text-gray-500">Meetings</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-400">{agent.conversionRate}%</div>
                  <div className="text-xs text-gray-500">Conversion</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Lead Sentiment</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500" style={{ width: `${agent.sentiment.positive}%` }} />
                  <div className="bg-gray-500" style={{ width: `${agent.sentiment.neutral}%` }} />
                  <div className="bg-red-500" style={{ width: `${agent.sentiment.negative}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">{agent.sentiment.positive}% Positive</span>
                  <span className="text-gray-400">{agent.sentiment.neutral}% Neutral</span>
                  <span className="text-red-400">{agent.sentiment.negative}% Negative</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'conversations' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input type="text" placeholder="Search conversations..." className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white" />
            </div>
            <button className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2 text-gray-400">
              <Filter size={18} /> Filter
            </button>
          </div>

          <div className="space-y-2">
            {conversations.map(conv => {
              const ChannelIcon = channelIcons[conv.channel];
              return (
                <div key={conv.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                        <ChannelIcon size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{conv.lead}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400 text-sm">{conv.company}</span>
                        </div>
                        <div className="text-gray-500 text-sm truncate max-w-md">{conv.lastMessage}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[conv.status]}`}>
                        {conv.status.replace('_', ' ')}
                      </span>
                      <span className={`text-sm ${sentimentColors[conv.sentiment]}`}>
                        {conv.sentiment === 'positive' && <CheckCircle size={16} />}
                        {conv.sentiment === 'interested' && <Zap size={16} />}
                      </span>
                      <span className="text-gray-500 text-sm">{conv.time}</span>
                      <ChevronRight className="text-gray-600" size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'sequences' && (
        <div className="grid grid-cols-2 gap-6">
          {[
            { name: 'Cold Outreach - Tech', steps: 5, active: 234, replied: 45, meetings: 12 },
            { name: 'Follow-up Sequence', steps: 3, active: 156, replied: 38, meetings: 8 },
            { name: 'Re-engagement', steps: 4, active: 89, replied: 22, meetings: 4 },
          ].map((seq, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{seq.name}</h3>
                <span className="text-xs text-gray-500">{seq.steps} steps</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl font-bold text-white">{seq.active}</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-400">{seq.replied}</div>
                  <div className="text-xs text-gray-500">Replied</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-400">{seq.meetings}</div>
                  <div className="text-xs text-gray-500">Meetings</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              {[
                { stage: 'Contacted', count: 1000, pct: 100 },
                { stage: 'Engaged', count: 450, pct: 45 },
                { stage: 'Qualified', count: 180, pct: 18 },
                { stage: 'Meeting Booked', count: 35, pct: 3.5 },
              ].map((stage, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{stage.stage}</span>
                    <span className="text-white">{stage.count} ({stage.pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${stage.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Top Objections Handled</h3>
            <div className="space-y-3">
              {[
                { objection: 'Price/Budget', count: 89, success: 72 },
                { objection: 'Timing', count: 67, success: 58 },
                { objection: 'Competition', count: 45, success: 34 },
                { objection: 'Authority', count: 34, success: 28 },
              ].map((obj, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-400">{obj.objection}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white">{obj.count}</span>
                    <span className="text-green-400 text-sm">({Math.round(obj.success / obj.count * 100)}% overcome)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISDRStudio;
