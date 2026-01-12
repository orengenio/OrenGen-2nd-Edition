import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  SocialMediaService,
  createSocialMediaService,
  SocialAccount,
  SocialPlatform,
  postTemplates,
} from '@/lib/services/social-media-service';

describe('SocialMediaService', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let service: SocialMediaService;

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;

    const accounts: SocialAccount[] = [
      {
        id: 'fb-1',
        platform: 'facebook',
        account_id: 'page-123',
        account_name: 'Test Page',
        access_token: 'fb-token-123',
        connected_at: new Date().toISOString(),
        status: 'active',
        tenant_id: 'tenant-1',
      },
      {
        id: 'tw-1',
        platform: 'twitter',
        account_id: 'user-456',
        account_name: '@testuser',
        access_token: 'tw-token-456',
        connected_at: new Date().toISOString(),
        status: 'active',
        tenant_id: 'tenant-1',
      },
    ];

    service = createSocialMediaService(accounts);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Content Validation', () => {
    it('should validate Twitter character limit', () => {
      const validation = service.validateContent(
        'twitter',
        'A'.repeat(300)
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain(
        'Content exceeds twitter limit of 280 characters'
      );
    });

    it('should pass validation for valid content', () => {
      const validation = service.validateContent(
        'facebook',
        'This is a valid Facebook post'
      );

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should require media for Instagram', () => {
      const validation = service.validateContent(
        'instagram',
        'Post without media'
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain(
        'Instagram requires at least one image or video'
      );
    });

    it('should require video for TikTok', () => {
      const validation = service.validateContent(
        'tiktok',
        'Post content',
        [{ type: 'image', url: 'https://example.com/img.jpg' }]
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('TikTok requires video content');
    });

    it('should warn about content near limit', () => {
      const validation = service.validateContent(
        'twitter',
        'A'.repeat(260) // 260 characters, close to 280 limit
      );

      expect(validation.valid).toBe(true);
      expect(validation.warnings).toContain(
        'Content is close to the character limit'
      );
    });

    it('should warn about excessive hashtags on Instagram', () => {
      const hashtagContent = Array(35).fill('#tag').join(' ');
      const validation = service.validateContent('instagram', hashtagContent, [
        { type: 'image', url: 'https://example.com/img.jpg' },
      ]);

      expect(validation.warnings.some(w => w.includes('hashtags'))).toBe(true);
    });
  });

  describe('Content Adaptation', () => {
    it('should truncate content for Twitter', () => {
      const longContent = 'A'.repeat(300);
      const adapted = service.adaptContent(longContent, 'twitter');

      expect(adapted.length).toBeLessThanOrEqual(280);
      expect(adapted.endsWith('...')).toBe(true);
    });

    it('should preserve short content', () => {
      const content = 'Short post';
      const adapted = service.adaptContent(content, 'facebook');

      expect(adapted).toBe(content);
    });

    it('should reduce hashtags for Twitter', () => {
      const content = 'Post #one #two #three #four #five #six #seven';
      const adapted = service.adaptContent(content, 'twitter');

      const hashtagCount = (adapted.match(/#\w+/g) || []).length;
      expect(hashtagCount).toBeLessThanOrEqual(5);
    });
  });

  describe('Account Management', () => {
    it('should get account for platform', () => {
      const account = service.getAccount('facebook');

      expect(account).toBeDefined();
      expect(account?.platform).toBe('facebook');
    });

    it('should return undefined for disconnected platform', () => {
      const account = service.getAccount('linkedin');

      expect(account).toBeUndefined();
    });

    it('should add new account', () => {
      const newAccount: SocialAccount = {
        id: 'li-1',
        platform: 'linkedin',
        account_id: 'profile-789',
        account_name: 'Test Profile',
        access_token: 'li-token-789',
        connected_at: new Date().toISOString(),
        status: 'active',
        tenant_id: 'tenant-1',
      };

      service.addAccount(newAccount);
      const account = service.getAccount('linkedin');

      expect(account).toBeDefined();
      expect(account?.platform).toBe('linkedin');
    });

    it('should list all accounts', () => {
      const accounts = service.getAllAccounts();

      expect(accounts).toHaveLength(2);
      expect(accounts.map(a => a.platform)).toContain('facebook');
      expect(accounts.map(a => a.platform)).toContain('twitter');
    });
  });

  describe('Platform Limits', () => {
    it('should return correct limits for each platform', () => {
      const twitterLimits = service.getPlatformLimits('twitter');
      const facebookLimits = service.getPlatformLimits('facebook');
      const instagramLimits = service.getPlatformLimits('instagram');

      expect(twitterLimits.maxLength).toBe(280);
      expect(facebookLimits.maxLength).toBe(63206);
      expect(instagramLimits.maxLength).toBe(2200);
      expect(instagramLimits.hashtagLimit).toBe(30);
    });

    it('should indicate media support correctly', () => {
      const tiktokLimits = service.getPlatformLimits('tiktok');

      expect(tiktokLimits.supportsImages).toBe(false);
      expect(tiktokLimits.supportsVideos).toBe(true);
      expect(tiktokLimits.supportsCarousel).toBe(false);
    });
  });

  describe('Preview Generation', () => {
    it('should generate previews for multiple platforms', () => {
      const content = 'Original content for all platforms';
      const platforms: SocialPlatform[] = ['facebook', 'twitter', 'linkedin'];

      const previews = service.generatePreviews(content, platforms);

      expect(previews.size).toBe(3);
      expect(previews.has('facebook')).toBe(true);
      expect(previews.has('twitter')).toBe(true);
      expect(previews.has('linkedin')).toBe(true);
    });

    it('should adapt content in previews', () => {
      const longContent = 'A'.repeat(300);
      const previews = service.generatePreviews(longContent, ['twitter']);

      const twitterPreview = previews.get('twitter');
      expect(twitterPreview?.length).toBeLessThanOrEqual(280);
    });
  });

  describe('Post Templates', () => {
    it('should generate product launch template', () => {
      const template = postTemplates.productLaunch(
        'New Product X',
        'https://example.com/product'
      );

      expect(template.content).toContain('New Product X');
      expect(template.content).toContain('https://example.com/product');
      expect(template.hashtags).toContain('#launch');
    });

    it('should generate blog promotion template', () => {
      const template = postTemplates.blogPromotion(
        'How to Scale Your Business',
        'https://blog.example.com/scaling'
      );

      expect(template.content).toContain('How to Scale Your Business');
      expect(template.content).toContain('Read more');
    });

    it('should generate testimonial template', () => {
      const template = postTemplates.testimonial(
        'This product changed my life!',
        'Happy Customer'
      );

      expect(template.content).toContain('This product changed my life!');
      expect(template.content).toContain('Happy Customer');
      expect(template.hashtags).toContain('#testimonial');
    });

    it('should generate tip template', () => {
      const template = postTemplates.tip(
        'Always test in production',
        'DevOps'
      );

      expect(template.content).toContain('DevOps tip');
      expect(template.content).toContain('Always test in production');
    });
  });

  describe('Posting', () => {
    it('should fail when no account connected', async () => {
      const emptyService = createSocialMediaService([]);
      const result = await emptyService.postToSingle(
        'facebook',
        'Test post'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('No active facebook account');
    });

    it('should fail validation before posting', async () => {
      const result = await service.postToSingle(
        'twitter',
        'A'.repeat(300)
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('exceeds');
    });
  });
});
