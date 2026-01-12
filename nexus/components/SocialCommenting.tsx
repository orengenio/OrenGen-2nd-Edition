/**
 * Smart Social Commenting Dashboard
 * AI-powered authority building through strategic social media engagement
 */

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Target,
  Users,
  Zap,
  Globe,
  Heart,
  Share2,
  Eye,
  BarChart3,
  Plus,
  Settings,
  X,
  ChevronRight,
  ExternalLink,
  Copy,
  Edit3,
  Trash2,
  Play,
  Pause,
  MoreVertical,
  Hash,
  AtSign,
  Bookmark,
  Award
} from 'lucide-react';

// Types
type Platform = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'threads' | 'youtube' | 'tiktok';
type CommentTone = 'helpful_expert' | 'curious_learner' | 'supportive_peer' | 'thought_leader' | 'friendly_networker';
type CommentStatus = 'draft' | 'scheduled' | 'posted' | 'failed';

interface SocialProfile {
  id: string;
  platform: Platform;
  username: string;
  displayName: string;
  avatar?: string;
  connected: boolean;
  followers: number;
}

interface CommentStrategy {
  id: string;
  name: string;
  description: string;
  platforms: Platform[];
  keywords: string[];
  hashtags: string[];
  targetAccounts: string[];
  tone: CommentTone;
  dailyLimit: number;
  active: boolean;
  stats: {
    postsFound: number;
    commentsPosted: number;
    engagementRate: number;
    leadsGenerated: number;
  };
}

interface DiscoveredPost {
  id: string;
  platform: Platform;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  content: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  postedAt: string;
  matchedKeywords: string[];
  engagementScore: number;
  url: string;
}

interface ScheduledComment {
  id: string;
  postId: string;
  post: DiscoveredPost;
  content: string;
  tone: CommentTone;
  status: CommentStatus;
  scheduledFor?: string;
  postedAt?: string;
  profileId: string;
  engagement?: {
    likes: number;
    replies: number;
  };
}

// Platform configuration
const PLATFORM_CONFIG: Record<Platform, { name: string; color: string; icon: string }> = {
  facebook: { name: 'Facebook', color: '#1877F2', icon: 'f' },
  instagram: { name: 'Instagram', color: '#E4405F', icon: 'IG' },
  linkedin: { name: 'LinkedIn', color: '#0A66C2', icon: 'in' },
  twitter: { name: 'X/Twitter', color: '#000000', icon: 'X' },
  threads: { name: 'Threads', color: '#000000', icon: '@' },
  youtube: { name: 'YouTube', color: '#FF0000', icon: 'YT' },
  tiktok: { name: 'TikTok', color: '#000000', icon: 'TT' }
};

const TONE_CONFIG: Record<CommentTone, { label: string; description: string; icon: React.ComponentType<any>; color: string }> = {
  helpful_expert: { label: 'Helpful Expert', description: 'Share knowledge and provide value', icon: Award, color: 'bg-blue-100 text-blue-700' },
  curious_learner: { label: 'Curious Learner', description: 'Ask thoughtful questions', icon: Search, color: 'bg-purple-100 text-purple-700' },
  supportive_peer: { label: 'Supportive Peer', description: 'Encourage and validate', icon: Heart, color: 'bg-pink-100 text-pink-700' },
  thought_leader: { label: 'Thought Leader', description: 'Share unique insights', icon: Zap, color: 'bg-orange-100 text-orange-700' },
  friendly_networker: { label: 'Friendly Networker', description: 'Build connections', icon: Users, color: 'bg-green-100 text-green-700' }
};

