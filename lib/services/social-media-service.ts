/**
 * Social Media Integration Service
 * Unified interface for posting and analytics across major social platforms
 * Supports: Facebook, Instagram, LinkedIn, Twitter/X, TikTok
 */

// Types
export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  account_id: string;
  account_name: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  connected_at: string;
  status: 'active' | 'expired' | 'disconnected';
  tenant_id: string;
}

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok';

export interface SocialPost {
  id?: string;
  platforms: SocialPlatform[];
  content: string;
  media?: SocialMedia[];
  scheduled_at?: string;
  published_at?: string;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  results?: PostResult[];
  tenant_id?: string;
}

export interface SocialMedia {
  type: 'image' | 'video' | 'carousel';
  url: string;
  thumbnail_url?: string;
  alt_text?: string;
}

export interface PostResult {
  platform: SocialPlatform;
  success: boolean;
  post_id?: string;
  post_url?: string;
  error?: string;
  published_at?: string;
}

export interface SocialAnalytics {
  platform: SocialPlatform;
  followers: number;
  following: number;
  posts_count: number;
  engagement_rate: number;
  impressions_30d: number;
  reach_30d: number;
  top_posts: TopPost[];
}

export interface TopPost {
  post_id: string;
  content: string;
  thumbnail?: string;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  published_at: string;
}

// Platform-specific posting configurations
interface PlatformConfig {
  maxLength: number;
  supportsImages: boolean;
  supportsVideos: boolean;
  supportsCarousel: boolean;
  hashtagLimit?: number;
  apiUrl: string;
}

const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformConfig> = {
  facebook: {
    maxLength: 63206,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: true,
    apiUrl: 'https://graph.facebook.com/v18.0',
  },
  instagram: {
    maxLength: 2200,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: true,
    hashtagLimit: 30,
    apiUrl: 'https://graph.facebook.com/v18.0',
  },
  linkedin: {
    maxLength: 3000,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: true,
    apiUrl: 'https://api.linkedin.com/v2',
  },
  twitter: {
    maxLength: 280,
    supportsImages: true,
    supportsVideos: true,
    supportsCarousel: false,
    apiUrl: 'https://api.twitter.com/2',
  },
  tiktok: {
    maxLength: 2200,
    supportsImages: false,
    supportsVideos: true,
    supportsCarousel: false,
    apiUrl: 'https://open.tiktokapis.com/v2',
  },
};

// Platform Providers
class FacebookProvider {
  private accessToken: string;
  private pageId: string;

  constructor(account: SocialAccount & { page_id?: string }) {
    this.accessToken = account.access_token;
    this.pageId = account.page_id || account.account_id;
  }

  async post(content: string, media?: SocialMedia[]): Promise<PostResult> {
    try {
      const endpoint = `${PLATFORM_CONFIGS.facebook.apiUrl}/${this.pageId}/feed`;

      const body: any = {
        message: content,
        access_token: this.accessToken,
      };

      // Handle media attachments
      if (media && media.length > 0) {
        if (media[0].type === 'image') {
          body.link = media[0].url;
        }
        // Video requires different endpoint
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        return { platform: 'facebook', success: false, error: error.error?.message };
      }

      const data = await response.json();
      return {
        platform: 'facebook',
        success: true,
        post_id: data.id,
        post_url: `https://facebook.com/${data.id}`,
        published_at: new Date().toISOString(),
      };
    } catch (error: any) {
      return { platform: 'facebook', success: false, error: error.message };
    }
  }

  async getAnalytics(): Promise<Partial<SocialAnalytics>> {
    try {
      const response = await fetch(
        `${PLATFORM_CONFIGS.facebook.apiUrl}/${this.pageId}?fields=followers_count,fan_count&access_token=${this.accessToken}`
      );

      if (!response.ok) return { platform: 'facebook', followers: 0 };

      const data = await response.json();
      return {
        platform: 'facebook',
        followers: data.followers_count || data.fan_count || 0,
      };
    } catch {
      return { platform: 'facebook', followers: 0 };
    }
  }
}

