/**
 * Reputation Management Service
 * Monitor, respond to, and generate reviews across platforms
 * Supports: Google, Yelp, Facebook, Trustpilot, G2, Capterra, BBB
 */

// Types
export interface ReviewPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  businessId?: string;
  accessToken?: string;
  averageRating?: number;
  totalReviews?: number;
  lastSynced?: string;
}

export interface Review {
  id: string;
  platformId: string;
  platform: string;
  author: {
    name: string;
    avatar?: string;
    profileUrl?: string;
  };
  rating: number;
  title?: string;
  content: string;
  publishedAt: string;
  response?: ReviewResponse;
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  flagged: boolean;
  status: 'new' | 'read' | 'responded' | 'escalated';
  source_url?: string;
}

export interface ReviewResponse {
  content: string;
  respondedAt: string;
  respondedBy: string;
  isAiGenerated: boolean;
}

export interface ReviewRequest {
  id: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  templateId: string;
  sentAt: string;
  sentVia: 'email' | 'sms' | 'both';
  status: 'sent' | 'opened' | 'clicked' | 'completed' | 'declined';
  platformClicked?: string;
  reviewSubmitted?: boolean;
}

export interface ReviewTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  type: 'email' | 'sms';
  platformLinks: string[];
  isDefault: boolean;
}

export interface ReputationStats {
  averageRating: number;
  totalReviews: number;
  reviewsByPlatform: Record<string, number>;
  ratingDistribution: Record<number, number>;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  responseRate: number;
  averageResponseTime: number; // hours
  reviewsThisMonth: number;
  ratingTrend: number; // change vs last month
}

export interface ReviewAlert {
  id: string;
  type: 'negative_review' | 'no_response' | 'rating_drop' | 'mention';
  severity: 'low' | 'medium' | 'high';
  message: string;
  reviewId?: string;
  createdAt: string;
  acknowledged: boolean;
}

// Platform configurations
const PLATFORM_CONFIGS: Record<string, { name: string; apiUrl: string; supportsResponse: boolean }> = {
  google: {
    name: 'Google Business',
    apiUrl: 'https://mybusiness.googleapis.com/v4',
    supportsResponse: true,
  },
  yelp: {
    name: 'Yelp',
    apiUrl: 'https://api.yelp.com/v3',
    supportsResponse: true,
  },
  facebook: {
    name: 'Facebook',
    apiUrl: 'https://graph.facebook.com/v18.0',
    supportsResponse: true,
  },
  trustpilot: {
    name: 'Trustpilot',
    apiUrl: 'https://api.trustpilot.com/v1',
    supportsResponse: true,
  },
  g2: {
    name: 'G2',
    apiUrl: 'https://api.g2.com/api/v1',
    supportsResponse: false,
  },
  capterra: {
    name: 'Capterra',
    apiUrl: 'https://api.capterra.com/v1',
    supportsResponse: false,
  },
  bbb: {
    name: 'Better Business Bureau',
    apiUrl: 'https://api.bbb.org/v1',
    supportsResponse: true,
  },
};

// AI Response templates by sentiment
const AI_RESPONSE_TEMPLATES = {
  positive: [
    "Thank you so much for your kind words, {author}! We're thrilled to hear about your positive experience. Your feedback motivates our team to continue delivering excellent service. We look forward to serving you again!",
    "Wow, {author}! Thank you for this amazing review. We're so glad we could exceed your expectations. It's customers like you who make what we do worthwhile!",
    "Thanks for taking the time to share your experience, {author}! We're delighted that you enjoyed working with us. Your support means the world to our team!",
  ],
  neutral: [
    "Thank you for your feedback, {author}. We appreciate you taking the time to share your experience. We're always looking for ways to improve - please don't hesitate to reach out if there's anything we can do better.",
    "Hi {author}, thanks for your review. We value all feedback as it helps us grow. If you have any suggestions on how we can improve your experience, we'd love to hear from you.",
  ],
  negative: [
    "Hi {author}, thank you for bringing this to our attention. We sincerely apologize that your experience didn't meet expectations. We'd like to make this right - please contact us at {supportEmail} so we can address your concerns personally.",
    "{author}, we're truly sorry to hear about your experience. This isn't the standard we hold ourselves to. Please reach out to our team at {supportEmail} - we're committed to resolving this for you.",
    "Thank you for your honest feedback, {author}. We take all concerns seriously and would like the opportunity to address this directly. Please contact us at {supportEmail} at your earliest convenience.",
  ],
};

