// B2B CRM Types with Role-Based Access

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SALES_MANAGER = 'sales_manager',
  SALES_REP = 'sales_rep',
  ACCOUNT_MANAGER = 'account_manager',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teamId?: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'enterprise';
  website?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  annualRevenue?: number;
  employeeCount?: number;
  status: 'prospect' | 'active' | 'inactive' | 'churned';
  ownerId: string; // Assigned sales rep
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
}

export interface Contact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  department?: string;
  isPrimary: boolean; // Primary contact for company
  linkedInUrl?: string;
  status: 'lead' | 'qualified' | 'customer' | 'partner';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  companyId: string;
  contactId: string;
  title: string;
  value: number;
  currency: 'USD' | 'EUR' | 'GBP';
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number; // 0-100
  expectedCloseDate: string;
  actualCloseDate?: string;
  lostReason?: string;
  ownerId: string;
  products: DealProduct[];
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
}

export interface DealProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  subject: string;
  description?: string;
  companyId?: string;
  contactId?: string;
  dealId?: string;
  ownerId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  scheduledAt?: string;
  completedAt?: string;
  duration?: number; // minutes
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  currency: 'USD' | 'EUR' | 'GBP';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  managerId: string;
  memberIds: string[];
  createdAt: string;
}

export interface Permission {
  resource: 'companies' | 'contacts' | 'deals' | 'activities' | 'users' | 'settings';
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// Role-based permission matrix
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    { resource: 'companies', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'contacts', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'deals', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'activities', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] }
  ],
  [UserRole.ADMIN]: [
    { resource: 'companies', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'contacts', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'deals', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'activities', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'users', actions: ['read', 'update'] },
    { resource: 'settings', actions: ['read', 'update'] }
  ],
  [UserRole.SALES_MANAGER]: [
    { resource: 'companies', actions: ['create', 'read', 'update'] },
    { resource: 'contacts', actions: ['create', 'read', 'update'] },
    { resource: 'deals', actions: ['create', 'read', 'update'] },
    { resource: 'activities', actions: ['create', 'read', 'update'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'settings', actions: ['read'] }
  ],
  [UserRole.SALES_REP]: [
    { resource: 'companies', actions: ['create', 'read', 'update'] }, // Own records only
    { resource: 'contacts', actions: ['create', 'read', 'update'] }, // Own records only
    { resource: 'deals', actions: ['create', 'read', 'update'] }, // Own records only
    { resource: 'activities', actions: ['create', 'read', 'update'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'settings', actions: ['read'] }
  ],
  [UserRole.ACCOUNT_MANAGER]: [
    { resource: 'companies', actions: ['read', 'update'] },
    { resource: 'contacts', actions: ['read', 'update'] },
    { resource: 'deals', actions: ['read', 'update'] },
    { resource: 'activities', actions: ['create', 'read', 'update'] },
    { resource: 'users', actions: ['read'] },
    { resource: 'settings', actions: ['read'] }
  ],
  [UserRole.VIEWER]: [
    { resource: 'companies', actions: ['read'] },
    { resource: 'contacts', actions: ['read'] },
    { resource: 'deals', actions: ['read'] },
    { resource: 'activities', actions: ['read'] },
    { resource: 'users', actions: [] },
    { resource: 'settings', actions: [] }
  ]
};

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  color: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  isDefault: boolean;
}

// Analytics & Reporting
export interface SalesMetrics {
  totalRevenue: number;
  dealsWon: number;
  dealsLost: number;
  averageDealSize: number;
  conversionRate: number;
  averageSalesCycle: number; // days
  forecastedRevenue: number;
}