class InstagramProvider {
  private accessToken: string;
  private accountId: string;

  constructor(account: SocialAccount) {
    this.accessToken = account.access_token;
    this.accountId = account.account_id;
  }

  async post(content: string, media?: SocialMedia[]): Promise<PostResult> {
    try {
      // Instagram requires media for posts
      if (!media || media.length === 0) {
        return { platform: 'instagram', success: false, error: 'Instagram requires media' };
      }

      const apiUrl = PLATFORM_CONFIGS.instagram.apiUrl;

      // Step 1: Create media container
      const containerEndpoint = `${apiUrl}/${this.accountId}/media`;
      const containerBody: any = {
        caption: content,
        access_token: this.accessToken,
      };

      if (media[0].type === 'image') {
        containerBody.image_url = media[0].url;
      } else if (media[0].type === 'video') {
        containerBody.media_type = 'REELS';
        containerBody.video_url = media[0].url;
      }

      const containerResponse = await fetch(containerEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(containerBody),
      });

      if (!containerResponse.ok) {
        const error = await containerResponse.json();
        return { platform: 'instagram', success: false, error: error.error?.message };
      }

      const containerData = await containerResponse.json();

      // Step 2: Publish the container
      const publishEndpoint = `${apiUrl}/${this.accountId}/media_publish`;
      const publishResponse = await fetch(publishEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: this.accessToken,
        }),
      });

      if (!publishResponse.ok) {
        const error = await publishResponse.json();
        return { platform: 'instagram', success: false, error: error.error?.message };
      }

      const publishData = await publishResponse.json();
      return {
        platform: 'instagram',
        success: true,
        post_id: publishData.id,
        post_url: `https://instagram.com/p/${publishData.id}`,
        published_at: new Date().toISOString(),
      };
    } catch (error: any) {
      return { platform: 'instagram', success: false, error: error.message };
    }
  }

  async getAnalytics(): Promise<Partial<SocialAnalytics>> {
    try {
      const response = await fetch(
        `${PLATFORM_CONFIGS.instagram.apiUrl}/${this.accountId}?fields=followers_count,media_count&access_token=${this.accessToken}`
      );

      if (!response.ok) return { platform: 'instagram', followers: 0 };

      const data = await response.json();
      return {
        platform: 'instagram',
        followers: data.followers_count || 0,
        posts_count: data.media_count || 0,
      };
    } catch {
      return { platform: 'instagram', followers: 0 };
    }
  }
}

class LinkedInProvider {
  private accessToken: string;
  private personUrn: string;

  constructor(account: SocialAccount) {
    this.accessToken = account.access_token;
    this.personUrn = `urn:li:person:${account.account_id}`;
  }

  async post(content: string, media?: SocialMedia[]): Promise<PostResult> {
    try {
      const endpoint = `${PLATFORM_CONFIGS.linkedin.apiUrl}/ugcPosts`;

      const body: any = {
        author: this.personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: content },
            shareMediaCategory: media && media.length > 0 ? 'IMAGE' : 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      if (media && media.length > 0 && media[0].type === 'image') {
        body.specificContent['com.linkedin.ugc.ShareContent'].media = [{
          status: 'READY',
          originalUrl: media[0].url,
        }];
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        return { platform: 'linkedin', success: false, error: error.message };
      }

      const postId = response.headers.get('x-restli-id') || 'unknown';
      return {
        platform: 'linkedin',
        success: true,
        post_id: postId,
        post_url: `https://linkedin.com/feed/update/${postId}`,
        published_at: new Date().toISOString(),
      };
    } catch (error: any) {
      return { platform: 'linkedin', success: false, error: error.message };
    }
  }