// Main Service Class
export class ReputationManagementService {
  private platforms: Map<string, ReviewPlatform> = new Map();
  private reviews: Review[] = [];
  private alerts: ReviewAlert[] = [];
  private tenantId: string;
  private supportEmail: string;

  constructor(tenantId: string, supportEmail: string = 'support@company.com') {
    this.tenantId = tenantId;
    this.supportEmail = supportEmail;
  }

  // Connect a review platform
  async connectPlatform(
    platformId: string,
    credentials: { businessId?: string; accessToken?: string; apiKey?: string }
  ): Promise<ReviewPlatform> {
    const config = PLATFORM_CONFIGS[platformId];
    if (!config) {
      throw new Error(`Unknown platform: ${platformId}`);
    }

    const platform: ReviewPlatform = {
      id: platformId,
      name: config.name,
      icon: platformId,
      connected: true,
      businessId: credentials.businessId,
      accessToken: credentials.accessToken,
      lastSynced: new Date().toISOString(),
    };

    this.platforms.set(platformId, platform);

    // Trigger initial sync
    await this.syncPlatformReviews(platformId);

    return platform;
  }

  // Disconnect platform
  disconnectPlatform(platformId: string): void {
    this.platforms.delete(platformId);
  }

  // Get connected platforms
  getConnectedPlatforms(): ReviewPlatform[] {
    return Array.from(this.platforms.values());
  }

  // Sync reviews from platform
  async syncPlatformReviews(platformId: string): Promise<Review[]> {
    const platform = this.platforms.get(platformId);
    if (!platform) {
      throw new Error(`Platform not connected: ${platformId}`);
    }

    // In production, this would call the actual platform API
    // For demo, return mock reviews
    const mockReviews = this.generateMockReviews(platformId, 5);

    // Process and store reviews
    for (const review of mockReviews) {
      const existing = this.reviews.find(r => r.id === review.id);
      if (!existing) {
        this.reviews.unshift(review);

        // Create alert for negative reviews
        if (review.sentiment === 'negative') {
          this.createAlert({
            type: 'negative_review',
            severity: review.rating <= 2 ? 'high' : 'medium',
            message: `New ${review.rating}-star review from ${review.author.name} on ${platform.name}`,
            reviewId: review.id,
          });
        }
      }
    }

    // Update platform stats
    platform.lastSynced = new Date().toISOString();
    platform.totalReviews = this.reviews.filter(r => r.platformId === platformId).length;
    platform.averageRating = this.calculatePlatformRating(platformId);

    return mockReviews;
  }

  // Sync all platforms
  async syncAllPlatforms(): Promise<void> {
    const promises = Array.from(this.platforms.keys()).map(id => this.syncPlatformReviews(id));
    await Promise.all(promises);
  }

