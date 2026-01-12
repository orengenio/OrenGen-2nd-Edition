import React, { useState } from 'react';
import { Megaphone, Plus, Wand2, Image, Video, LayoutGrid, BarChart3, DollarSign, MousePointer, Eye, TrendingUp, Copy, Download, Play, Pause, Settings, Filter, Sparkles } from 'lucide-react';

interface AdCreative {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'google' | 'tiktok' | 'linkedin';
  type: 'image' | 'video' | 'carousel';
  status: 'draft' | 'active' | 'paused';
  headline: string;
  preview: string;
  metrics?: { impressions: number; clicks: number; ctr: number; spend: number; conversions: number };
}

const AdStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'creatives' | 'generate' | 'campaigns' | 'analytics'>('creatives');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'instagram']);

  const creatives: AdCreative[] = [
    { id: '1', name: 'Product Launch - v1', platform: 'facebook', type: 'image', status: 'active', headline: 'Introducing the future of...', preview: '🖼️', metrics: { impressions: 45200, clicks: 1820, ctr: 4.02, spend: 234, conversions: 89 } },
    { id: '2', name: 'Social Proof Ad', platform: 'instagram', type: 'video', status: 'active', headline: 'See why 10,000+ love...', preview: '🎬', metrics: { impressions: 32100, clicks: 1456, ctr: 4.53, spend: 189, conversions: 67 } },
    { id: '3', name: 'Comparison Ad', platform: 'google', type: 'image', status: 'paused', headline: 'Why choose us over...', preview: '🖼️', metrics: { impressions: 18500, clicks: 645, ctr: 3.48, spend: 120, conversions: 32 } },
    { id: '4', name: 'TikTok UGC Style', platform: 'tiktok', type: 'video', status: 'active', headline: 'POV: You just found...', preview: '🎬', metrics: { impressions: 89000, clicks: 4230, ctr: 4.75, spend: 156, conversions: 112 } },
  ];

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘', formats: ['Feed', 'Story', 'Reels'] },
    { id: 'instagram', name: 'Instagram', icon: '📷', formats: ['Feed', 'Story', 'Reels'] },
    { id: 'google', name: 'Google', icon: '🔍', formats: ['Display', 'Responsive', 'Video'] },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', formats: ['In-Feed', 'TopView'] },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', formats: ['Sponsored', 'Message'] },
    { id: 'youtube', name: 'YouTube', icon: '▶️', formats: ['Skippable', 'Bumper', 'Display'] },
  ];

  const templates = [
    { name: 'Product Showcase', icon: '🛍️', desc: 'Highlight product features' },
    { name: 'Social Proof', icon: '⭐', desc: 'Customer testimonials' },
    { name: 'Sale/Discount', icon: '🏷️', desc: 'Limited time offers' },
    { name: 'UGC Style', icon: '📱', desc: 'User-generated feel' },
    { name: 'Comparison', icon: '⚖️', desc: 'Vs. competitors' },
    { name: 'Problem/Solution', icon: '💡', desc: 'Pain point focused' },
  ];

  const platformColors: Record<string, string> = {
    facebook: 'bg-blue-500/20 text-blue-400',
    instagram: 'bg-pink-500/20 text-pink-400',
    google: 'bg-red-500/20 text-red-400',
    tiktok: 'bg-cyan-500/20 text-cyan-400',
    linkedin: 'bg-blue-600/20 text-blue-300',
    youtube: 'bg-red-600/20 text-red-400'
  };

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-400',
    active: 'bg-green-500/20 text-green-400',
    paused: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Megaphone className="text-orange-500" /> Ad Studio
          </h1>
          <p className="text-gray-400 mt-1">AI-powered ad creation & optimization</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium flex items-center gap-2">
          <Wand2 size={18} /> Generate Ads
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total Spend', value: '$699', icon: DollarSign, color: 'text-green-400' },
          { label: 'Impressions', value: '184.8K', icon: Eye, color: 'text-blue-400' },
          { label: 'Clicks', value: '8,151', icon: MousePointer, color: 'text-purple-400' },
          { label: 'Avg CTR', value: '4.41%', icon: TrendingUp, color: 'text-orange-400' },
          { label: 'Conversions', value: '300', icon: BarChart3, color: 'text-cyan-400' },
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
        {['creatives', 'generate', 'campaigns', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Creatives Tab */}
      {activeTab === 'creatives' && (
        <div className="grid grid-cols-2 gap-6">
          {creatives.map(creative => (
            <div key={creative.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
              <div className="aspect-video bg-gray-800 flex items-center justify-center text-6xl relative">
                {creative.preview}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${platformColors[creative.platform]}`}>
                    {creative.platform}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[creative.status]}`}>
                    {creative.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  {creative.type === 'video' ? <Video size={16} className="text-white/50" /> : <Image size={16} className="text-white/50" />}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium">{creative.name}</h3>
                <p className="text-gray-500 text-sm mt-1 truncate">"{creative.headline}"</p>

                {creative.metrics && (
                  <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-800">
                    <div className="text-center">
                      <div className="text-sm font-bold text-white">{(creative.metrics.impressions / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-gray-500">Impr</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-white">{creative.metrics.clicks.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-400">{creative.metrics.ctr}%</div>
                      <div className="text-xs text-gray-500">CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-orange-400">{creative.metrics.conversions}</div>
                      <div className="text-xs text-gray-500">Conv</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center justify-center gap-1">
                    <Copy size={14} /> Duplicate
                  </button>
                  <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center justify-center gap-1">
                    <Download size={14} /> Export
                  </button>
                  <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
                    {creative.status === 'active' ? <Pause size={14} className="text-yellow-400" /> : <Play size={14} className="text-green-400" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Product Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Product Name</label>
                  <input type="text" placeholder="e.g., OrenGen Platform" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Description</label>
                  <textarea placeholder="Describe your product/service..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-24 resize-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Key Benefits (comma separated)</label>
                  <input type="text" placeholder="e.g., Save time, Increase revenue, Automate tasks" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Target Audience</label>
                  <input type="text" placeholder="e.g., B2B SaaS founders, Marketing agencies" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Platforms & Formats</h3>
              <div className="grid grid-cols-3 gap-3">
                {platforms.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                    className={`p-4 rounded-xl border text-left transition-all ${selectedPlatforms.includes(p.id) ? 'border-orange-500 bg-orange-500/10' : 'border-gray-800 bg-gray-800 hover:border-gray-700'}`}
                  >
                    <div className="text-2xl mb-2">{p.icon}</div>
                    <div className="text-white font-medium">{p.name}</div>
                    <div className="text-gray-500 text-xs mt-1">{p.formats.join(', ')}</div>
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 rounded-xl font-bold flex items-center justify-center gap-2">
              <Sparkles size={20} /> Generate Ad Creatives
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Templates</h3>
              <div className="space-y-2">
                {templates.map((t, i) => (
                  <button key={i} className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left flex items-center gap-3">
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <div className="text-white text-sm">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4">
              <h4 className="text-white font-medium mb-2">Pro Tips</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Be specific about your target audience</li>
                <li>• Include 3-5 key benefits</li>
                <li>• Select multiple platforms for variety</li>
                <li>• AI will generate 3 variants per format</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {[
            { name: 'Q1 Product Launch', status: 'active', budget: '$5,000', spent: '$2,340', platforms: ['facebook', 'instagram'], performance: { roas: 3.2, cpa: 12 } },
            { name: 'Retargeting - Website', status: 'active', budget: '$1,500', spent: '$890', platforms: ['facebook', 'google'], performance: { roas: 4.8, cpa: 8 } },
            { name: 'Brand Awareness', status: 'paused', budget: '$3,000', spent: '$1,200', platforms: ['youtube', 'tiktok'], performance: { roas: 1.5, cpa: 25 } },
          ].map((campaign, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-white font-semibold">{campaign.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {campaign.status}
                  </span>
                  <div className="flex gap-1">
                    {campaign.platforms.map(p => (
                      <span key={p} className={`px-2 py-0.5 rounded-full text-xs ${platformColors[p]}`}>{p}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{campaign.spent}</div>
                    <div className="text-xs text-gray-500">of {campaign.budget}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{campaign.performance.roas}x</div>
                    <div className="text-xs text-gray-500">ROAS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">${campaign.performance.cpa}</div>
                    <div className="text-xs text-gray-500">CPA</div>
                  </div>
                  <button className="p-2 hover:bg-gray-800 rounded-lg">
                    <Settings size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Performance by Platform</h3>
            <div className="space-y-4">
              {[
                { platform: 'TikTok', icon: '🎵', ctr: 4.75, roas: 4.2 },
                { platform: 'Instagram', icon: '📷', ctr: 4.53, roas: 3.8 },
                { platform: 'Facebook', icon: '📘', ctr: 4.02, roas: 3.5 },
                { platform: 'Google', icon: '🔍', ctr: 3.48, roas: 2.9 },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-white">{p.platform}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-green-400 font-bold">{p.ctr}%</div>
                      <div className="text-xs text-gray-500">CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-400 font-bold">{p.roas}x</div>
                      <div className="text-xs text-gray-500">ROAS</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Top Performing Creatives</h3>
            <div className="space-y-4">
              {creatives.filter(c => c.metrics).sort((a, b) => (b.metrics?.ctr || 0) - (a.metrics?.ctr || 0)).slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.preview}</span>
                    <div>
                      <div className="text-white text-sm">{c.name}</div>
                      <div className="text-gray-500 text-xs">{c.platform}</div>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">{c.metrics?.ctr}% CTR</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdStudio;