// Mock data
const generateMockData = () => {
  const profiles: SocialProfile[] = [
    { id: 'p1', platform: 'linkedin', username: 'johndoe', displayName: 'John Doe', connected: true, followers: 5420 },
    { id: 'p2', platform: 'twitter', username: 'johnd_biz', displayName: 'John Doe', connected: true, followers: 3200 },
    { id: 'p3', platform: 'facebook', username: 'johndoebusiness', displayName: 'John Doe Business', connected: true, followers: 1850 },
    { id: 'p4', platform: 'instagram', username: 'johnd.business', displayName: 'John D.', connected: false, followers: 890 },
    { id: 'p5', platform: 'threads', username: 'johnd.business', displayName: 'John D.', connected: true, followers: 450 }
  ];

  const strategies: CommentStrategy[] = [
    {
      id: 's1',
      name: 'Real Estate Authority',
      description: 'Engage with real estate discussions to build authority',
      platforms: ['linkedin', 'facebook', 'twitter'],
      keywords: ['home buying', 'real estate market', 'mortgage rates', 'first time buyer', 'housing market'],
      hashtags: ['#realestate', '#homebuying', '#realtor', '#property'],
      targetAccounts: ['@zillow', '@redfin', '@realtor'],
      tone: 'helpful_expert',
      dailyLimit: 10,
      active: true,
      stats: { postsFound: 156, commentsPosted: 87, engagementRate: 12.4, leadsGenerated: 8 }
    },
    {
      id: 's2',
      name: 'Industry Networking',
      description: 'Connect with industry peers and thought leaders',
      platforms: ['linkedin', 'twitter'],
      keywords: ['business growth', 'entrepreneurship', 'startup', 'small business'],
      hashtags: ['#entrepreneur', '#smallbusiness', '#business'],
      targetAccounts: ['@garyvee', '@richardbranson'],
      tone: 'friendly_networker',
      dailyLimit: 15,
      active: true,
      stats: { postsFound: 234, commentsPosted: 145, engagementRate: 8.7, leadsGenerated: 12 }
    },
    {
      id: 's3',
      name: 'Local Community',
      description: 'Engage with local community content',
      platforms: ['facebook', 'instagram'],
      keywords: ['local business', 'community event', 'neighborhood'],
      hashtags: ['#localbusiness', '#community', '#supportlocal'],
      targetAccounts: [],
      tone: 'supportive_peer',
      dailyLimit: 8,
      active: false,
      stats: { postsFound: 45, commentsPosted: 23, engagementRate: 15.2, leadsGenerated: 3 }
    }
  ];

  const discoveredPosts: DiscoveredPost[] = [
    {
      id: 'dp1',
      platform: 'linkedin',
      authorName: 'Sarah Johnson',
      authorHandle: '@sarahjohnson',
      content: 'Just closed on my first home! The market is tough but persistence pays off. Any tips for new homeowners? #homebuying #firsttimehomebuyer',
      hashtags: ['#homebuying', '#firsttimehomebuyer'],
      likes: 234,
      comments: 45,
      shares: 12,
      postedAt: '2024-01-10T14:30:00Z',
      matchedKeywords: ['first time buyer', 'home buying'],
      engagementScore: 92,
      url: 'https://linkedin.com/post/123'
    },
    {
      id: 'dp2',
      platform: 'twitter',
      authorName: 'Mike Chen',
      authorHandle: '@mikechen',
      content: 'Seeing a lot of movement in the housing market this week. Interest rates are shifting - what do you all think is coming next? 📈🏠',
      hashtags: ['#realestate', '#housingmarket'],
      likes: 89,
      comments: 32,
      shares: 8,
      postedAt: '2024-01-10T10:15:00Z',
      matchedKeywords: ['housing market', 'mortgage rates'],
      engagementScore: 78,
      url: 'https://twitter.com/mikechen/status/123'
    },
    {
      id: 'dp3',
      platform: 'facebook',
      authorName: 'Downtown Realtors Group',
      authorHandle: 'DowntownRealtors',
      content: 'Weekly market update: Inventory is up 15% this month! Great news for buyers. Schedule a consultation to find your dream home.',
      hashtags: ['#realtor', '#property'],
      likes: 156,
      comments: 28,
      shares: 34,
      postedAt: '2024-01-09T16:45:00Z',
      matchedKeywords: ['real estate market'],
      engagementScore: 85,
      url: 'https://facebook.com/post/456'
    },
    {
      id: 'dp4',
      platform: 'threads',
      authorName: 'Property Insider',
      authorHandle: '@propertyinsider',
      content: 'Hot take: The best time to buy a house is when you can afford it, not when the market tells you to. What do you think? 🏡',
      hashtags: ['#realestate', '#homebuying'],
      likes: 423,
      comments: 89,
      shares: 56,
      postedAt: '2024-01-10T08:00:00Z',
      matchedKeywords: ['home buying'],
      engagementScore: 95,
      url: 'https://threads.net/propertyinsider/post/123'
    }
  ];

  const scheduledComments: ScheduledComment[] = [
    {
      id: 'sc1',
      postId: 'dp1',
      post: discoveredPosts[0],
      content: "Congratulations on your first home! 🎉 One tip that helped me: set up an emergency fund for unexpected repairs - they always come when you least expect them. Welcome to homeownership!",
      tone: 'helpful_expert',
      status: 'scheduled',
      scheduledFor: '2024-01-10T15:00:00Z',
      profileId: 'p1'
    },
    {
      id: 'sc2',
      postId: 'dp2',
      post: discoveredPosts[1],
      content: "Great observation! I'm seeing similar trends in my area. The key indicator I watch is inventory levels - when they start rising faster than buyer demand, that's when things get interesting. What market are you tracking?",
      tone: 'thought_leader',
      status: 'posted',
      postedAt: '2024-01-10T11:30:00Z',
      profileId: 'p2',
      engagement: { likes: 12, replies: 3 }
    },
    {
      id: 'sc3',
      postId: 'dp4',
      post: discoveredPosts[3],
      content: "Couldn't agree more! Timing the market is nearly impossible. Financial readiness beats market timing every time. Though I'd add: having a great local agent who knows the micro-markets can help you spot opportunities others miss.",
      tone: 'helpful_expert',
      status: 'draft',
      profileId: 'p5'
    }
  ];

  return { profiles, strategies, discoveredPosts, scheduledComments };
};

