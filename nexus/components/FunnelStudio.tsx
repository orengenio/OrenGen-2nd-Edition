import React, { useState } from 'react';
import { Layers, Plus, Eye, Edit3, Copy, Trash2, ExternalLink, BarChart3, MousePointer, DollarSign, Users, ArrowRight, Sparkles, Layout, Settings, Globe, Zap } from 'lucide-react';

interface Funnel {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'published' | 'paused';
  pages: number;
  visitors: number;
  conversions: number;
  revenue: number;
  domain: string;
}

const FunnelStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'funnels' | 'templates' | 'analytics'>('funnels');
  const [selectedFunnel, setSelectedFunnel] = useState<string | null>(null);

  const funnels: Funnel[] = [
    { id: '1', name: 'Lead Magnet - eBook', type: 'Lead Generation', status: 'published', pages: 2, visitors: 3420, conversions: 892, revenue: 0, domain: 'offer.mysite.com' },
    { id: '2', name: 'Webinar Registration', type: 'Webinar', status: 'published', pages: 3, visitors: 1856, conversions: 423, revenue: 0, domain: 'webinar.mysite.com' },
    { id: '3', name: 'Product Launch', type: 'Sales', status: 'draft', pages: 5, visitors: 0, conversions: 0, revenue: 0, domain: 'launch.mysite.com' },
    { id: '4', name: 'Tripwire Offer', type: 'Tripwire', status: 'published', pages: 4, visitors: 2134, conversions: 167, revenue: 7849, domain: 'special.mysite.com' },
  ];

  const templates = [
    { id: '1', name: 'Lead Magnet', desc: 'Capture leads with a free resource', pages: 2, icon: '📥', conversions: '15,420', rating: 4.8 },
    { id: '2', name: 'Webinar', desc: 'Register attendees for your webinar', pages: 3, icon: '🎤', conversions: '8,930', rating: 4.7 },
    { id: '3', name: 'Tripwire', desc: 'Convert with a low-ticket offer', pages: 4, icon: '⚡', conversions: '12,100', rating: 4.9 },
    { id: '4', name: 'Product Launch', desc: 'Build hype and sell your product', pages: 6, icon: '🚀', conversions: '6,780', rating: 4.6 },
    { id: '5', name: 'Application', desc: 'Qualify leads with an application', pages: 3, icon: '📝', conversions: '5,670', rating: 4.6 },
    { id: '6', name: 'Membership', desc: 'Recurring revenue membership', pages: 5, icon: '🎟️', conversions: '4,230', rating: 4.5 },
  ];

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-400',
    published: 'bg-green-500/20 text-green-400',
    paused: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Layers className="text-orange-500" /> Funnel Studio
          </h1>
          <p className="text-gray-400 mt-1">Build high-converting funnels with AI optimization</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Create Funnel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Visitors', value: '7,410', change: '+12%', icon: Users, color: 'text-blue-400' },
          { label: 'Conversions', value: '1,482', change: '+8%', icon: MousePointer, color: 'text-green-400' },
          { label: 'Conversion Rate', value: '20%', change: '+2%', icon: BarChart3, color: 'text-purple-400' },
          { label: 'Revenue', value: '$7,849', change: '+15%', icon: DollarSign, color: 'text-orange-400' },
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
        {['funnels', 'templates', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Funnels Tab */}
      {activeTab === 'funnels' && (
        <div className="space-y-4">
          {funnels.map(funnel => (
            <div key={funnel.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Layers className="text-orange-400" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{funnel.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[funnel.status]}`}>
                        {funnel.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>{funnel.type}</span>
                      <span>•</span>
                      <span>{funnel.pages} pages</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Globe size={12} /> {funnel.domain}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{funnel.visitors.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Visitors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{funnel.conversions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Conversions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">{funnel.visitors > 0 ? Math.round(funnel.conversions / funnel.visitors * 100) : 0}%</div>
                    <div className="text-xs text-gray-500">Rate</div>
                  </div>
                  {funnel.revenue > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">${funnel.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg" title="Edit">
                    <Edit3 size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg" title="Preview">
                    <Eye size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg" title="Analytics">
                    <BarChart3 size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg" title="Duplicate">
                    <Copy size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg" title="Visit">
                    <ExternalLink size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Funnel Flow Preview */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  {Array.from({ length: funnel.pages }).map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                        <Layout size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-400">
                          {i === 0 ? 'Landing' : i === funnel.pages - 1 ? 'Thank You' : `Page ${i + 1}`}
                        </span>
                      </div>
                      {i < funnel.pages - 1 && <ArrowRight size={16} className="text-gray-600" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <Sparkles size={32} className="text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-white">AI Funnel Generator</h3>
                <p className="text-gray-300 text-sm">Describe your offer and let AI create a complete funnel</p>
              </div>
              <button className="ml-auto px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium">
                Generate with AI
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {templates.map(tmpl => (
              <div key={tmpl.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-orange-500 transition-all cursor-pointer group">
                <div className="text-4xl mb-4">{tmpl.icon}</div>
                <h3 className="text-white font-semibold">{tmpl.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{tmpl.desc}</p>
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-gray-500">{tmpl.pages} pages</span>
                  <span className="text-gray-500">{tmpl.conversions} conversions</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`text-sm ${star <= Math.floor(tmpl.rating) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
                  ))}
                  <span className="text-gray-500 text-sm ml-1">{tmpl.rating}</span>
                </div>
                <button className="w-full mt-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Conversion Funnel</h3>
            <div className="space-y-4">
              {[
                { stage: 'Page Views', count: 7410, pct: 100 },
                { stage: 'Engaged', count: 4820, pct: 65 },
                { stage: 'Form Started', count: 2450, pct: 33 },
                { stage: 'Converted', count: 1482, pct: 20 },
              ].map((stage, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{stage.stage}</span>
                    <span className="text-white">{stage.count.toLocaleString()} ({stage.pct}%)</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-purple-500" style={{ width: `${stage.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Top Performing Funnels</h3>
            <div className="space-y-4">
              {funnels.filter(f => f.status === 'published').sort((a, b) => (b.conversions / b.visitors || 0) - (a.conversions / a.visitors || 0)).map(funnel => (
                <div key={funnel.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{funnel.name}</div>
                    <div className="text-gray-500 text-sm">{funnel.conversions.toLocaleString()} conversions</div>
                  </div>
                  <div className="text-green-400 font-bold">
                    {Math.round(funnel.conversions / funnel.visitors * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Traffic Sources</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { source: 'Facebook Ads', visitors: 3200, conversions: 640 },
                { source: 'Google Ads', visitors: 1800, conversions: 342 },
                { source: 'Organic', visitors: 1560, conversions: 280 },
                { source: 'Direct', visitors: 850, conversions: 220 },
              ].map((s, i) => (
                <div key={i} className="p-4 bg-gray-800 rounded-lg">
                  <div className="text-white font-medium">{s.source}</div>
                  <div className="text-2xl font-bold text-white mt-2">{s.visitors.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm">visitors</div>
                  <div className="text-green-400 mt-2">{Math.round(s.conversions / s.visitors * 100)}% conversion</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelStudio;
