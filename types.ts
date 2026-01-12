

export enum LeadStatus {
  NEW = 'NEW',
  ANALYZING = 'ANALYZING',
  QUALIFIED = 'QUALIFIED',
  CONTACTED = 'CONTACTED',
  CLOSED = 'CLOSED',
  UNQUALIFIED = 'UNQUALIFIED'
}

export enum LeadCategory {
  WEBSITE_DESIGN = 'WEBSITE_DESIGN',
  AI_AGENT = 'AI_AGENT',
  TALKING_WEBSITE = 'TALKING_WEBSITE',
  SEO = 'SEO',
  GENERAL = 'GENERAL'
}

export interface Lead {
  id: string;
  name: string;
  address: string;
  website?: string;
  placeId?: string;
  status: LeadStatus;
  category?: LeadCategory;
  aiAnalysis?: string;
  email?: string;
  emailContent?: string; // The generated cold email content
  linkedinUrl?: string;
  score?: number;
  // External IDs and Statuses
  supabaseId?: string;
  ghlId?: string;
  websiteStatus?: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN' | 'NEEDS_UPDATE';
  lastContactedAt?: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  provider: 'google' | 'microsoft' | 'other';
  password?: string; // Stored securely in real app, simplified here
  daily_sent: number;
  daily_limit: number;
  warmup_active: boolean;
  warmup_emails_sent: number;
  health_score: number; // 0-100
  status: 'active' | 'error' | 'paused';
  // Super Charged Settings
  ramp_up_speed?: 'conservative' | 'balanced' | 'ludicrous';
  reply_rate_target?: number;
  peer_network_enabled?: boolean;
  bounces?: number;
}

export interface AppSettings {
  supabaseUrl: string;
  supabaseKey: string;
  ghlApiKey: string;
  n8nWebhookUrl: string;
  // MailWizz Settings
  mailwizzUrl?: string;
  mailwizzPublicKey?: string;
  mailwizzSecret?: string;
}

export enum ViewState {
  PIPELINE = 'PIPELINE',
  FINDER = 'FINDER',
  LIVE_AGENT = 'LIVE_AGENT',
  EMAIL_ACCOUNTS = 'EMAIL_ACCOUNTS',
  EMAIL_CAMPAIGNS = 'EMAIL_CAMPAIGNS',
  ONEBOX = 'ONEBOX',
  ANALYTICS = 'ANALYTICS',
  BLACKLIST_MONITOR = 'BLACKLIST_MONITOR',
  SETTINGS = 'SETTINGS'
}