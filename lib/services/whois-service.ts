// WHOIS Enrichment Service using Whoxy API
// API: https://whoxy.com

import { WhoisData } from '@/crm/types';

interface WhoxyResponse {
  status: number;
  status_reason?: string;
  domain_name: string;
  domain_registered: string;
  create_date: string;
  update_date: string;
  expiry_date: string;
  domain_registrar: {
    registrar_name: string;
    whois_server?: string;
    website_url?: string;
    email_address?: string;
  };
  registrant_contact: {
    full_name?: string;
    company_name?: string;
    mailing_address?: string;
    city_name?: string;
    state_name?: string;
    zip_code?: string;
    country_name?: string;
    country_code?: string;
    email_address?: string;
    phone_number?: string;
  };
  administrative_contact?: {
    full_name?: string;
    company_name?: string;
    email_address?: string;
    phone_number?: string;
  };
  technical_contact?: {
    full_name?: string;
    company_name?: string;
    email_address?: string;
    phone_number?: string;
  };
  name_servers?: string[];
}

export class WhoisService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.whoxy.com';

  constructor() {
    this.apiKey = process.env.WHOXY_API_KEY;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async lookupDomain(domain: string): Promise<WhoisData | null> {
    if (!this.apiKey) {
      console.warn('WHOXY_API_KEY not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/?key=${this.apiKey}&whois=${encodeURIComponent(domain)}`
      );

      if (!response.ok) {
        throw new Error(`Whoxy API error: ${response.status}`);
      }

      const data: WhoxyResponse = await response.json();

      if (data.status !== 1) {
        console.error('Whoxy lookup failed:', data.status_reason);
        return null;
      }

      return {
        registrar: data.domain_registrar?.registrar_name || 'Unknown',
        registrationDate: data.create_date,
        expirationDate: data.expiry_date,
        nameServers: data.name_servers || [],
        registrantEmail: data.registrant_contact?.email_address,
        registrantOrg: data.registrant_contact?.company_name || data.registrant_contact?.full_name,
        registrantCountry: data.registrant_contact?.country_code,
      };
    } catch (error) {
      console.error('WHOIS lookup error:', error);
      return null;
    }
  }

  async reverseLookup(email: string): Promise<string[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/?key=${this.apiKey}&reverse=whois&email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      if (data.status !== 1) {
        return [];
      }

      return data.search_result?.map((r: any) => r.domain_name) || [];
    } catch (error) {
      console.error('Reverse WHOIS lookup error:', error);
      return [];
    }
  }

  async getAccountBalance(): Promise<number | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/?key=${this.apiKey}&account=balance`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.live_whois_balance || 0;
    } catch (error) {
      console.error('Get balance error:', error);
      return null;
    }
  }
}

export const whoisService = new WhoisService();
