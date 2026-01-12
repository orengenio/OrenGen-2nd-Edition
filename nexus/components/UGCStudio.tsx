import React, { useState } from 'react';
import {
  Video, Plus, Play, Pause, Upload, Download, Edit2, Trash2, Copy,
  User, Users, Sparkles, TrendingUp, Eye, Heart, MessageCircle,
  Calendar, Clock, CheckCircle, AlertCircle, Film, Mic, Camera,
  FileText, Target, Zap, LayoutGrid, List, Search, Filter, RefreshCw
} from 'lucide-react';

// Types
interface Creator {
  id: string;
  name: string;
  avatar: string;
  archetype: string;
  platform: string[];
  followers: number;
  engagement: number;
  rate: number;
  status: 'active' | 'pending' | 'inactive';
  contentCount: number;
  lastActive: string;
}

interface Script {
  id: string;
  title: string;
  archetype: string;
  hook: string;
  body: string;
  cta: string;
  duration: string;
  platform: string;
  status: 'draft' | 'approved' | 'in_production' | 'published';
  creator?: string;
}

interface Content {
  id: string;
  title: string;
  type: 'video' | 'reel' | 'story' | 'post';
  thumbnail: string;
  platform: string;
  creator: string;
  views: number;
  likes: number;
  comments: number;
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
  scheduledFor?: string;
  publishedAt?: string;
}

// Mock Data
const MOCK_CREATORS: Creator[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    avatar: 'AT',
    archetype: 'Tech Enthusiast',
    platform: ['TikTok', 'Instagram', 'YouTube'],
    followers: 125000,
    engagement: 4.8,
    rate: 500,
    status: 'active',
    contentCount: 48,
    lastActive: '2024-01-10'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'SC',
    archetype: 'Lifestyle Vlogger',
    platform: ['Instagram', 'YouTube'],
    followers: 89000,
    engagement: 6.2,
    rate: 350,
    status: 'active',
    contentCount: 32,
    lastActive: '2024-01-11'
  },
  {
    id: '3',
    name: 'Mike Roberts',
    avatar: 'MR',
    archetype: 'Product Reviewer',
    platform: ['YouTube', 'TikTok'],
    followers: 210000,
    engagement: 3.9,
    rate: 800,
    status: 'pending',
    contentCount: 85,
    lastActive: '2024-01-09'
  }
];

const ARCHETYPES = [
  { id: 'tech', name: 'Tech Enthusiast', icon: Zap, color: 'blue' },
  { id: 'lifestyle', name: 'Lifestyle Vlogger', icon: Camera, color: 'pink' },
  { id: 'reviewer', name: 'Product Reviewer', icon: Target, color: 'purple' },
  { id: 'educator', name: 'Educator', icon: FileText, color: 'green' },
  { id: 'entertainer', name: 'Entertainer', icon: Sparkles, color: 'orange' },
  { id: 'fitness', name: 'Fitness Coach', icon: TrendingUp, color: 'red' }
];

const MOCK_SCRIPTS: Script[] = [
  {
    id: '1',
    title: 'Product Launch Hook',
    archetype: 'Tech Enthusiast',
    hook: 'You won\'t believe what just dropped...',
    body: 'Introducing the latest innovation that\'s about to change everything. Here\'s why this matters to you...',
    cta: 'Link in bio for 20% off!',
    duration: '30s',
    platform: 'TikTok',
    status: 'approved',
    creator: 'Alex Thompson'
  },
  {
    id: '2',
    title: 'Tutorial Series Intro',
    archetype: 'Educator',
    hook: 'Stop making this mistake with your business...',
    body: 'I see so many people doing this wrong. Let me show you the right way in 60 seconds...',
    cta: 'Follow for more tips!',
    duration: '60s',
    platform: 'Instagram',
    status: 'draft'
  }
];

