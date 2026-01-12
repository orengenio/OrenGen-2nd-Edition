// Hunter.io Email Finder Service
// API: https://hunter.io/api

export interface HunterEmail {
  value: string;
  type: 'personal' | 'generic';
  confidence: number;
  first_name?: string;
  last_name?: string;
  position?: string;
  department?: string;
  linkedin?: string;
  twitter?: string;
  phone_number?: string;
  sources: {
    domain: string;
    uri: string;
    extracted_on: string;
  }[];
}

export interface HunterDomainResult {
  domain: string;
  disposable: boolean;
  webmail: boolean;
  accept_all: boolean;
  pattern?: string;
  organization?: string;
  description?: string;
  industry?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  technologies?: string[];
  country?: string;
  state?: string;
  city?: string;
  postal_code?: string;
  street?: string;
  emails: HunterEmail[];
}

export interface HunterVerifyResult {
  email: string;
  status: 'valid' | 'invalid' | 'accept_all' | 'webmail' | 'disposable' | 'unknown';
  score: number;
  regexp: boolean;
  gibberish: boolean;
  disposable: boolean;
  webmail: boolean;
  mx_records: boolean;
  smtp_server: boolean;
  smtp_check: boolean;
  accept_all: boolean;
  block: boolean;
  sources: {
    domain: string;
    uri: string;
    extracted_on: string;
  }[];
}

export class HunterService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.hunter.io/v2';

  constructor() {
    this.apiKey = process.env.HUNTER_API_KEY;
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async searchDomain(domain: string, limit: number = 10): Promise<HunterDomainResult | null> {
    if (!this.apiKey) {
      console.warn('HUNTER_API_KEY not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/domain-search?domain=${encodeURIComponent(domain)}&limit=${limit}&api_key=${this.apiKey}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.details || `Hunter API error: ${response.status}`);
      }

      const result = await response.json();
      return result.data as HunterDomainResult;
    } catch (error) {
      console.error('Hunter domain search error:', error);
      return null;
    }
  }

  async findEmail(
    domain: string,
    firstName?: string,
    lastName?: string,
    fullName?: string
  ): Promise<{ email: string; score: number } | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      let url = `${this.baseUrl}/email-finder?domain=${encodeURIComponent(domain)}&api_key=${this.apiKey}`;

      if (firstName && lastName) {
        url += `&first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}`;
      } else if (fullName) {
        url += `&full_name=${encodeURIComponent(fullName)}`;
      } else {
        return null;
      }

      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.data ? {
        email: result.data.email,
        score: result.data.score,
      } : null;
    } catch (error) {
      console.error('Hunter email finder error:', error);
      return null;
    }
  }

  async verifyEmail(email: string): Promise<HunterVerifyResult | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/email-verifier?email=${encodeURIComponent(email)}&api_key=${this.apiKey}`
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.data as HunterVerifyResult;
    } catch (error) {
      console.error('Hunter email verify error:', error);
      return null;
    }
  }

  async getAccountInfo(): Promise<{ requests_available: number; requests_made: number } | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/account?api_key=${this.apiKey}`
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return {
        requests_available: result.data?.requests?.searches?.available || 0,
        requests_made: result.data?.requests?.searches?.used || 0,
      };
    } catch (error) {
      console.error('Hunter account info error:', error);
      return null;
    }
  }

  extractEmails(result: HunterDomainResult): string[] {
    return result.emails
      .sort((a, b) => b.confidence - a.confidence)
      .map(e => e.value);
  }

  extractContacts(result: HunterDomainResult): Array<{
    email: string;
    firstName?: string;
    lastName?: string;
    position?: string;
    department?: string;
    linkedin?: string;
    confidence: number;
  }> {
    return result.emails
      .filter(e => e.type === 'personal')
      .sort((a, b) => b.confidence - a.confidence)
      .map(e => ({
        email: e.value,
        firstName: e.first_name,
        lastName: e.last_name,
        position: e.position,
        department: e.department,
        linkedin: e.linkedin,
        confidence: e.confidence,
      }));
  }
}

export const hunterService = new HunterService();
