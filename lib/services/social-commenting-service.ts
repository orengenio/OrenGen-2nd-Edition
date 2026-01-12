/**
 * Smart Social Commenting Service
 * AI-powered authority building through strategic commenting
 * Supports: Facebook, Instagram, LinkedIn, X/Twitter, Threads, YouTube, TikTok
 */

// Types
export interface SocialProfile {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
  connected: boolean;
  connectedAt: string;
}

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'twitter'
  | 'threads'
  | 'youtube'
  | 'tiktok';

export interface TargetAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  followerCount?: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  lastEngaged?: string;
  engagementCount: number;
}

export interface DiscoveredPost {
  id: string;
  platform: SocialPlatform;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatarUrl?: string;
  content: string;
  mediaUrls?: string[];
  postUrl: string;
  publishedAt: string;
  likes: number;
  comments: number;
  shares?: number;
  relevanceScore: number;
  keywords: string[];
  suggestedComment?: string;
  status: 'discovered' | 'queued' | 'commented' | 'skipped';
}

export interface ScheduledComment {
  id: string;
  postId: string;
  platform: SocialPlatform;
  postUrl: string;
  content: string;
  tone: CommentTone;
  scheduledFor: string;
  status: 'scheduled' | 'posted' | 'failed' | 'cancelled';
  postedAt?: string;
  error?: string;
  profileId: string;
}

export type CommentTone =
  | 'helpful_expert'      // Share knowledge, provide value
  | 'curious_learner'     // Ask thoughtful questions
  | 'supportive_peer'     // Encourage and validate
  | 'thought_leader'      // Share unique perspective
  | 'friendly_networker'; // Build relationships

export interface CommentingStrategy {
  id: string;
  name: string;
  description: string;
  targetKeywords: string[];
  targetHashtags: string[];
  targetAccounts: string[];
  excludeKeywords: string[];
  platforms: SocialPlatform[];
  tones: CommentTone[];
  dailyLimit: number;
  minFollowers?: number;
  maxFollowers?: number;
  minEngagement?: number;
  schedule: {
    days: number[]; // 0-6, Sunday-Saturday
    startHour: number;
    endHour: number;
    timezone: string;
  };
  isActive: boolean;
}

export interface EngagementMetrics {
  totalComments: number;
  commentsThisWeek: number;
  commentsThisMonth: number;
  repliesReceived: number;
  profileVisits: number;
  newFollowers: number;
  leadsGenerated: number;
  topPerformingPlatform: SocialPlatform;
  avgEngagementRate: number;
}

export interface CommentTemplate {
  id: string;
  name: string;
  tone: CommentTone;
  templates: string[];
  variables: string[];
}

// AI Comment generation prompts by tone
const TONE_PROMPTS: Record<CommentTone, string> = {
  helpful_expert: `You are a knowledgeable industry expert. Generate a helpful comment that:
- Provides genuine value or insight
- References specific points from the post
- Shares relevant experience without being boastful
- Ends with a thought-provoking addition, not a question
- Sounds natural and conversational, not corporate
- Is 2-3 sentences max`,

  curious_learner: `You are a curious professional eager to learn. Generate a comment that:
- Shows genuine interest in the topic
- Asks a thoughtful, specific question
- Demonstrates you've read and understood the post
- Positions you as engaged and interested
- Is 1-2 sentences max`,

  supportive_peer: `You are a supportive industry peer. Generate a comment that:
- Validates the author's point
- Adds a brief supportive perspective
- Feels warm and genuine
- Doesn't come across as sycophantic
- Is 1-2 sentences max`,

  thought_leader: `You are a respected thought leader. Generate a comment that:
- Offers a unique perspective or insight
- Builds on the original post meaningfully
- Demonstrates deep expertise
- Invites further discussion
- Is 2-3 sentences max`,

  friendly_networker: `You are a friendly professional building relationships. Generate a comment that:
- Shows personality and warmth
- References something specific from the post
- Opens door for connection
- Feels authentic, not salesy
- Is 1-2 sentences max`,
};

// Platform-specific character limits
const PLATFORM_LIMITS: Record<SocialPlatform, number> = {
  facebook: 8000,
  instagram: 2200,
  linkedin: 1250,
  twitter: 280,
  threads: 500,
  youtube: 10000,
  tiktok: 150,
};

// Main Service Class
export class SocialCommentingService {
  private profiles: Map<string, SocialProfile> = new Map();
  private targetAccounts: Map<string, TargetAccount> = new Map();
  private strategies: Map<string, CommentingStrategy> = new Map();
  private discoveredPosts: DiscoveredPost[] = [];
  private scheduledComments: ScheduledComment[] = [];
  private postedComments: ScheduledComment[] = [];
  private tenantId: string;
  private openaiApiKey: string;