  // Get all reviews
  getReviews(filters?: {
    platformId?: string;
    sentiment?: string;
    status?: string;
    minRating?: number;
    maxRating?: number;
    startDate?: string;
    endDate?: string;
  }): Review[] {
    let filtered = [...this.reviews];

    if (filters?.platformId) {
      filtered = filtered.filter(r => r.platformId === filters.platformId);
    }
    if (filters?.sentiment) {
      filtered = filtered.filter(r => r.sentiment === filters.sentiment);
    }
    if (filters?.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters?.minRating) {
      filtered = filtered.filter(r => r.rating >= filters.minRating!);
    }
    if (filters?.maxRating) {
      filtered = filtered.filter(r => r.rating <= filters.maxRating!);
    }

    return filtered.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  // Get single review
  getReview(reviewId: string): Review | undefined {
    return this.reviews.find(r => r.id === reviewId);
  }

  // Generate AI response for review
  async generateAIResponse(reviewId: string): Promise<string> {
    const review = this.getReview(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    const templates = AI_RESPONSE_TEMPLATES[review.sentiment];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace placeholders
    const response = template
      .replace(/{author}/g, review.author.name.split(' ')[0])
      .replace(/{supportEmail}/g, this.supportEmail);

    return response;
  }

  // Respond to review
  async respondToReview(reviewId: string, content: string, isAiGenerated: boolean = false): Promise<Review> {
    const review = this.getReview(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    const platform = this.platforms.get(review.platformId);
    if (!platform) {
      throw new Error('Platform not connected');
    }

    // In production, this would post to the platform API
    review.response = {
      content,
      respondedAt: new Date().toISOString(),
      respondedBy: 'current_user', // Would be actual user ID
      isAiGenerated,
    };
    review.status = 'responded';

    return review;
  }

  // Flag review for attention
  flagReview(reviewId: string, flagged: boolean): void {
    const review = this.getReview(reviewId);
    if (review) {
      review.flagged = flagged;
    }
  }

  // Get reputation statistics
  getStats(): ReputationStats {
    const reviews = this.reviews;

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const reviewsByPlatform: Record<string, number> = {};
    let totalRating = 0;
    let respondedCount = 0;

    for (const review of reviews) {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
      reviewsByPlatform[review.platform] = (reviewsByPlatform[review.platform] || 0) + 1;
      totalRating += review.rating;
      if (review.response) respondedCount++;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const reviewsThisMonth = reviews.filter(r => new Date(r.publishedAt) > thirtyDaysAgo).length;

    return {
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
      reviewsByPlatform,
      ratingDistribution,
      sentimentBreakdown: {
        positive: reviews.filter(r => r.sentiment === 'positive').length,
        neutral: reviews.filter(r => r.sentiment === 'neutral').length,
        negative: reviews.filter(r => r.sentiment === 'negative').length,
      },
      responseRate: reviews.length > 0 ? (respondedCount / reviews.length) * 100 : 0,
      averageResponseTime: 4.2, // Mock - would calculate from actual response times
      reviewsThisMonth,
      ratingTrend: 0.2, // Mock - would calculate from historical data
    };
  }

  // Send review request
  async sendReviewRequest(
    contact: { id: string; name: string; email: string; phone?: string },
    templateId: string,
    via: 'email' | 'sms' | 'both'
  ): Promise<ReviewRequest> {
    const request: ReviewRequest = {
      id: `req_${Date.now()}`,
      contactId: contact.id,
      contactName: contact.name,
      contactEmail: contact.email,
      contactPhone: contact.phone,
      templateId,
      sentAt: new Date().toISOString(),
      sentVia: via,
      status: 'sent',
    };

    // In production, this would send actual email/SMS
    console.log(`Sending review request to ${contact.name} via ${via}`);

    return request;
  }

  // Bulk send review requests
  async sendBulkReviewRequests(
    contacts: Array<{ id: string; name: string; email: string; phone?: string }>,
    templateId: string,
    via: 'email' | 'sms' | 'both'
  ): Promise<ReviewRequest[]> {
    const requests: ReviewRequest[] = [];

    for (const contact of contacts) {
      const request = await this.sendReviewRequest(contact, templateId, via);
      requests.push(request);
      // Add small delay between sends
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return requests;
  }

  // Get alerts
  getAlerts(unacknowledgedOnly: boolean = false): ReviewAlert[] {
    if (unacknowledgedOnly) {
      return this.alerts.filter(a => !a.acknowledged);
    }
    return this.alerts;
  }

  // Acknowledge alert
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  // Create alert
  private createAlert(params: Omit<ReviewAlert, 'id' | 'createdAt' | 'acknowledged'>): void {
    this.alerts.unshift({
      ...params,
      id: `alert_${Date.now()}`,
      createdAt: new Date().toISOString(),
      acknowledged: false,
    });
  }

  // Calculate platform rating
  private calculatePlatformRating(platformId: string): number {
    const platformReviews = this.reviews.filter(r => r.platformId === platformId);
    if (platformReviews.length === 0) return 0;

    const total = platformReviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / platformReviews.length) * 10) / 10;
  }

  // Analyze review sentiment
  private analyzeSentiment(rating: number, content: string): 'positive' | 'neutral' | 'negative' {
    if (rating >= 4) return 'positive';
    if (rating <= 2) return 'negative';
    return 'neutral';
  }

  // Extract keywords from review
  private extractKeywords(content: string): string[] {
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'is', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'are', 'very', 'just', 'also', 'so', 'than', 'too', 'only', 'own', 'same', 'as', 'with', 'of', 'my', 'your', 'their', 'our'];

    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));

    // Return unique words, max 5
    return [...new Set(words)].slice(0, 5);
  }