const MOCK_CONTENT: Content[] = [
  {
    id: '1',
    title: 'Product Unboxing - Series 3',
    type: 'video',
    thumbnail: '📦',
    platform: 'YouTube',
    creator: 'Alex Thompson',
    views: 12500,
    likes: 890,
    comments: 124,
    status: 'published',
    publishedAt: '2024-01-08'
  },
  {
    id: '2',
    title: 'Quick Tips Reel',
    type: 'reel',
    thumbnail: '💡',
    platform: 'Instagram',
    creator: 'Sarah Chen',
    views: 45000,
    likes: 3200,
    comments: 89,
    status: 'published',
    publishedAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Behind the Scenes',
    type: 'story',
    thumbnail: '🎬',
    platform: 'TikTok',
    creator: 'Mike Roberts',
    views: 0,
    likes: 0,
    comments: 0,
    status: 'scheduled',
    scheduledFor: '2024-01-15'
  }
];

// Components
const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-500 text-sm">{title}</span>
      <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
        <Icon size={16} className={`text-${color}-600`} />
      </div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    {trend && (
      <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
        <TrendingUp size={14} />
        <span>{trend}</span>
      </div>
    )}
  </div>
);

const CreatorCard = ({ creator }: { creator: Creator }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {creator.avatar}
        </div>
        <div>
          <h4 className="font-semibold">{creator.name}</h4>
          <p className="text-sm text-slate-500">{creator.archetype}</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        creator.status === 'active' ? 'bg-green-100 text-green-700' :
        creator.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-slate-100 text-slate-700'
      }`}>
        {creator.status}
      </span>
    </div>

    <div className="flex flex-wrap gap-1 mb-3">
      {creator.platform.map(p => (
        <span key={p} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">
          {p}
        </span>
      ))}
    </div>

    <div className="grid grid-cols-3 gap-2 text-center text-sm">
      <div className="bg-slate-50 dark:bg-slate-900 rounded p-2">
        <div className="font-semibold">{(creator.followers / 1000).toFixed(0)}K</div>
        <div className="text-xs text-slate-500">Followers</div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-900 rounded p-2">
        <div className="font-semibold">{creator.engagement}%</div>
        <div className="text-xs text-slate-500">Engagement</div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-900 rounded p-2">
        <div className="font-semibold">${creator.rate}</div>
        <div className="text-xs text-slate-500">Per Post</div>
      </div>
    </div>

    <div className="flex gap-2 mt-4">
      <button className="flex-1 px-3 py-2 bg-brand-primary text-white rounded-lg text-sm hover:bg-slate-800">
        View Profile
      </button>
      <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
        <MessageCircle size={16} />
      </button>
    </div>
  </div>
);

const ScriptCard = ({ script }: { script: Script }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-semibold">{script.title}</h4>
        <p className="text-sm text-slate-500">{script.archetype} • {script.platform}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        script.status === 'approved' ? 'bg-green-100 text-green-700' :
        script.status === 'in_production' ? 'bg-blue-100 text-blue-700' :
        script.status === 'published' ? 'bg-purple-100 text-purple-700' :
        'bg-slate-100 text-slate-700'
      }`}>
        {script.status.replace('_', ' ')}
      </span>
    </div>

    <div className="space-y-2 text-sm">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2 border-l-4 border-yellow-400">
        <span className="font-medium text-yellow-700 dark:text-yellow-400">Hook: </span>
        <span className="text-slate-600 dark:text-slate-300">{script.hook}</span>
      </div>
      <div className="bg-slate-50 dark:bg-slate-900 rounded p-2 line-clamp-2">
        {script.body}
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 rounded p-2 border-l-4 border-green-400">
        <span className="font-medium text-green-700 dark:text-green-400">CTA: </span>
        <span className="text-slate-600 dark:text-slate-300">{script.cta}</span>
      </div>
    </div>

    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Clock size={14} />
        <span>{script.duration}</span>
      </div>
      <div className="flex gap-1">
        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
          <Copy size={16} className="text-slate-500" />
        </button>
        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
          <Edit2 size={16} className="text-slate-500" />
        </button>
      </div>
    </div>
  </div>
);

