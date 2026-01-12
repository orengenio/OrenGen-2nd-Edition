
export interface CloudflareConfig {
  apiKey: string;
  email: string;
}

export interface DomainInfo {
  id: string;
  name: string;
  status: string;
  paused: boolean;
  type: string;
}

export interface DNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
}

export enum Tab {
  Dashboard = 'dashboard',
  Cloudflare = 'cloudflare',
  ISPCenter = 'isp-center',
  Auditor = 'auditor',
  Automation = 'automation',
  Bulk = 'bulk'
}

export type ISPProvider = 'google' | 'microsoft' | 'yahoo' | 'generic';

export interface AutomationTask {
  id: string;
  domain: string;
  token: string;
  status: 'idle' | 'searching' | 'injecting' | 'propagating' | 'completed' | 'failed';
  error?: string;
  isp?: ISPProvider;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  error?: any;
}
