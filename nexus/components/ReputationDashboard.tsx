/**
 * Reputation Management Dashboard
 * Comprehensive UI for managing online reviews and reputation
 */

import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Sparkles,
  Filter,
  Search,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Globe,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit3,
  Eye,
  Settings,
  Download,
  Upload,
  Plus,
  X,
  Check
} from 'lucide-react';

// Types
interface Review {
  id: string;
  platform: 'google' | 'yelp' | 'facebook' | 'trustpilot' | 'g2' | 'capterra' | 'bbb';
  author: string;
  authorAvatar?: string;
  rating: number;
  content: string;
  date: string;
  status: 'pending' | 'responded' | 'flagged' | 'archived';
  sentiment: 'positive' | 'neutral' | 'negative';
  response?: {
    content: string;
    date: string;
    aiGenerated: boolean;
  };
  businessId: string;
}

interface ReviewRequest {
  id: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'pending' | 'sent' | 'opened' | 'completed' | 'declined';
  sentVia: 'email' | 'sms' | 'both';
  sentAt?: string;
  completedAt?: string;
  platform?: string;
}

interface ReputationStats {
  averageRating: number;
  totalReviews: number;
  reviewsThisMonth: number;
  responseRate: number;
  avgResponseTime: string;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  ratingTrend: number;
  platformBreakdown: Record<string, { count: number; avgRating: number }>;
}

// Platform icons and colors
const PLATFORM_CONFIG: Record<string, { name: string; color: string; icon: string }> = {
  google: { name: 'Google', color: '#4285F4', icon: 'G' },
  yelp: { name: 'Yelp', color: '#D32323', icon: 'Y' },
  facebook: { name: 'Facebook', color: '#1877F2', icon: 'f' },
  trustpilot: { name: 'Trustpilot', color: '#00B67A', icon: 'T' },
  g2: { name: 'G2', color: '#FF492C', icon: 'G2' },
  capterra: { name: 'Capterra', color: '#FF9D28', icon: 'C' },
  bbb: { name: 'BBB', color: '#005A8B', icon: 'BBB' }
};

