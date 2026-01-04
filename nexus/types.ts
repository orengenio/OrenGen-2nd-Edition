
export interface Project {
  id: string;
  name: string;
  type: string;
  audience: string;
  status: 'planning' | 'active' | 'launched' | 'paused';
  progress: number;
  readinessScore: number;
  checklist: ChecklistItem[];
  kpis: Record<string, string>;
  tone: string;
  language: string;
  // New Branding Fields
  brandIdentity?: BrandIdentity;
  pressReleases?: PressRelease[];
  marketingAssets?: MarketingAsset[];
  // Web Studio Fields
  landingPage?: LandingPageSchema;
  // Reputation
  reviews?: Review[];
  // Ads
  adCampaigns?: AdCampaign[];
}

export interface Review {
  id: string;
  platform: 'Google' | 'Facebook' | 'Yelp' | 'Trustpilot';
  author: string;
  rating: number; // 1-5
  content: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'unanswered' | 'replied';
  reply?: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  platform: 'Meta' | 'Google' | 'LinkedIn' | 'TikTok';
  status: 'draft' | 'active' | 'paused';
  variants: AdVariant[];
  targeting: {
    locations: string[]; // Geofencing inputs
    radius: number; // miles
    interests: string[];
    ageRange: string;
  };
  metaTags?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface AdVariant {
  id: string;
  headline: string;
  primaryText: string;
  cta: string;
  imagePrompt: string;
}

export interface Template {
  id: string;
  title: string;
  category: string; // Changed from union to string for flexibility
  description: string;
  previewColor: string;
  structure: string; // Internal prompt structure
}

export interface LandingPageSchema {
  theme: 'modern' | 'dark' | 'playful' | 'minimal';
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  socialProof: {
    stat: string;
    label: string;
  }[];
  ctaSection: {
    headline: string;
    buttonText: string;
  };
}

export interface BrandIdentity {
  logoUrl?: string;
  websiteUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontPairing: string;
  tagline: string;
  voiceDescription: string;
  missionStatement: string;
}

export interface PressRelease {
  id: string;
  title: string;
  date: string;
  content: string;
  status: 'draft' | 'published';
  distributionChannels: string[];
}

export interface MarketingAsset {
  id: string;
  type: 'social_post' | 'ad_copy' | 'email_blast' | 'banner_mockup';
  content: string; // The text copy or the visual prompt
  imageUrl?: string;
  platform: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  status: 'pending' | 'in-progress' | 'review' | 'done';
  owner: 'AI' | 'User';
  agentId?: string;
  output?: string;
  dueDate?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  attachments?: { type: 'image' | 'file'; url: string }[];
}

export type AgentType = 
  | 'router'
  | 'brand_guardian'
  | 'creator_manager'
  | 'web_architect'
  | 'campaign_orchestrator'
  | 'automation_engineer'
  | 'data_analyst'
  | 'agent_supervisor'
  | 'marketplace_curator'
  | 'master_strategist'
  | 'opportunity_scout'
  | 'rfp_analyst'
  | 'proposal_writer'
  | 'compliance_officer'
  | 'press_secretary'
  | 'form_architect'
  | 'translator'
  | 'ad_specialist' // New
  | 'reputation_manager'; // New

export interface ToolConnection {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  category: 'content' | 'outreach' | 'analytics' | 'hr' | 'infrastructure';
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  status: 'Lead' | 'Qualified' | 'Customer' | 'Partner';
  lastContact: string;
  value: string;
  avatar?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  agency: string;
  value: string;
  deadline: string;
  type: 'Federal' | 'Grant';
  status: 'New' | 'Qualified' | 'Drafting' | 'Review' | 'Submitted';
  naics?: string;
  matchScore: number;
  description?: string;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  modules: CourseModule[];
}

export interface WikiArticle {
  id: string;
  title: string;
  category: 'Guide' | 'System' | 'FAQ';
  content: string;
  isAdminOnly?: boolean;
}

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  providerId: string; // 'google', 'outlook', 'local'
  type: 'meeting' | 'task' | 'deadline';
  description?: string;
  attendees?: string[];
}

export interface CalendarProvider {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'icloud' | 'caldav' | 'exchange';
  connected: boolean;
  color: string;
  lastSync?: string;
  email?: string;
}

// Form Studio Types
export interface FormFieldSchema {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select
  defaultValue?: string | boolean | number;
}

export interface GeneratedFormSchema {
  title: string;
  description: string;
  submitLabel: string;
  fields: FormFieldSchema[];
}

// Automation Types (n8n)
export interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  triggers: string[];
  lastRun: string;
  nodes: number;
  webhookUrl?: string;
}

// Mailpit Types
export interface SimulatedEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string; // HTML
  timestamp: string;
  read: boolean;
}

export interface FederalProfile {
  legalName: string;
  uei: string; // Unique Entity ID (SAM.gov)
  cageCode: string;
  naics: string[]; // Array of codes
  sic: string[];
  setAsides: string[]; // e.g. ['SDVOSB', 'WOSB']
  capabilities: string; // Brief capability statement
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  NEW_PROJECT = 'new-project',
  BRAND_STUDIO = 'brand-studio',
  UGC_STUDIO = 'ugc-studio',
  WEB_STUDIO = 'web-studio',
  CAMPAIGN_STUDIO = 'campaign-studio',
  AUTOMATION_STUDIO = 'automation-studio',
  DATA_STUDIO = 'data-studio',
  AGENT_STUDIO = 'agent-studio',
  MARKETPLACE_STUDIO = 'marketplace-studio',
  COMMUNITY_STUDIO = 'community-studio',
  CALENDAR_STUDIO = 'calendar-studio',
  CRM = 'crm',
  SETTINGS = 'settings',
  WIKI = 'wiki',
  ADMIN_KB = 'admin-kb',
  OPPORTUNITY_STUDIO = 'opportunity-studio',
  RFP_STUDIO = 'rfp-studio',
  PROPOSAL_STUDIO = 'proposal-studio',
  GRANT_STUDIO = 'grant-studio',
  COMPLIANCE_STUDIO = 'compliance-studio',
  FORM_STUDIO = 'form-studio',
  DEVELOPER_PORTAL = 'developer-portal'
}
    