// Lead Generation System (Foylo/Cyberleads Clone)
export interface LeadSource {
  id: string;
  type: 'domain_scrape' | 'manual' | 'referral' | 'inbound' | 'purchased';
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface DomainLead {
  id: string;
  domain: string;
  registeredDate: string;
  scrapedDate: string;
  whoisData?: WhoisData;
  techStack?: TechStack;
  enrichmentData?: EnrichmentData;
  leadScore: number; // 0-100
  status: 'new' | 'enriched' | 'qualified' | 'contacted' | 'converted' | 'rejected';
  assignedTo?: string;
  companyId?: string; // If converted to CRM company
  contactId?: string;  // If converted to CRM contact
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhoisData {
  registrar: string;
  registrationDate: string;
  expirationDate: string;
  nameServers: string[];
  registrantEmail?: string;
  registrantOrg?: string;
  registrantCountry?: string;
}

export interface TechStack {
  cms?: string; // WordPress, Shopify, Wix, etc.
  frameworks: string[]; // React, Vue, Laravel, etc.
  analytics: string[]; // Google Analytics, Plausible, etc.
  marketing: string[]; // Mailchimp, HubSpot, etc.
  ecommerce?: string; // WooCommerce, Shopify, etc.
  hosting?: string;
  cdn?: string;
  hasContactForm: boolean;
  hasLiveChat: boolean;
  detectedAt: string;
}

export interface EnrichmentData {
  emails: string[];
  phones: string[];
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  estimatedTraffic?: number;
  companySize?: string;
  industry?: string;
  enrichedAt: string;
  source: 'hunter' | 'snov' | 'manual' | 'whoxy';
}

export interface LeadGenCampaign {
  id: string;
  name: string;
  filters: LeadFilter;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leadsGenerated: number;
  leadsQualified: number;
  leadsContacted: number;
  leadsConverted: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilter {
  tlds?: string[]; // .com, .io, .ai, etc.
  technologies?: string[]; // WordPress, Shopify, etc.
  excludeTechnologies?: string[]; // Filter out sites with these
  hasContactForm?: boolean;
  hasLiveChat?: boolean;
  registeredAfter?: string;
  registeredBefore?: string;
  countries?: string[];
  minLeadScore?: number;
  keywords?: string[]; // In domain name or page content
}

export interface LeadGenConfig {
  icannCzdsEnabled: boolean;
  icannCzdsUsername?: string;
  icannCzdsPassword?: string;
  whoxyApiKey?: string;
  hunterApiKey?: string;
  snovApiKey?: string;
  scanFrequency: 'hourly' | 'daily' | 'weekly';
  maxDomainsPerRun: number;
  autoEnrichment: boolean;
  autoScoring: boolean;
}

// AI Website Builder (Claude Code + Gemini)
export interface WebsiteProject {
  id: string;
  companyId?: string;
  contactId?: string;
  projectName: string;
  status: 'questionnaire' | 'wireframing' | 'design' | 'development' | 'review' | 'completed' | 'delivered';
  questionsAnswered: number;
  totalQuestions: number;
  responses: WebsiteResponse[];
  wireframe?: Wireframe;
  design?: Design;
  generatedCode?: GeneratedCode;
  domain?: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteQuestion {
  id: string;
  category: 'business' | 'branding' | 'features' | 'content' | 'technical' | 'design';
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'textarea' | 'color' | 'image';
  options?: string[];
  placeholder?: string;
  required: boolean;
  order: number;
  conditionalOn?: {
    questionId: string;
    value: string;
  };
}

export interface WebsiteResponse {
  questionId: string;
  question: string;
  answer: string | string[];
  answeredAt: string;
}

export interface Wireframe {
  id: string;
  projectId: string;
  pages: WireframePage[];
  navigation: NavigationStructure;
  generatedBy: 'claude' | 'gemini';
  prompt: string;
  svg?: string;
  image?: string;
  createdAt: string;
}

export interface WireframePage {
  name: string;
  path: string;
  sections: WireframeSection[];
}

export interface WireframeSection {
  type: 'hero' | 'features' | 'about' | 'services' | 'testimonials' | 'cta' | 'contact' | 'footer' | 'gallery' | 'pricing' | 'faq';
  layout: 'single-column' | 'two-column' | 'three-column' | 'grid' | 'masonry';
  content: string;
  position: number;
}

export interface NavigationStructure {
  type: 'top' | 'side' | 'hamburger' | 'mega-menu';
  items: NavItem[];
  sticky: boolean;
  transparent: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface Design {
  id: string;
  projectId: string;
  theme: DesignTheme;
  colorPalette: ColorPalette;
  typography: Typography;
  components: DesignComponent[];
  mockups: string[]; // URLs to generated mockup images
  generatedBy: 'claude' | 'gemini';
  createdAt: string;
}

export interface DesignTheme {
  name: string;
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'playful' | 'corporate' | 'creative';
  mood: string[];
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  darkMode?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export interface Typography {
  headingFont: string;
  bodyFont: string;
  monoFont?: string;
  scale: {
    h1: string;
    h2: string;
    h3: string;
    body: string;
    small: string;
  };
}

export interface DesignComponent {
  name: string;
  type: 'button' | 'card' | 'form' | 'nav' | 'footer' | 'hero';
  styles: Record<string, string>;
  variants: string[];
}

export interface GeneratedCode {
  id: string;
  projectId: string;
  framework: 'react' | 'next' | 'html' | 'vue' | 'astro';
  files: CodeFile[];
  dependencies: PackageDependency[];
  deploymentUrl?: string;
  githubRepo?: string;
  generatedBy: 'claude' | 'gemini';
  buildStatus: 'pending' | 'building' | 'success' | 'failed';
  buildLog?: string;
  createdAt: string;
}

export interface CodeFile {
  path: string;
  content: string;
  language: string;
}

export interface PackageDependency {
  name: string;
  version: string;
  type: 'dependency' | 'devDependency';
}

export interface AIWebBuilderConfig {
  claudeApiKey: string;
  geminiApiKey: string;
  defaultFramework: 'react' | 'next' | 'html' | 'vue' | 'astro';
  autoWireframe: boolean;
  autoDesign: boolean;
  autoDeploy: boolean;
  deploymentPlatform: 'vercel' | 'netlify' | 'cloudflare' | 'none';
}