  async getAnalytics(): Promise<Partial<SocialAnalytics>> {
    try {
      const response = await fetch(
        `${PLATFORM_CONFIGS.linkedin.apiUrl}/me?projection=(id,firstName,lastName)`,
        {
          headers: { 'Authorization': `Bearer ${this.accessToken}` },
        }
      );

      if (!response.ok) return { platform: 'linkedin', followers: 0 };

      // LinkedIn doesn't expose follower count easily in basic API
      return { platform: 'linkedin', followers: 0 };
    } catch {
      return { platform: 'linkedin', followers: 0 };
    }
  }
}

class TwitterProvider {
  private accessToken: string;

  constructor(account: SocialAccount) {
    this.accessToken = account.access_token;
  }

  async post(content: string, media?: SocialMedia[]): Promise<PostResult> {
    try {
      // Truncate to Twitter limit
      const truncatedContent = content.slice(0, PLATFORM_CONFIGS.twitter.maxLength);

      const body: any = { text: truncatedContent };

      // Handle media (would need media upload first in production)
      if (media && media.length > 0) {
        // Twitter requires media to be uploaded separately first
        // This is a simplified version
      }

      const response = await fetch(`${PLATFORM_CONFIGS.twitter.apiUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        return { platform: 'twitter', success: false, error: error.detail || error.title };
      }

      const data = await response.json();
      return {
        platform: 'twitter',
        success: true,
        post_id: data.data.id,
        post_url: `https://twitter.com/i/web/status/${data.data.id}`,
        published_at: new Date().toISOString(),
      };
    } catch (error: any) {
      return { platform: 'twitter', success: false, error: error.message };
    }
  }

  async getAnalytics(): Promise<Partial<SocialAnalytics>> {
    try {
      const response = await fetch(
        `${PLATFORM_CONFIGS.twitter.apiUrl}/users/me?user.fields=public_metrics`,
        {
          headers: { 'Authorization': `Bearer ${this.accessToken}` },
        }
      );

      if (!response.ok) return { platform: 'twitter', followers: 0 };

      const data = await response.json();
      return {
        platform: 'twitter',
        followers: data.data?.public_metrics?.followers_count || 0,
        following: data.data?.public_metrics?.following_count || 0,
        posts_count: data.data?.public_metrics?.tweet_count || 0,
      };
    } catch {
      return { platform: 'twitter', followers: 0 };
    }
  }
}

class TikTokProvider {
  private accessToken: string;
  private openId: string;

  constructor(account: SocialAccount) {
    this.accessToken = account.access_token;
    this.openId = account.account_id;
  }

  async post(content: string, media?: SocialMedia[]): Promise<PostResult> {
    // TikTok requires video uploads through their Content Posting API
    if (!media || media[0].type !== 'video') {
      return { platform: 'tiktok', success: false, error: 'TikTok requires video content' };
    }

    try {
      // In production, this would use TikTok's Content Posting API
      // which requires video upload and processing
      return {
        platform: 'tiktok',
        success: false,
        error: 'TikTok posting requires video upload flow',
      };
    } catch (error: any) {
      return { platform: 'tiktok', success: false, error: error.message };
    }
  }

  async getAnalytics(): Promise<Partial<SocialAnalytics>> {
    try {
      const response = await fetch(
        `${PLATFORM_CONFIGS.tiktok.apiUrl}/user/info/?fields=follower_count,following_count,video_count`,
        {
          headers: { 'Authorization': `Bearer ${this.accessToken}` },
        }
      );

      if (!response.ok) return { platform: 'tiktok', followers: 0 };

      const data = await response.json();
      return {
        platform: 'tiktok',
        followers: data.data?.user?.follower_count || 0,
        following: data.data?.user?.following_count || 0,
        posts_count: data.data?.user?.video_count || 0,
      };
    } catch {
      return { platform: 'tiktok', followers: 0 };
    }
  }
}

// Main Social Media Service
export class SocialMediaService {
  private accounts: Map<string, SocialAccount> = new Map();

