// Snov.io Email & Lead Service
// API: https://snov.io/api

export interface SnovEmail {
  email: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  sourcePage?: string;
  companyName?: string;
  type: 'prospect' | 'generic';
  status: 'valid' | 'invalid' | 'unverifiable' | 'unknown';
}

export interface SnovDomainResult {
  success: boolean;
  domain: string;
  webmail: boolean;
  result: number;
  lastId: number;
  limit: number;
  companyName?: string;
  emails: SnovEmail[];
}

export interface SnovVerifyResult {
  email: string;
  result: 'valid' | 'invalid' | 'unverifiable';
}

export class SnovService {
  private clientId: string | undefined;
  private clientSecret: string | undefined;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private baseUrl = 'https://api.snov.io/v1';

  constructor() {
    this.clientId = process.env.SNOV_CLIENT_ID;
    this.clientSecret = process.env.SNOV_CLIENT_SECRET;
    // Also support single API key format
    if (!this.clientId && process.env.SNOV_API_KEY) {
      // Some Snov integrations use single key
      this.clientId = process.env.SNOV_API_KEY;
      this.clientSecret = process.env.SNOV_API_KEY;
    }
  }

  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  private async getAccessToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Snov auth error: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Refresh 1 min early

      return this.accessToken;
    } catch (error) {
      console.error('Snov auth error:', error);
      return null;
    }
  }

  async searchDomain(domain: string, limit: number = 10): Promise<SnovDomainResult | null> {
    const token = await this.getAccessToken();
    if (!token) {
      console.warn('Snov.io not configured or auth failed');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/get-domain-emails-with-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          domain,
          type: 'all',
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`Snov domain search error: ${response.status}`);
      }

      const data = await response.json();
      return data as SnovDomainResult;
    } catch (error) {
      console.error('Snov domain search error:', error);
      return null;
    }
  }

  async findEmailByName(
    firstName: string,
    lastName: string,
    domain: string
  ): Promise<{ email: string; status: string } | null> {
    const token = await this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/get-emails-from-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          domain,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (data.success && data.data?.emails?.length > 0) {
        const email = data.data.emails[0];
        return {
          email: email.email,
          status: email.status,
        };
      }

      return null;
    } catch (error) {
      console.error('Snov email finder error:', error);
      return null;
    }
  }

  async verifyEmail(email: string): Promise<SnovVerifyResult | null> {
    const token = await this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      // Add email to verification queue
      const addResponse = await fetch(`${this.baseUrl}/add-emails-to-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          emails: [email],
        }),
      });

      if (!addResponse.ok) {
        return null;
      }

      // Wait a bit and check status
      await new Promise(resolve => setTimeout(resolve, 2000));

      const checkResponse = await fetch(`${this.baseUrl}/get-emails-verification-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          emails: [email],
        }),
      });

      if (!checkResponse.ok) {
        return null;
      }

      const data = await checkResponse.json();

      if (data.success && data.data?.length > 0) {
        return {
          email: data.data[0].email,
          result: data.data[0].result,
        };
      }

      return null;
    } catch (error) {
      console.error('Snov email verify error:', error);
      return null;
    }
  }

  async getCreditsInfo(): Promise<{ balance: number } | null> {
    const token = await this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/get-balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        balance: data.credits || 0,
      };
    } catch (error) {
      console.error('Snov credits error:', error);
      return null;
    }
  }

  extractEmails(result: SnovDomainResult): string[] {
    return result.emails
      .filter(e => e.status === 'valid')
      .map(e => e.email);
  }
}

export const snovService = new SnovService();