  // Generate mock reviews for demo
  private generateMockReviews(platformId: string, count: number): Review[] {
    const names = ['John D.', 'Sarah M.', 'Mike R.', 'Emily L.', 'David K.', 'Lisa P.', 'Tom H.', 'Anna S.'];
    const positiveContent = [
      'Absolutely fantastic service! The team went above and beyond to help us.',
      'Best experience ever. Highly recommend to anyone looking for quality.',
      'Professional, responsive, and delivered exactly what we needed.',
      'Five stars isn\'t enough! Will definitely be using their services again.',
    ];
    const neutralContent = [
      'Good service overall. A few areas could be improved.',
      'Met expectations. Nothing extraordinary but got the job done.',
      'Decent experience. Communication could be better.',
    ];
    const negativeContent = [
      'Disappointed with the service. Expected much better.',
      'Had issues that weren\'t resolved properly. Would not recommend.',
      'Poor communication and delays. Need to improve.',
    ];

    const reviews: Review[] = [];

    for (let i = 0; i < count; i++) {
      const rating = Math.random() > 0.3 ? (Math.random() > 0.3 ? 5 : 4) : (Math.random() > 0.5 ? 3 : Math.random() > 0.5 ? 2 : 1);
      const sentiment = this.analyzeSentiment(rating, '');
      const contentArray = sentiment === 'positive' ? positiveContent : sentiment === 'neutral' ? neutralContent : negativeContent;
      const content = contentArray[Math.floor(Math.random() * contentArray.length)];

      const daysAgo = Math.floor(Math.random() * 30);
      const publishedAt = new Date();
      publishedAt.setDate(publishedAt.getDate() - daysAgo);

      reviews.push({
        id: `review_${platformId}_${Date.now()}_${i}`,
        platformId,
        platform: PLATFORM_CONFIGS[platformId]?.name || platformId,
        author: {
          name: names[Math.floor(Math.random() * names.length)],
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${Math.random()}`,
        },
        rating,
        content,
        publishedAt: publishedAt.toISOString(),
        sentiment,
        keywords: this.extractKeywords(content),
        flagged: false,
        status: 'new',
      });
    }

    return reviews;
  }
}

// Review request templates
export const DEFAULT_TEMPLATES: ReviewTemplate[] = [
  {
    id: 'template_email_default',
    name: 'Standard Email Request',
    type: 'email',
    subject: 'How was your experience with us?',
    content: `Hi {firstName},

Thank you for choosing {companyName}! We hope you had a great experience.

Would you mind taking a moment to share your feedback? Your review helps us improve and helps others make informed decisions.

Click below to leave a review:
{reviewLinks}

Thank you for your time!

Best regards,
The {companyName} Team`,
    platformLinks: ['google', 'facebook'],
    isDefault: true,
  },
  {
    id: 'template_sms_default',
    name: 'Standard SMS Request',
    type: 'sms',
    content: `Hi {firstName}! Thanks for choosing {companyName}. We'd love your feedback! Leave a quick review here: {reviewLink}`,
    platformLinks: ['google'],
    isDefault: true,
  },
  {
    id: 'template_email_followup',
    name: 'Follow-up Email',
    type: 'email',
    subject: 'We\'d still love your feedback!',
    content: `Hi {firstName},

Just a friendly reminder - we'd really appreciate hearing about your experience with {companyName}.

Your feedback only takes a minute and helps us serve you better!

{reviewLinks}

Thank you!
{companyName}`,
    platformLinks: ['google', 'yelp'],
    isDefault: false,
  },
];

// Factory function
export function createReputationService(tenantId: string, supportEmail?: string): ReputationManagementService {
  return new ReputationManagementService(tenantId, supportEmail);
}
