export enum Platform {
  Instagram = 'Instagram',
  LinkedIn = 'LinkedIn',
  X = 'X',
  Facebook = 'Facebook',
  TikTok = 'TikTok',
  Pinterest = 'Pinterest',
  YouTube = 'YouTube',
  Threads = 'Threads',
  Snapchat = 'Snapchat',
  Medium = 'Medium',
  Reddit = 'Reddit',
  Tumblr = 'Tumblr',
  Lemon8 = 'Lemon8',
  Bluesky = 'Bluesky',
  GoogleAds = 'Google Ads',
  Vibe = 'Vibe (TV)'
}

export enum ContentFormat {
  Image = 'Image',
  Video = 'Video'
}

export interface BrandProfile {
  name: string;
  description: string;
  tone: string;
  primaryColor: string;
  visualStyle: string;
}

export interface StrategyInsight {
  bestTime: string;
  reasoning: string;
  engagementTips: string[];
  engagementScore: number; // 0-100 prediction
}

export interface GeneratedContent {
  id: string;
  platform: Platform;
  format: ContentFormat;
  headline: string;
  body: string;
  hashtags: string[];
  imagePrompt: string; // Used for both Image generation and Video prompts
  imageData?: string; // Base64 string for images
  videoUri?: string; // URI for generated video
  audioData?: string; // Base64 raw PCM audio data
  strategy: StrategyInsight;
  timestamp: number;
  metadata?: any; // For platform-specific fields (e.g., Google Ads headlines, TV scripts)
}

export type PostStatus = 'Draft' | 'Needs Approval' | 'Scheduled' | 'Published';

export interface ScheduledPost extends GeneratedContent {
  scheduledDate: string; // The AI suggested date/time string
  status: PostStatus;
  isRewriting?: boolean; // UI state for drag-and-drop rewrites
}

export interface GenerationRequest {
  topic: string;
  platform: Platform;
  targetAudience: string;
  format: ContentFormat;
}

export interface BonusItem {
  title: string;
  description: string;
  value: string; // e.g. "$497"
}

export interface OfferPackage {
  offerName: string;
  headline: string;
  subheadline: string;
  corePromise: string;
  priceAnchor: string; // e.g. "Total Value $2,997"
  priceFinal: string; // e.g. "Today Only $97"
  bonuses: BonusItem[];
  guarantee: string;
  callToAction: string;
  landingPageCopy: {
    hero: string;
    problem: string;
    solution: string;
    testimonials: string[]; // Mock testimonials
    faq: { q: string, a: string }[];
  };
  emailHooks: string[]; // Subject lines for follow up
}