const ContentCard = ({ content }: { content: Content }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
    <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-4xl">
      {content.thumbnail}
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold line-clamp-1">{content.title}</h4>
          <p className="text-sm text-slate-500">{content.creator}</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs ${
          content.status === 'published' ? 'bg-green-100 text-green-700' :
          content.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
          content.status === 'review' ? 'bg-yellow-100 text-yellow-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {content.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
        <span className="flex items-center gap-1">
          <Eye size={14} />
          {content.views.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Heart size={14} />
          {content.likes.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={14} />
          {content.comments}
        </span>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600">
          View
        </button>
        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-sm hover:bg-slate-50 dark:hover:bg-slate-700">
          <Edit2 size={14} />
        </button>
      </div>
    </div>
  </div>
);

// Main Component
const UGCStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'creators' | 'scripts' | 'content' | 'analytics'>('creators');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">UGC / Creator Studio</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage creators, scripts, and user-generated content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
            <Sparkles size={16} />
            Generate Script
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800"
          >
            <Plus size={18} />
            Add Creator
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Creators" value="12" icon={Users} color="purple" trend="+3 this month" />
        <StatCard title="Scripts Ready" value="24" icon={FileText} color="blue" />
        <StatCard title="Content Published" value="156" icon={Video} color="green" trend="+28%" />
        <StatCard title="Total Reach" value="2.4M" icon={Eye} color="orange" />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {['creators', 'scripts', 'content', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-48"
            />
          </div>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
            <Filter size={16} />
          </button>
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700' : ''}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-700' : ''}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      {activeTab === 'creators' && (
        <div className="space-y-6">
          {/* Archetypes */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold mb-3">Creator Archetypes</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {ARCHETYPES.map(arch => (
                <button
                  key={arch.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-brand-accent hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-${arch.color}-100 dark:bg-${arch.color}-900/30`}>
                    <arch.icon size={20} className={`text-${arch.color}-600`} />
                  </div>
                  <span className="text-xs text-center">{arch.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Creator Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_CREATORS.map(creator => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'scripts' && (
        <div className="space-y-6">
          {/* Script Generator */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={24} />
              <h3 className="font-bold text-lg">AI Script Generator</h3>
            </div>
            <p className="mb-4 opacity-90">
              Generate viral hooks, engaging scripts, and compelling CTAs with AI
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Describe your product or message..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 text-white"
              />
              <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90">
                Generate
              </button>
            </div>
          </div>

          {/* Scripts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SCRIPTS.map(script => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_CONTENT.map(content => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-4">Top Performing Content</h3>
              <div className="space-y-3">
                {MOCK_CONTENT.filter(c => c.status === 'published').map(c => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.thumbnail}</span>
                      <span className="text-sm truncate">{c.title}</span>
                    </div>
                    <span className="text-sm text-green-600">{c.views.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-4">Top Creators</h3>
              <div className="space-y-3">
                {MOCK_CREATORS.map(c => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        {c.avatar}
                      </div>
                      <span className="text-sm">{c.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{c.engagement}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-4">Platform Distribution</h3>
              <div className="space-y-3">
                {[
                  { name: 'TikTok', value: 45 },
                  { name: 'Instagram', value: 32 },
                  { name: 'YouTube', value: 23 }
                ].map(p => (
                  <div key={p.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{p.name}</span>
                      <span>{p.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-accent rounded-full"
                        style={{ width: `${p.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Creator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4">Add Creator</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  placeholder="Creator name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Archetype</label>
                <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                  {ARCHETYPES.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {['TikTok', 'Instagram', 'YouTube', 'Twitter'].map(p => (
                    <label key={p} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Followers</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rate ($)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    placeholder="500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-slate-800">
                Add Creator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UGCStudio;