// Components
const PlatformBadge: React.FC<{ platform: Platform }> = ({ platform }) => {
  const config = PLATFORM_CONFIG[platform];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white"
      style={{ backgroundColor: config.color }}
    >
      {config.icon}
    </span>
  );
};

const ToneBadge: React.FC<{ tone: CommentTone }> = ({ tone }) => {
  const config = TONE_CONFIG[tone];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const StatusBadge: React.FC<{ status: CommentStatus }> = ({ status }) => {
  const config: Record<CommentStatus, { bg: string; text: string; icon: React.ComponentType<any> }> = {
    draft: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Edit3 },
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
    posted: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
    failed: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle }
  };
  const { bg, text, icon: Icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Main Component
const SocialCommenting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'queue' | 'strategies' | 'analytics'>('discover');
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [selectedPost, setSelectedPost] = useState<DiscoveredPost | null>(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState<CommentTone>('helpful_expert');
  const [generatedComment, setGeneratedComment] = useState('');
  const [generating, setGenerating] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

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

  const { profiles, strategies, discoveredPosts, scheduledComments } = data;

  // Stats
  const totalCommentsPosted = strategies.reduce((sum, s) => sum + s.stats.commentsPosted, 0);
  const totalLeads = strategies.reduce((sum, s) => sum + s.stats.leadsGenerated, 0);
  const avgEngagement = strategies.length > 0
    ? (strategies.reduce((sum, s) => sum + s.stats.engagementRate, 0) / strategies.length).toFixed(1)
    : '0';

  // Generate AI comment
  const handleGenerateComment = async () => {
    if (!selectedPost) return;
    setGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const toneResponses: Record<CommentTone, string> = {
      helpful_expert: `Great insight! One thing I'd add from my experience: ${selectedPost.matchedKeywords[0]} is definitely a factor, but don't overlook the importance of local market conditions. Happy to share more specific data if helpful!`,
      curious_learner: `This is fascinating! I've been following this topic closely. What factors do you think are most influencing ${selectedPost.matchedKeywords[0]} trends right now? Would love to hear your perspective.`,
      supportive_peer: `Love this take! 👏 You're spot on about ${selectedPost.matchedKeywords[0]}. Thanks for sharing your insights - this is exactly the kind of content that helps everyone in the industry.`,
      thought_leader: `Interesting perspective. I've been analyzing ${selectedPost.matchedKeywords[0]} data for the past quarter, and the trends suggest we're at an inflection point. The key metric to watch is inventory velocity - it's telling a different story than headline numbers.`,
      friendly_networker: `Great post! I've been meaning to connect with more folks discussing ${selectedPost.matchedKeywords[0]}. Would love to chat more about your experience in this space. Always great to find like-minded professionals! 🤝`
    };

    setGeneratedComment(toneResponses[selectedTone]);
    setGenerating(false);
  };

  // Add comment to queue
  const handleAddToQueue = () => {
    if (!selectedPost || !generatedComment) return;

    const newComment: ScheduledComment = {
      id: `sc-${Date.now()}`,
      postId: selectedPost.id,
      post: selectedPost,
      content: generatedComment,
      tone: selectedTone,
      status: 'draft',
      profileId: profiles.find(p => p.platform === selectedPost.platform && p.connected)?.id || profiles[0].id
    };

    setData(prev => prev ? {
      ...prev,
      scheduledComments: [...prev.scheduledComments, newComment]
    } : prev);

    setCommentModalOpen(false);
    setSelectedPost(null);
    setGeneratedComment('');
    setActiveTab('queue');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Smart Social Commenting</h1>
          <p className="text-slate-600">Build authority through AI-powered strategic engagement</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setStrategyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            New Strategy
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Active Strategies</span>
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{strategies.filter(s => s.active).length}</span>
            <span className="text-sm text-slate-500">of {strategies.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Comments Posted</span>
            <MessageCircle className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-slate-900">{totalCommentsPosted}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Avg Engagement</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900">{avgEngagement}%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Leads Generated</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-3xl font-bold text-green-600">{totalLeads}</span>
        </div>
      </div>

      {/* Connected Profiles */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Connected Profiles</h2>
        <div className="flex flex-wrap gap-4">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                profile.connected ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                <span
                  className="text-sm font-bold text-white rounded-full w-6 h-6 flex items-center justify-center"
                  style={{ backgroundColor: PLATFORM_CONFIG[profile.platform].color }}
                >
                  {PLATFORM_CONFIG[profile.platform].icon}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{profile.displayName}</span>
                  {profile.connected ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  @{profile.username} • {profile.followers.toLocaleString()} followers
                </div>
              </div>
            </div>
          ))}
          <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:border-orange-500 hover:text-orange-600 transition">
            <Plus className="w-5 h-5" />
            Connect Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'discover', label: 'Discover Posts', icon: Search },
            { id: 'queue', label: 'Comment Queue', icon: Clock },
            { id: 'strategies', label: 'Strategies', icon: Target },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
      {activeTab === 'discover' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Platforms</option>
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Discovered Posts */}
          <div className="space-y-4">
            {discoveredPosts
              .filter(post => filterPlatform === 'all' || post.platform === filterPlatform)
              .map(post => (
                <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-lg">
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{post.authorName}</span>
                          <PlatformBadge platform={post.platform} />
                        </div>
                        <div className="text-sm text-slate-500">{post.authorHandle}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        <Zap className="w-3 h-3" />
                        {post.engagementScore}% match
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(post.postedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-700 mb-3">{post.content}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                        <Hash className="w-3 h-3" />
                        {tag.replace('#', '')}
                      </span>
                    ))}
                    {post.matchedKeywords.map(keyword => (
                      <span key={keyword} className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        <CheckCircle className="w-3 h-3" />
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {post.shares}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-slate-600 text-sm hover:bg-slate-100 rounded-lg transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Post
                      </a>
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setCommentModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
                      >
                        <Sparkles className="w-4 h-4" />
                        Create Comment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Comment Queue</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>{scheduledComments.filter(c => c.status === 'draft').length} drafts</span>
              <span>•</span>
              <span>{scheduledComments.filter(c => c.status === 'scheduled').length} scheduled</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {scheduledComments.map(comment => (
              <div key={comment.id} className="p-4 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <PlatformBadge platform={comment.post.platform} />
                    <span className="text-sm font-medium text-slate-900">
                      Reply to {comment.post.authorName}
                    </span>
                    <StatusBadge status={comment.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <ToneBadge tone={comment.tone} />
                    {comment.scheduledFor && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(comment.scheduledFor).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-slate-600 line-clamp-2">{comment.post.content}</p>
                </div>

                <div className="border-l-2 border-orange-500 pl-3 mb-3">
                  <p className="text-sm text-slate-700">{comment.content}</p>
                </div>

                {comment.engagement && (
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {comment.engagement.likes} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {comment.engagement.replies} replies
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {comment.status === 'draft' && (
                    <>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition">
                        <Send className="w-3 h-3" />
                        Post Now
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition">
                        <Calendar className="w-3 h-3" />
                        Schedule
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition">
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                    </>
                  )}
                  {comment.status === 'scheduled' && (
                    <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition">
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  )}
                  {comment.status === 'posted' && (
                    <a
                      href={comment.post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-slate-600 text-sm hover:bg-slate-100 rounded-lg transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on {PLATFORM_CONFIG[comment.post.platform].name}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'strategies' && (
        <div className="space-y-4">
          {strategies.map(strategy => (
            <div key={strategy.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">{strategy.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      strategy.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {strategy.active ? 'Active' : 'Paused'}
                    </span>
                    <ToneBadge tone={strategy.tone} />
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{strategy.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`p-2 rounded-lg transition ${
                      strategy.active ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {strategy.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                    <Settings className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{strategy.stats.postsFound}</div>
                  <div className="text-xs text-slate-500">Posts Found</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{strategy.stats.commentsPosted}</div>
                  <div className="text-xs text-slate-500">Comments Posted</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{strategy.stats.engagementRate}%</div>
                  <div className="text-xs text-slate-500">Engagement Rate</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{strategy.stats.leadsGenerated}</div>
                  <div className="text-xs text-slate-500">Leads Generated</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-slate-500 mr-2">Platforms:</span>
                  <span className="space-x-1">
                    {strategy.platforms.map(p => (
                      <PlatformBadge key={p} platform={p} />
                    ))}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 mr-2">Daily Limit:</span>
                  <span className="font-medium text-slate-700">{strategy.dailyLimit}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                  {strategy.keywords.slice(0, 5).map(keyword => (
                    <span key={keyword} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      {keyword}
                    </span>
                  ))}
                  {strategy.keywords.length > 5 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                      +{strategy.keywords.length - 5} more
                    </span>
                  )}
                  {strategy.hashtags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance by Platform</h2>
            <div className="space-y-4">
              {Object.entries(PLATFORM_CONFIG).slice(0, 5).map(([platform, config]) => {
                const comments = scheduledComments.filter(c => c.post.platform === platform && c.status === 'posted').length;
                const engagement = Math.random() * 20;
                return (
                  <div key={platform} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: config.color }}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900">{config.name}</span>
                        <span className="text-sm text-slate-600">{comments} comments</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${engagement * 5}%`, backgroundColor: config.color }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{engagement.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Engagement by Tone</h2>
            <div className="space-y-4">
              {Object.entries(TONE_CONFIG).map(([tone, config]) => {
                const engagementRate = 5 + Math.random() * 15;
                return (
                  <div key={tone} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color.split(' ')[0]}`}>
                      <config.icon className={`w-5 h-5 ${config.color.split(' ')[1]}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-slate-900">{config.label}</span>
                        <span className="text-sm text-orange-600">{engagementRate.toFixed(1)}% avg</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${engagementRate * 5}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Best Performing Comments</h2>
            <div className="space-y-4">
              {scheduledComments
                .filter(c => c.status === 'posted' && c.engagement)
                .sort((a, b) => (b.engagement?.likes || 0) - (a.engagement?.likes || 0))
                .slice(0, 3)
                .map(comment => (
                  <div key={comment.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PlatformBadge platform={comment.post.platform} />
                      <ToneBadge tone={comment.tone} />
                      <span className="text-sm text-slate-500">
                        on {new Date(comment.postedAt!).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{comment.content}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        {comment.engagement?.likes} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        {comment.engagement?.replies} replies
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {commentModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Create Comment</h2>
                <button
                  onClick={() => {
                    setCommentModalOpen(false);
                    setSelectedPost(null);
                    setGeneratedComment('');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Original Post */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                    {selectedPost.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{selectedPost.authorName}</span>
                      <PlatformBadge platform={selectedPost.platform} />
                    </div>
                    <span className="text-xs text-slate-500">{selectedPost.authorHandle}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{selectedPost.content}</p>
              </div>

              {/* Tone Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">Comment Tone</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(TONE_CONFIG).map(([tone, config]) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone as CommentTone)}
                      className={`p-3 rounded-lg border text-left transition ${
                        selectedTone === tone
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-slate-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <config.icon className={`w-4 h-4 ${selectedTone === tone ? 'text-orange-600' : 'text-slate-500'}`} />
                        <span className={`text-sm font-medium ${selectedTone === tone ? 'text-orange-600' : 'text-slate-700'}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{config.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate & Edit */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Your Comment</label>
                  <button
                    onClick={handleGenerateComment}
                    disabled={generating}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-lg hover:bg-purple-200 transition disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate AI Comment
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={generatedComment}
                  onChange={(e) => setGeneratedComment(e.target.value)}
                  placeholder="Write your comment here or generate one with AI..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
                <p className="text-xs text-slate-500">
                  {generatedComment.length}/500 characters
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setCommentModalOpen(false);
                  setSelectedPost(null);
                  setGeneratedComment('');
                }}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToQueue}
                disabled={!generatedComment}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Modal */}
      {strategyModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">New Commenting Strategy</h2>
                <button
                  onClick={() => setStrategyModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Strategy Name</label>
                <input
                  type="text"
                  placeholder="e.g., Real Estate Authority Building"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe your engagement strategy..."
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                    <label key={key} className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" />
                      <span className="text-sm">{config.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Keywords (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., real estate, home buying, mortgage"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Default Tone</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {Object.entries(TONE_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Daily Comment Limit</label>
                <input
                  type="number"
                  defaultValue={10}
                  min={1}
                  max={50}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setStrategyModalOpen(false)}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Create Strategy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialCommenting;