  constructor(tenantId: string, openaiApiKey: string) {
    this.tenantId = tenantId;
    this.openaiApiKey = openaiApiKey;
  }

  // Connect social profile
  connectProfile(profile: Omit<SocialProfile, 'id' | 'connected' | 'connectedAt'>): SocialProfile {
    const fullProfile: SocialProfile = {
      ...profile,
      id: `profile_${profile.platform}_${Date.now()}`,
      connected: true,
      connectedAt: new Date().toISOString(),
    };

    this.profiles.set(fullProfile.id, fullProfile);
    return fullProfile;
  }

  // Get connected profiles
  getProfiles(): SocialProfile[] {
    return Array.from(this.profiles.values());
  }

  // Add target account to monitor
  addTargetAccount(account: Omit<TargetAccount, 'id' | 'engagementCount'>): TargetAccount {
    const fullAccount: TargetAccount = {
      ...account,
      id: `target_${account.platform}_${Date.now()}`,
      engagementCount: 0,
    };

    this.targetAccounts.set(fullAccount.id, fullAccount);
    return fullAccount;
  }

  // Get target accounts
  getTargetAccounts(platform?: SocialPlatform): TargetAccount[] {
    const accounts = Array.from(this.targetAccounts.values());
    if (platform) {
      return accounts.filter(a => a.platform === platform);
    }
    return accounts;
  }

  // Create commenting strategy
  createStrategy(strategy: Omit<CommentingStrategy, 'id'>): CommentingStrategy {
    const fullStrategy: CommentingStrategy = {
      ...strategy,
      id: `strategy_${Date.now()}`,
    };

    this.strategies.set(fullStrategy.id, fullStrategy);
    return fullStrategy;
  }

  // Get strategies
  getStrategies(): CommentingStrategy[] {
    return Array.from(this.strategies.values());
  }

