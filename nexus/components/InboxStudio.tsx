import React, { useState } from 'react';
import { Mail, Inbox, Send, AlertTriangle, CheckCircle, Clock, Flame, Plus, Settings, Filter, Search, Star, Archive, Trash2, Reply, ChevronRight, TrendingUp, Shield, Thermometer } from 'lucide-react';

interface EmailAccount {
  id: string;
  email: string;
  provider: 'google' | 'outlook' | 'smtp';
  status: 'active' | 'warming';
  healthScore: number;
  warmupDay: number;
  sentToday: number;
  dailyLimit: number;
}

interface EmailThread {
  id: string;
  from: string;
  company: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  sentiment: 'positive' | 'neutral' | 'negative' | 'interested';
  campaign?: string;
}

const InboxStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'accounts' | 'warmup' | 'deliverability'>('inbox');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  const accounts: EmailAccount[] = [
    { id: '1', email: 'sales@company.com', provider: 'google', status: 'active', healthScore: 92, warmupDay: 28, sentToday: 45, dailyLimit: 50 },
    { id: '2', email: 'outreach@company.com', provider: 'google', status: 'warming', healthScore: 68, warmupDay: 14, sentToday: 20, dailyLimit: 25 },
    { id: '3', email: 'team@company.io', provider: 'outlook', status: 'warming', healthScore: 55, warmupDay: 7, sentToday: 10, dailyLimit: 15 },
  ];

  const threads: EmailThread[] = [
    { id: '1', from: 'Sarah Chen', company: 'TechCorp', subject: 'Re: Partnership Opportunity', preview: 'This sounds great! Let me check with my team...', time: '2m', unread: true, starred: true, sentiment: 'positive' },
    { id: '2', from: 'Mike Johnson', company: 'Acme Inc', subject: 'Quick question about pricing', preview: 'What are your enterprise rates for...', time: '15m', unread: true, starred: false, sentiment: 'interested' },
    { id: '3', from: 'Lisa Park', company: 'Growth Labs', subject: 'Re: Follow up', preview: 'Thanks for reaching out. We are currently...', time: '1h', unread: false, starred: false, sentiment: 'neutral' },
    { id: '4', from: 'David Kim', company: 'StartupXYZ', subject: 'Not interested right now', preview: 'We just signed with another vendor...', time: '2h', unread: false, starred: false, sentiment: 'negative' },
  ];

  const sentimentColors = {
    positive: 'bg-green-500',
    interested: 'bg-blue-500',
    neutral: 'bg-gray-500',
    negative: 'bg-red-500'
  };

  const providerIcons = {
    google: '📧',
    outlook: '📬',
    smtp: '📨'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Mail className="text-orange-500" /> Inbox Studio
          </h1>
          <p className="text-gray-400 mt-1">Email warmup, deliverability & unified inbox</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium flex items-center gap-2">
            <Settings size={18} /> Settings
          </button>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium flex items-center gap-2">
            <Plus size={18} /> Add Account
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Accounts', value: '12', icon: Mail, color: 'text-blue-400' },
          { label: 'Warming', value: '5', icon: Flame, color: 'text-orange-400' },
          { label: 'Inbox Rate', value: '94%', icon: Inbox, color: 'text-green-400' },
          { label: 'Sent Today', value: '234', icon: Send, color: 'text-purple-400' },
          { label: 'Needs Reply', value: '18', icon: Reply, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <stat.icon className={stat.color} size={20} />
            <div className="mt-2">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-2">
        {['inbox', 'accounts', 'warmup', 'deliverability'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Inbox Tab */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Thread List */}
          <div className="col-span-2 space-y-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" placeholder="Search emails..." className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white" />
              </div>
              <button className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2 text-gray-400">
                <Filter size={18} /> Filter
              </button>
            </div>

            {threads.map(thread => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={`bg-gray-900 border rounded-xl p-4 cursor-pointer transition-all ${selectedThread === thread.id ? 'border-orange-500' : 'border-gray-800 hover:border-gray-700'} ${thread.unread ? 'bg-gray-900' : 'bg-gray-900/50'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${sentimentColors[thread.sentiment]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${thread.unread ? 'text-white' : 'text-gray-400'}`}>{thread.from}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500 text-sm">{thread.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {thread.starred && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                        <span className="text-gray-500 text-sm">{thread.time}</span>
                      </div>
                    </div>
                    <div className={`text-sm mt-1 ${thread.unread ? 'text-white' : 'text-gray-400'}`}>{thread.subject}</div>
                    <div className="text-gray-500 text-sm truncate mt-1">{thread.preview}</div>
                    {thread.campaign && (
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">{thread.campaign}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions & AI Suggestions */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left flex items-center gap-3">
                  <Reply size={18} className="text-blue-400" />
                  <span className="text-gray-300">Reply All Pending</span>
                </button>
                <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left flex items-center gap-3">
                  <Archive size={18} className="text-purple-400" />
                  <span className="text-gray-300">Archive Read</span>
                </button>
                <button className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left flex items-center gap-3">
                  <Star size={18} className="text-yellow-400" />
                  <span className="text-gray-300">Star Interested</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Flame size={18} className="text-orange-400" /> AI Suggested Reply
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                "Thanks for your interest! I'd love to schedule a quick call to discuss how we can help TechCorp. Does Tuesday at 2pm work?"
              </p>
              <button className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium">
                Use This Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{providerIcons[account.provider]}</span>
                  <div>
                    <div className="text-white font-medium">{account.email}</div>
                    <div className="text-gray-500 text-sm capitalize">{account.provider}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{account.healthScore}%</div>
                    <div className="text-xs text-gray-500">Health</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{account.sentToday}/{account.dailyLimit}</div>
                    <div className="text-xs text-gray-500">Sent Today</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${account.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {account.status === 'warming' ? `Day ${account.warmupDay}/28` : 'Active'}
                  </span>
                  <button className="p-2 hover:bg-gray-800 rounded-lg">
                    <Settings size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Daily Usage</span>
                  <span>{Math.round(account.sentToday / account.dailyLimit * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${account.sentToday / account.dailyLimit * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warmup Tab */}
      {activeTab === 'warmup' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Thermometer className="text-orange-400" /> Warmup Progress
            </h3>
            <div className="space-y-4">
              {accounts.filter(a => a.status === 'warming').map(account => (
                <div key={account.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">{account.email}</span>
                    <span className="text-orange-400">Day {account.warmupDay}/28</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-green-500" style={{ width: `${account.warmupDay / 28 * 100}%` }} />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{account.dailyLimit} emails/day</span>
                    <span>Target: 50/day</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Warmup Network Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Emails Exchanged', value: '2,456' },
                { label: 'Reply Rate', value: '68%' },
                { label: 'Inbox Placement', value: '94%' },
                { label: 'Network Size', value: '10,000+' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-gray-800 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deliverability Tab */}
      {activeTab === 'deliverability' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Inbox Placement by Provider</h3>
            <div className="space-y-4">
              {[
                { provider: 'Gmail', inbox: 96, spam: 3, missing: 1 },
                { provider: 'Outlook', inbox: 92, spam: 6, missing: 2 },
                { provider: 'Yahoo', inbox: 88, spam: 9, missing: 3 },
                { provider: 'Other', inbox: 85, spam: 10, missing: 5 },
              ].map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{p.provider}</span>
                    <span className="text-green-400">{p.inbox}% inbox</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div className="bg-green-500" style={{ width: `${p.inbox}%` }} />
                    <div className="bg-red-500" style={{ width: `${p.spam}%` }} />
                    <div className="bg-gray-600" style={{ width: `${p.missing}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="text-green-400" /> Domain Health
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'SPF', status: 'valid' },
                  { name: 'DKIM', status: 'valid' },
                  { name: 'DMARC', status: 'valid' },
                  { name: 'Blacklists', status: 'clean' },
                ].map((check, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-400">{check.name}</span>
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle size={14} /> {check.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-400 mt-0.5" size={20} />
                <div>
                  <h4 className="text-yellow-400 font-medium">Recommendation</h4>
                  <p className="text-gray-300 text-sm mt-1">Consider adding a custom tracking domain for improved deliverability.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxStudio;