  constructor(accounts: SocialAccount[] = []) {
    accounts.forEach(acc => {
      this.accounts.set(`${acc.platform}_${acc.id}`, acc);
    });
  }

  // Add account
  addAccount(account: SocialAccount): void {
    this.accounts.set(`${account.platform}_${account.id}`, account);
  }

  // Get account for platform
  getAccount(platform: SocialPlatform): SocialAccount | undefined {
    for (const account of this.accounts.values()) {
      if (account.platform === platform && account.status === 'active') {
        return account;
      }
    }
    return undefined;
  }

  // Get all accounts
  getAllAccounts(): SocialAccount[] {
    return Array.from(this.accounts.values());
  }

  // Get provider for platform
  private getProvider(platform: SocialPlatform, account: SocialAccount): any {
    switch (platform) {
      case 'facebook':
        return new FacebookProvider(account);
      case 'instagram':
        return new InstagramProvider(account);
      case 'linkedin':
        return new LinkedInProvider(account);
      case 'twitter':
        return new TwitterProvider(account);
      case 'tiktok':
        return new TikTokProvider(account);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // Validate content for platform
  validateContent(platform: SocialPlatform, content: string, media?: SocialMedia[]): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const config = PLATFORM_CONFIGS[platform];
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check content length
    if (content.length > config.maxLength) {
      errors.push(`Content exceeds ${platform} limit of ${config.maxLength} characters`);
    }

    // Check media support
    if (media && media.length > 0) {
      const mediaType = media[0].type;
      if (mediaType === 'image' && !config.supportsImages) {
        errors.push(`${platform} does not support images`);
      }
      if (mediaType === 'video' && !config.supportsVideos) {
        errors.push(`${platform} does not support videos`);
      }
      if (mediaType === 'carousel' && !config.supportsCarousel) {
        errors.push(`${platform} does not support carousels`);
      }
    }

    // Platform-specific validations
    if (platform === 'instagram' && (!media || media.length === 0)) {
      errors.push('Instagram requires at least one image or video');
    }

    if (platform === 'tiktok' && (!media || media[0].type !== 'video')) {
      errors.push('TikTok requires video content');
    }

    // Warnings
    if (content.length > config.maxLength * 0.9) {
      warnings.push('Content is close to the character limit');
    }

    const hashtagCount = (content.match(/#\w+/g) || []).length;
    if (platform === 'instagram' && config.hashtagLimit && hashtagCount > config.hashtagLimit) {
      warnings.push(`Instagram allows max ${config.hashtagLimit} hashtags`);
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  // Post to single platform
  async postToSingle(
    platform: SocialPlatform,
    content: string,
    media?: SocialMedia[]
  ): Promise<PostResult> {
    const account = this.getAccount(platform);
    if (!account) {
      return {
        platform,
        success: false,
        error: `No active ${platform} account connected`,
      };
    }

    // Validate content
    const validation = this.validateContent(platform, content, media);
    if (!validation.valid) {
      return {
        platform,
        success: false,
        error: validation.errors.join('; '),
      };
    }

    const provider = this.getProvider(platform, account);
    return provider.post(content, media);
  }

  // Post to multiple platforms
  async postToMultiple(post: SocialPost): Promise<PostResult[]> {
    const results: PostResult[] = [];

    for (const platform of post.platforms) {
      const result = await this.postToSingle(platform, post.content, post.media);
      results.push(result);

      // Small delay between posts
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  // Schedule a post (store for later posting)
  async schedulePost(post: SocialPost): Promise<SocialPost> {
    // In production, this would store to database and use job queue
    return {
      ...post,
      id: `post_${Date.now()}`,
      status: 'scheduled',
    };
  }

  // Get analytics for platform
  async getAnalytics(platform: SocialPlatform): Promise<Partial<SocialAnalytics>> {
    const account = this.getAccount(platform);
    if (!account) {
      return { platform, followers: 0 };
    }

    const provider = this.getProvider(platform, account);
    return provider.getAnalytics();
  }

  // Get analytics for all connected platforms
  async getAllAnalytics(): Promise<Partial<SocialAnalytics>[]> {
    const connectedPlatforms = new Set<SocialPlatform>();

    for (const account of this.accounts.values()) {
      if (account.status === 'active') {
        connectedPlatforms.add(account.platform);
      }
    }

    const results: Partial<SocialAnalytics>[] = [];

    for (const platform of connectedPlatforms) {
      const analytics = await this.getAnalytics(platform);
      results.push(analytics);
    }

    return results;
  }

  // Adapt content for platform
  adaptContent(
    content: string,
    targetPlatform: SocialPlatform,
    sourcePlatform?: SocialPlatform
  ): string {
    const config = PLATFORM_CONFIGS[targetPlatform];
    let adapted = content;

    // Truncate if needed
    if (adapted.length > config.maxLength) {
      adapted = adapted.slice(0, config.maxLength - 3) + '...';
    }

    // Platform-specific adaptations
    if (targetPlatform === 'twitter') {
      // Remove excess hashtags for Twitter
      const hashtags = adapted.match(/#\w+/g) || [];
      if (hashtags.length > 5) {
        // Keep only first 3 hashtags
        hashtags.slice(3).forEach(tag => {
          adapted = adapted.replace(tag, '');
        });
        adapted = adapted.replace(/\s+/g, ' ').trim();
      }
    }

    if (targetPlatform === 'linkedin') {
      // LinkedIn prefers professional tone - this would use AI in production
      adapted = adapted.replace(/!!+/g, '!');
    }

    return adapted.trim();
  }

  // Get platform limits
  getPlatformLimits(platform: SocialPlatform): PlatformConfig {
    return PLATFORM_CONFIGS[platform];
  }

  // Generate post preview
  generatePreviews(content: string, platforms: SocialPlatform[]): Map<SocialPlatform, string> {
    const previews = new Map<SocialPlatform, string>();

    for (const platform of platforms) {
      const adapted = this.adaptContent(content, platform);
      previews.set(platform, adapted);
    }

    return previews;
  }
}

// OAuth URL generators for connecting accounts
export const oauthUrls = {
  facebook: (clientId: string, redirectUri: string, state: string) =>
    `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish`,

  instagram: (clientId: string, redirectUri: string, state: string) =>
    `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=instagram_basic,instagram_content_publish`,

  linkedin: (clientId: string, redirectUri: string, state: string) =>
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=w_member_social`,

  twitter: (clientId: string, redirectUri: string, state: string) =>
    `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=tweet.read%20tweet.write%20users.read&code_challenge=challenge&code_challenge_method=plain`,

  tiktok: (clientId: string, redirectUri: string, state: string) =>
    `https://www.tiktok.com/auth/authorize/?client_key=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=user.info.basic,video.publish`,
};

// Factory function
export function createSocialMediaService(accounts?: SocialAccount[]): SocialMediaService {
  return new SocialMediaService(accounts);
}

// Content templates for common post types
export const postTemplates = {
  productLaunch: (product: string, link: string) => ({
    content: `We're excited to announce ${product}! Check it out: ${link}`,
    hashtags: ['#launch', '#newproduct'],
  }),

  blogPromotion: (title: string, link: string) => ({
    content: `New blog post: "${title}"\n\nRead more: ${link}`,
    hashtags: ['#blog', '#content'],
  }),

  testimonial: (quote: string, author: string) => ({
    content: `"${quote}"\n\n- ${author}`,
    hashtags: ['#testimonial', '#customerlove'],
  }),

  behindTheScenes: (description: string) => ({
    content: `Behind the scenes: ${description}`,
    hashtags: ['#bts', '#behindthescenes'],
  }),

  tip: (tip: string, topic: string) => ({
    content: `${topic} tip: ${tip}`,
    hashtags: [`#${topic.toLowerCase().replace(/\s+/g, '')}`, '#tips'],
  }),
};