// Mock data generator
const generateMockData = (): { reviews: Review[]; requests: ReviewRequest[]; stats: ReputationStats } => {
  const platforms: Review['platform'][] = ['google', 'yelp', 'facebook', 'trustpilot', 'g2', 'capterra'];
  const sentiments: Review['sentiment'][] = ['positive', 'neutral', 'negative'];
  const statuses: Review['status'][] = ['pending', 'responded', 'flagged'];

  const reviews: Review[] = [
    {
      id: '1',
      platform: 'google',
      author: 'John Smith',
      rating: 5,
      content: 'Absolutely fantastic service! The team went above and beyond to help us with our project. Highly recommend to anyone looking for quality work.',
      date: '2024-01-10',
      status: 'pending',
      sentiment: 'positive',
      businessId: 'biz-1'
    },
    {
      id: '2',
      platform: 'yelp',
      author: 'Sarah Johnson',
      rating: 4,
      content: 'Great experience overall. Quick response times and professional staff. Would use again.',
      date: '2024-01-09',
      status: 'responded',
      sentiment: 'positive',
      response: {
        content: 'Thank you so much for your kind words, Sarah! We appreciate your business and look forward to serving you again.',
        date: '2024-01-09',
        aiGenerated: true
      },
      businessId: 'biz-1'
    },
    {
      id: '3',
      platform: 'facebook',
      author: 'Mike Williams',
      rating: 2,
      content: 'Service was slower than expected. Communication could have been better.',
      date: '2024-01-08',
      status: 'flagged',
      sentiment: 'negative',
      businessId: 'biz-1'
    },
    {
      id: '4',
      platform: 'trustpilot',
      author: 'Emily Davis',
      rating: 5,
      content: 'Best in the business! They truly care about their customers.',
      date: '2024-01-07',
      status: 'responded',
      sentiment: 'positive',
      response: {
        content: 'Emily, thank you for the wonderful review! Your satisfaction is our top priority.',
        date: '2024-01-07',
        aiGenerated: false
      },
      businessId: 'biz-1'
    },
    {
      id: '5',
      platform: 'google',
      author: 'Robert Chen',
      rating: 3,
      content: 'Decent service but nothing special. Met expectations but didn\'t exceed them.',
      date: '2024-01-06',
      status: 'pending',
      sentiment: 'neutral',
      businessId: 'biz-1'
    },
    {
      id: '6',
      platform: 'g2',
      author: 'Tech Solutions Inc.',
      rating: 5,
      content: 'Perfect for our enterprise needs. The features are comprehensive and the support team is responsive.',
      date: '2024-01-05',
      status: 'pending',
      sentiment: 'positive',
      businessId: 'biz-1'
    }
  ];

  const requests: ReviewRequest[] = [
    { id: 'r1', contactName: 'Alice Brown', contactEmail: 'alice@email.com', status: 'completed', sentVia: 'email', sentAt: '2024-01-08', completedAt: '2024-01-09', platform: 'google' },
    { id: 'r2', contactName: 'Bob Wilson', contactPhone: '+1234567890', status: 'sent', sentVia: 'sms', sentAt: '2024-01-09' },
    { id: 'r3', contactName: 'Carol Martinez', contactEmail: 'carol@email.com', contactPhone: '+1987654321', status: 'opened', sentVia: 'both', sentAt: '2024-01-10' },
    { id: 'r4', contactName: 'David Lee', contactEmail: 'david@email.com', status: 'pending', sentVia: 'email' },
    { id: 'r5', contactName: 'Eva Garcia', contactEmail: 'eva@email.com', status: 'declined', sentVia: 'email', sentAt: '2024-01-05' }
  ];

  const stats: ReputationStats = {
    averageRating: 4.3,
    totalReviews: 247,
    reviewsThisMonth: 18,
    responseRate: 87,
    avgResponseTime: '2.4 hours',
    sentimentBreakdown: { positive: 78, neutral: 14, negative: 8 },
    ratingTrend: 0.3,
    platformBreakdown: {
      google: { count: 124, avgRating: 4.5 },
      yelp: { count: 45, avgRating: 4.1 },
      facebook: { count: 38, avgRating: 4.4 },
      trustpilot: { count: 22, avgRating: 4.2 },
      g2: { count: 12, avgRating: 4.6 },
      capterra: { count: 6, avgRating: 4.3 }
    }
  };

  return { reviews, requests, stats };
};

// Star Rating Component
const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
  const sizeClasses = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

// Platform Badge Component
const PlatformBadge: React.FC<{ platform: string }> = ({ platform }) => {
  const config = PLATFORM_CONFIG[platform] || { name: platform, color: '#666', icon: '?' };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white"
      style={{ backgroundColor: config.color }}
    >
      <span className="font-bold">{config.icon}</span>
      {config.name}
    </span>
  );
};

// Sentiment Badge Component
const SentimentBadge: React.FC<{ sentiment: Review['sentiment'] }> = ({ sentiment }) => {
  const config = {
    positive: { icon: ThumbsUp, bg: 'bg-green-100', text: 'text-green-700', label: 'Positive' },
    neutral: { icon: Meh, bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Neutral' },
    negative: { icon: ThumbsDown, bg: 'bg-red-100', text: 'text-red-700', label: 'Negative' }
  };
  const { icon: Icon, bg, text, label } = config[sentiment];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: Review['status'] | ReviewRequest['status'] }> = ({ status }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    responded: { bg: 'bg-green-100', text: 'text-green-700', label: 'Responded' },
    flagged: { bg: 'bg-red-100', text: 'text-red-700', label: 'Flagged' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Archived' },
    sent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
    opened: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Opened' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    declined: { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined' }
  };
  const { bg, text, label } = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
};