  // Discover relevant posts based on strategy
  async discoverPosts(strategyId: string, limit: number = 20): Promise<DiscoveredPost[]> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) {
      throw new Error('Strategy not found');
    }

    // In production, this would call platform APIs
    // For demo, generate mock discovered posts
    const posts = this.generateMockPosts(strategy, limit);

    // Score relevance and generate suggested comments
    for (const post of posts) {
      post.relevanceScore = this.calculateRelevanceScore(post, strategy);

      if (post.relevanceScore >= 70) {
        const tone = strategy.tones[Math.floor(Math.random() * strategy.tones.length)];
        post.suggestedComment = await this.generateComment(post, tone);
      }
    }

    // Sort by relevance
    posts.sort((a, b) => b.relevanceScore - a.relevanceScore);

    this.discoveredPosts = [...posts, ...this.discoveredPosts].slice(0, 100);

    return posts;
  }

  // Get discovered posts
  getDiscoveredPosts(filters?: {
    platform?: SocialPlatform;
    minRelevance?: number;
    status?: string;
  }): DiscoveredPost[] {
    let filtered = [...this.discoveredPosts];

    if (filters?.platform) {
      filtered = filtered.filter(p => p.platform === filters.platform);
    }
    if (filters?.minRelevance) {
      filtered = filtered.filter(p => p.relevanceScore >= filters.minRelevance!);
    }
    if (filters?.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    return filtered;
  }

  // Generate AI comment
  async generateComment(
    post: DiscoveredPost,
    tone: CommentTone,
    customInstructions?: string
  ): Promise<string> {
    const prompt = TONE_PROMPTS[tone];
    const maxLength = PLATFORM_LIMITS[post.platform];

    // In production, this would call OpenAI API
    // For demo, use template-based generation
    const templates = COMMENT_TEMPLATES[tone];
    let comment = templates[Math.floor(Math.random() * templates.length)];

    // Personalize based on post content
    const firstWord = post.content.split(' ')[0];
    comment = comment.replace('{topic}', this.extractTopic(post.content));
    comment = comment.replace('{insight}', 'This really resonates');

    // Ensure within platform limit
    if (comment.length > maxLength) {
      comment = comment.slice(0, maxLength - 3) + '...';
    }

    return comment;
  }

  // Schedule comment
  scheduleComment(
    postId: string,
    content: string,
    tone: CommentTone,
    scheduledFor: string,
    profileId: string
  ): ScheduledComment {
    const post = this.discoveredPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const scheduled: ScheduledComment = {
      id: `comment_${Date.now()}`,
      postId,
      platform: post.platform,
      postUrl: post.postUrl,
      content,
      tone,
      scheduledFor,
      status: 'scheduled',
      profileId,
    };

    this.scheduledComments.push(scheduled);
    post.status = 'queued';

    return scheduled;
  }

  // Get scheduled comments
  getScheduledComments(): ScheduledComment[] {
    return this.scheduledComments.filter(c => c.status === 'scheduled');
  }

  // Post comment immediately
  async postComment(commentId: string): Promise<ScheduledComment> {
    const comment = this.scheduledComments.find(c => c.id === commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    const profile = this.profiles.get(comment.profileId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    // In production, this would call platform API to post
    // For demo, simulate success
    comment.status = 'posted';
    comment.postedAt = new Date().toISOString();

    // Update post status
    const post = this.discoveredPosts.find(p => p.id === comment.postId);
    if (post) {
      post.status = 'commented';
    }

    // Update target account engagement
    const targetAccount = Array.from(this.targetAccounts.values())
      .find(a => a.platform === comment.platform);
    if (targetAccount) {
      targetAccount.engagementCount++;
      targetAccount.lastEngaged = new Date().toISOString();
    }

    this.postedComments.push(comment);

    return comment;
  }

  // Cancel scheduled comment
  cancelComment(commentId: string): void {
    const comment = this.scheduledComments.find(c => c.id === commentId);
    if (comment) {
      comment.status = 'cancelled';

      const post = this.discoveredPosts.find(p => p.id === comment.postId);
      if (post) {
        post.status = 'discovered';
      }
    }
  }

  // Skip post
  skipPost(postId: string): void {
    const post = this.discoveredPosts.find(p => p.id === postId);
    if (post) {
      post.status = 'skipped';
    }
  }

  // Get engagement metrics
  getMetrics(): EngagementMetrics {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const posted = this.postedComments.filter(c => c.status === 'posted');
    const thisWeek = posted.filter(c => new Date(c.postedAt!) > weekAgo);
    const thisMonth = posted.filter(c => new Date(c.postedAt!) > monthAgo);

    // Count by platform
    const platformCounts: Record<string, number> = {};
    for (const comment of posted) {
      platformCounts[comment.platform] = (platformCounts[comment.platform] || 0) + 1;
    }

    const topPlatform = Object.entries(platformCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] as SocialPlatform || 'linkedin';

    return {
      totalComments: posted.length,
      commentsThisWeek: thisWeek.length,
      commentsThisMonth: thisMonth.length,
      repliesReceived: Math.floor(posted.length * 0.15), // Mock 15% reply rate
      profileVisits: Math.floor(posted.length * 2.5), // Mock visits
      newFollowers: Math.floor(posted.length * 0.08), // Mock follower gain
      leadsGenerated: Math.floor(posted.length * 0.02), // Mock lead conversion
      topPerformingPlatform: topPlatform,
      avgEngagementRate: 4.2, // Mock
    };
  }

  // Calculate relevance score
  private calculateRelevanceScore(post: DiscoveredPost, strategy: CommentingStrategy): number {
    let score = 50; // Base score

    // Keyword matches
    const contentLower = post.content.toLowerCase();
    for (const keyword of strategy.targetKeywords) {
      if (contentLower.includes(keyword.toLowerCase())) {
        score += 10;
      }
    }

    // Hashtag matches
    for (const hashtag of strategy.targetHashtags) {
      if (contentLower.includes(hashtag.toLowerCase())) {
        score += 8;
      }
    }

    // Exclude keywords (negative score)
    for (const exclude of strategy.excludeKeywords) {
      if (contentLower.includes(exclude.toLowerCase())) {
        score -= 30;
      }
    }

    // Engagement bonus
    if (post.likes > 100) score += 5;
    if (post.likes > 500) score += 5;
    if (post.comments > 20) score += 5;

    // Recency bonus
    const hoursSincePost = (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60);
    if (hoursSincePost < 6) score += 15;
    else if (hoursSincePost < 24) score += 10;
    else if (hoursSincePost < 48) score += 5;

    return Math.min(Math.max(score, 0), 100);
  }

  // Extract topic from content
  private extractTopic(content: string): string {
    const words = content.split(' ').slice(0, 5);
    return words.join(' ').replace(/[^\w\s]/g, '');
  }

  // Generate mock posts for demo
  private generateMockPosts(strategy: CommentingStrategy, count: number): DiscoveredPost[] {
    const posts: DiscoveredPost[] = [];
    const authors = [
      { username: 'techguru', displayName: 'Tech Guru', followers: 15000 },
      { username: 'marketingpro', displayName: 'Marketing Pro', followers: 8500 },
      { username: 'startupfounder', displayName: 'Startup Founder', followers: 25000 },
      { username: 'salesleader', displayName: 'Sales Leader', followers: 12000 },
      { username: 'growthexpert', displayName: 'Growth Expert', followers: 9000 },
    ];

    const contentTemplates = [
      `Just published my thoughts on ${strategy.targetKeywords[0] || 'business growth'}. What strategies are working for you?`,
      `Hot take: Companies that invest in ${strategy.targetKeywords[0] || 'innovation'} see 3x better results. Here's why...`,
      `Been thinking about ${strategy.targetKeywords[0] || 'scaling'} lately. The key insight I've learned is...`,
      `Question for my network: How are you handling ${strategy.targetKeywords[0] || 'challenges'} in your business?`,
      `Sharing a framework that helped us grow 200% last quarter. Thread below...`,
    ];

    for (let i = 0; i < count; i++) {
      const platform = strategy.platforms[Math.floor(Math.random() * strategy.platforms.length)];
      const author = authors[Math.floor(Math.random() * authors.length)];
      const content = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];

      const hoursAgo = Math.floor(Math.random() * 72);
      const publishedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

      posts.push({
        id: `post_${platform}_${Date.now()}_${i}`,
        platform,
        authorUsername: author.username,
        authorDisplayName: author.displayName,
        authorAvatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${author.username}`,
        content,
        postUrl: `https://${platform}.com/${author.username}/posts/${Date.now()}`,
        publishedAt: publishedAt.toISOString(),
        likes: Math.floor(Math.random() * 500) + 10,
        comments: Math.floor(Math.random() * 50) + 2,
        shares: Math.floor(Math.random() * 30),
        relevanceScore: 0,
        keywords: strategy.targetKeywords.slice(0, 3),
        status: 'discovered',
      });
    }

    return posts;
  }
}

// Comment templates by tone
const COMMENT_TEMPLATES: Record<CommentTone, string[]> = {
  helpful_expert: [
    "Great point about {topic}. In my experience, the key differentiator is focusing on consistency over intensity. Small daily actions compound significantly over time.",
    "This resonates deeply. I'd add that the most successful implementations I've seen also prioritize feedback loops - measuring what matters and iterating quickly.",
    "Solid framework here. One nuance worth considering: context matters enormously. What works in one environment may need adaptation for another.",
  ],
  curious_learner: [
    "Fascinating perspective on {topic}. How do you see this evolving over the next 2-3 years?",
    "Really valuable insight here. What was the biggest unexpected challenge you encountered implementing this?",
    "Love this take. Curious - what would you do differently if you were starting from scratch today?",
  ],
  supportive_peer: [
    "Couldn't agree more. This is exactly the kind of thinking our industry needs more of.",
    "Well said. Your point about {topic} especially resonates - it's often overlooked but critical.",
    "This is gold. Thanks for sharing your experience so openly.",
  ],
  thought_leader: [
    "Interesting angle. I'd push back slightly on one aspect - while {topic} matters, I've found the upstream decisions often have more leverage. The system design determines the outcomes.",
    "Building on this: the second-order effects are where the real opportunity lies. Most people optimize for the obvious; the edge comes from anticipating what happens next.",
    "Nuanced take that deserves more attention. The conventional wisdom here is often backwards - constraint breeds creativity more than resources do.",
  ],
  friendly_networker: [
    "Love seeing this perspective! Your content consistently delivers value. Would be great to connect and exchange ideas sometime.",
    "This hit home for me. Going through something similar right now. Appreciate you sharing your journey.",
    "Always learn something from your posts. Keep crushing it!",
  ],
};

// Factory function
export function createSocialCommentingService(
  tenantId: string,
  openaiApiKey: string
): SocialCommentingService {
  return new SocialCommentingService(tenantId, openaiApiKey);
}

// Default strategy templates
export const STRATEGY_TEMPLATES: Partial<CommentingStrategy>[] = [
  {
    name: 'B2B Thought Leadership',
    description: 'Establish authority in B2B space through expert commentary',
    targetKeywords: ['b2b', 'enterprise', 'saas', 'scaling', 'growth'],
    targetHashtags: ['#b2b', '#saas', '#startup', '#entrepreneurship'],
    platforms: ['linkedin', 'twitter'],
    tones: ['thought_leader', 'helpful_expert'],
    dailyLimit: 10,
  },
  {
    name: 'Tech Community Builder',
    description: 'Build relationships in tech community',
    targetKeywords: ['tech', 'engineering', 'development', 'coding', 'AI'],
    targetHashtags: ['#tech', '#coding', '#AI', '#machinelearning'],
    platforms: ['twitter', 'linkedin', 'threads'],
    tones: ['curious_learner', 'supportive_peer'],
    dailyLimit: 15,
  },
  {
    name: 'Industry Networker',
    description: 'Broad networking across platforms',
    targetKeywords: ['business', 'leadership', 'strategy', 'innovation'],
    targetHashtags: ['#leadership', '#business', '#entrepreneur'],
    platforms: ['linkedin', 'facebook', 'instagram'],
    tones: ['friendly_networker', 'supportive_peer'],
    dailyLimit: 20,
  },
];