// Main Dashboard Component
const ReputationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'requests' | 'analytics'>('overview');
  const [data, setData] = useState<{ reviews: Review[]; requests: ReviewRequest[]; stats: ReputationStats } | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load mock data
    setData(generateMockData());
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const { reviews, requests, stats } = data;

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (filterPlatform !== 'all' && review.platform !== filterPlatform) return false;
    if (filterStatus !== 'all' && review.status !== filterStatus) return false;
    if (filterSentiment !== 'all' && review.sentiment !== filterSentiment) return false;
    if (searchQuery && !review.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !review.author.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Generate AI Response
  const handleGenerateAIResponse = async () => {
    if (!selectedReview) return;
    setAiGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses: Record<Review['sentiment'], string> = {
      positive: `Thank you so much for your wonderful review, ${selectedReview.author}! We're thrilled to hear about your positive experience. Your kind words mean the world to our team, and we're committed to maintaining the high standards that earned your trust. We look forward to serving you again!`,
      neutral: `Thank you for taking the time to share your feedback, ${selectedReview.author}. We appreciate your honest review and are always looking for ways to improve our service. If there's anything specific we can do better, please don't hesitate to reach out directly. We'd love the opportunity to exceed your expectations next time.`,
      negative: `${selectedReview.author}, thank you for bringing this to our attention. We sincerely apologize for any inconvenience you experienced. Your feedback is valuable, and we're taking immediate steps to address these concerns. Please reach out to us directly at support@company.com so we can make this right.`
    };

    setResponseText(responses[selectedReview.sentiment]);
    setAiGenerating(false);
  };

  // Submit response
  const handleSubmitResponse = () => {
    if (!selectedReview || !responseText) return;

    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: prev.reviews.map(r =>
          r.id === selectedReview.id
            ? { ...r, status: 'responded' as const, response: { content: responseText, date: new Date().toISOString(), aiGenerated: true } }
            : r
        )
      };
    });

    setResponseModalOpen(false);
    setSelectedReview(null);
    setResponseText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reputation Management</h1>
          <p className="text-slate-600">Monitor and manage your online reviews across all platforms</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setRequestModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Send className="w-4 h-4" />
            Request Review
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Average Rating</span>
            <div className={`flex items-center gap-1 text-sm ${stats.ratingTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.ratingTrend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {stats.ratingTrend >= 0 ? '+' : ''}{stats.ratingTrend}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.averageRating}</span>
            <StarRating rating={Math.round(stats.averageRating)} size="lg" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Total Reviews</span>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.totalReviews}</span>
            <span className="text-sm text-green-600">+{stats.reviewsThisMonth} this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Response Rate</span>
            <CheckCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats.responseRate}%</span>
            <span className="text-sm text-slate-500">Avg: {stats.avgResponseTime}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-600 text-sm">Sentiment</span>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-green-500 h-full" style={{ width: `${stats.sentimentBreakdown.positive}%` }} />
                <div className="bg-yellow-500 h-full" style={{ width: `${stats.sentimentBreakdown.neutral}%` }} />
                <div className="bg-red-500 h-full" style={{ width: `${stats.sentimentBreakdown.negative}%` }} />
              </div>
            </div>
            <span className="text-sm font-medium text-green-600">{stats.sentimentBreakdown.positive}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'requests', label: 'Review Requests' },
            { id: 'analytics', label: 'Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reviews */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Reviews</h2>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                View all
              </button>
            </div>
            <div className="space-y-4">
              {reviews.slice(0, 4).map(review => (
                <div key={review.id} className="border border-slate-100 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{review.author}</span>
                          <PlatformBadge platform={review.platform} />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-slate-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SentimentBadge sentiment={review.sentiment} />
                      <StatusBadge status={review.status} />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{review.content}</p>
                  {review.response ? (
                    <div className="bg-slate-50 rounded-lg p-3 border-l-2 border-orange-500">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-700">Your Response</span>
                        {review.response.aiGenerated && (
                          <span className="flex items-center gap-1 text-xs text-purple-600">
                            <Sparkles className="w-3 h-3" /> AI Generated
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{review.response.content}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setResponseModalOpen(true);
                      }}
                      className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Respond
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Platform Breakdown */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Platform Breakdown</h2>
              <div className="space-y-3">
                {Object.entries(stats.platformBreakdown).map(([platform, data]) => (
                  <div key={platform} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={platform} />
                      <span className="text-sm text-slate-600">{data.count} reviews</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-slate-900">{data.avgRating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-left">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Send className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Send Review Request</div>
                    <div className="text-xs text-slate-500">Request reviews from customers</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-left">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Connect Platform</div>
                    <div className="text-xs text-slate-500">Add new review source</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-left">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Download className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Export Report</div>
                    <div className="text-xs text-slate-500">Download reputation report</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="bg-white rounded-xl border border-slate-200">
          {/* Filters */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Platforms</option>
                {Object.keys(PLATFORM_CONFIG).map(p => (
                  <option key={p} value={p}>{PLATFORM_CONFIG[p].name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="flagged">Flagged</option>
              </select>
              <select
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="divide-y divide-slate-100">
            {filteredReviews.map(review => (
              <div key={review.id} className="p-4 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{review.author}</span>
                        <PlatformBadge platform={review.platform} />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-slate-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SentimentBadge sentiment={review.sentiment} />
                    <StatusBadge status={review.status} />
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3 ml-13">{review.content}</p>
                {review.response ? (
                  <div className="ml-13 bg-slate-50 rounded-lg p-3 border-l-2 border-orange-500">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-700">Your Response</span>
                      {review.response.aiGenerated && (
                        <span className="flex items-center gap-1 text-xs text-purple-600">
                          <Sparkles className="w-3 h-3" /> AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{review.response.content}</p>
                  </div>
                ) : (
                  <div className="ml-13 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setResponseModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Respond
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setResponseText('');
                        setResponseModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                      Manual
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition">
                      <ExternalLink className="w-4 h-4" />
                      View
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Review Request Campaigns</h2>
            <button
              onClick={() => setRequestModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {requests.map(request => (
              <div key={request.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                    {request.contactName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{request.contactName}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {request.contactEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {request.contactEmail}
                        </span>
                      )}
                      {request.contactPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {request.contactPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <StatusBadge status={request.status} />
                    <div className="text-xs text-slate-500 mt-1">
                      via {request.sentVia.toUpperCase()}
                      {request.sentAt && ` • ${request.sentAt}`}
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <button className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition">
                      Send Now
                    </button>
                  )}
                  {request.status === 'completed' && request.platform && (
                    <PlatformBadge platform={request.platform} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Rating Distribution</h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-slate-900">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Sentiment Analysis</h2>
            <div className="flex items-center justify-center h-48">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${stats.sentimentBreakdown.positive * 2.51} 251`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="20"
                    strokeDasharray={`${stats.sentimentBreakdown.neutral * 2.51} 251`}
                    strokeDashoffset={`-${stats.sentimentBreakdown.positive * 2.51}`}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                    strokeDasharray={`${stats.sentimentBreakdown.negative * 2.51} 251`}
                    strokeDashoffset={`-${(stats.sentimentBreakdown.positive + stats.sentimentBreakdown.neutral) * 2.51}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900">{stats.sentimentBreakdown.positive}%</span>
                  <span className="text-sm text-slate-500">Positive</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-slate-600">Positive ({stats.sentimentBreakdown.positive}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-slate-600">Neutral ({stats.sentimentBreakdown.neutral}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-slate-600">Negative ({stats.sentimentBreakdown.negative}%)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Platform Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.platformBreakdown).map(([platform, data]) => (
                <div key={platform} className="text-center p-4 rounded-lg border border-slate-100 hover:border-orange-200 transition">
                  <PlatformBadge platform={platform} />
                  <div className="mt-3">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-2xl font-bold text-slate-900">{data.avgRating}</span>
                    </div>
                    <div className="text-sm text-slate-500">{data.count} reviews</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {responseModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Respond to Review</h2>
                <button
                  onClick={() => {
                    setResponseModalOpen(false);
                    setSelectedReview(null);
                    setResponseText('');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Original Review */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                    {selectedReview.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{selectedReview.author}</span>
                      <PlatformBadge platform={selectedReview.platform} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={selectedReview.rating} size="sm" />
                      <span className="text-xs text-slate-500">{selectedReview.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{selectedReview.content}</p>
              </div>

              {/* Response */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Your Response</label>
                  <button
                    onClick={handleGenerateAIResponse}
                    disabled={aiGenerating}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-lg hover:bg-purple-200 transition disabled:opacity-50"
                  >
                    {aiGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate AI Response
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response here..."
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setResponseModalOpen(false);
                  setSelectedReview(null);
                  setResponseText('');
                }}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={!responseText}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Review Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Request Review</h2>
                <button
                  onClick={() => setRequestModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Send Via</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Platform</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReputationDashboard;
