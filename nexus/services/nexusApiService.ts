/**
 * Nexus API Service
 * Connects the Nexus super-admin dashboard to the OrenGen CRM backend
 * Super Admin access only - full CRUD operations across all entities
 */

// Backend API URL - configurable via environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// CRM Types matching backend schema
export interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  status: 'active' | 'inactive' | 'prospect';
  annual_revenue?: number;
  employee_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  company_id?: string;
  company_name?: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expected_close_date?: string;
  company_id?: string;
  contact_id?: string;
  company_name?: string;
  contact_name?: string;
  created_at: string;
  updated_at: string;
}

export interface DomainLead {
  id: string;
  domain: string;
  status: 'new' | 'enriched' | 'qualified' | 'contacted' | 'converted' | 'rejected';
  lead_score: number;
  whois_data?: any;
  tech_stack?: any;
  enrichment_data?: any;
  assigned_to?: string;
  assigned_user_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  notes?: string;
  scraped_date: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  filters?: any;
  leads_generated: number;
  leads_qualified: number;
  leads_contacted: number;
  leads_converted: number;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  due_date?: string;
  company_id?: string;
  contact_id?: string;
  deal_id?: string;
  created_at: string;
}

export interface LeadStats {
  overview: {
    totalLeads: number;
    newLeads: number;
    enrichedLeads: number;
    qualifiedLeads: number;
    contactedLeads: number;
    convertedLeads: number;
    rejectedLeads: number;
    avgScore: number;
    highValueLeads: number;
  };
  dailyStats: any[];
  techStacks: any[];
  countries: any[];
  scoreDistribution: any[];
  activeCampaigns: any[];
  conversionFunnel: any;
}

export interface EnrichmentStatus {
  services: {
    whois: { configured: boolean; balance?: number };
    hunter: { configured: boolean; requestsAvailable?: number };
    snov: { configured: boolean; balance?: number };
    techStack: { configured: boolean };
  };
  health: 'excellent' | 'good' | 'fair' | 'poor';
  configuredCount: number;
  totalServices: number;
  recommendations: string[];
}

class NexusAPIService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('nexus_auth_token');
    }
  }

  // Auth management
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('nexus_auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('nexus_auth_token');
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `Request failed with status ${response.status}`,
        };
      }

      return data;
    } catch (error: any) {
      console.error('Nexus API Error:', error);
      return {
        success: false,
        error: error.message || 'Network error - is the backend running?',
      };
    }
  }

  // ==================== AUTH ====================

  async login(email: string, password: string): Promise<APIResponse<{ user: any; token: string }>> {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ==================== COMPANIES ====================

  async getCompanies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<APIResponse<{ companies: Company[]; total: number; page: number; totalPages: number }>> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/crm/companies${query ? '?' + query : ''}`);
  }

  async getCompany(id: string): Promise<APIResponse<Company>> {
    return this.request(`/crm/companies/${id}`);
  }

  async createCompany(data: Partial<Company>): Promise<APIResponse<Company>> {
    return this.request('/crm/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCompany(id: string, data: Partial<Company>): Promise<APIResponse<Company>> {
    return this.request(`/crm/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCompany(id: string): Promise<APIResponse<void>> {
    return this.request(`/crm/companies/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== CONTACTS ====================

  async getContacts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    companyId?: string;
    status?: string;
  }): Promise<APIResponse<{ contacts: Contact[]; total: number; page: number; totalPages: number }>> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/crm/contacts${query ? '?' + query : ''}`);
  }

  async getContact(id: string): Promise<APIResponse<Contact>> {
    return this.request(`/crm/contacts/${id}`);
  }

  async createContact(data: Partial<Contact>): Promise<APIResponse<Contact>> {
    return this.request('/crm/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContact(id: string, data: Partial<Contact>): Promise<APIResponse<Contact>> {
    return this.request(`/crm/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContact(id: string): Promise<APIResponse<void>> {
    return this.request(`/crm/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== DEALS ====================

  async getDeals(params?: {
    page?: number;
    limit?: number;
    stage?: string;
    companyId?: string;
  }): Promise<APIResponse<{ deals: Deal[]; total: number; page: number; totalPages: number }>> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/crm/deals${query ? '?' + query : ''}`);
  }

  async createDeal(data: Partial<Deal>): Promise<APIResponse<Deal>> {
    return this.request('/crm/deals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== ACTIVITIES ====================

  async getActivities(params?: {
    page?: number;
    limit?: number;
    type?: string;
    companyId?: string;
    dealId?: string;
    status?: string;
  }): Promise<APIResponse<{ activities: Activity[]; total: number }>> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/crm/activities${query ? '?' + query : ''}`);
  }

  async createActivity(data: Partial<Activity>): Promise<APIResponse<Activity>> {
    return this.request('/crm/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== DOMAIN LEADS ====================

  async getLeads(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    minScore?: number;
    campaignId?: string;
  }): Promise<APIResponse<{ leads: DomainLead[]; total: number; page: number; totalPages: number }>> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/leads/domains${query ? '?' + query : ''}`);
  }

  async getLead(id: string): Promise<APIResponse<DomainLead>> {
    return this.request(`/leads/domains/${id}`);
  }

  async createLead(domain: string, notes?: string): Promise<APIResponse<DomainLead>> {
    return this.request('/leads/domains', {
      method: 'POST',
      body: JSON.stringify({ domain, notes }),
    });
  }

  async updateLead(id: string, data: Partial<DomainLead>): Promise<APIResponse<DomainLead>> {
    return this.request(`/leads/domains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string): Promise<APIResponse<void>> {
    return this.request(`/leads/domains/${id}`, {
      method: 'DELETE',
    });
  }

  async enrichLead(id: string, options?: {
    skipWhois?: boolean;
    skipTechStack?: boolean;
    skipEmailFinder?: boolean;
    preferredEmailSource?: 'hunter' | 'snov' | 'both';
  }): Promise<APIResponse<DomainLead>> {
    return this.request(`/leads/domains/${id}/enrich`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    });
  }

  async assignLead(id: string, userId: string): Promise<APIResponse<DomainLead>> {
    return this.request(`/leads/domains/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async convertLead(id: string, data: {
    company_name?: string;
    company_industry?: string;
    contact_first_name?: string;
    contact_last_name?: string;
    contact_email?: string;
    create_contact?: boolean;
  }): Promise<APIResponse<{ lead: DomainLead; company: Company; contact?: Contact }>> {
    return this.request(`/leads/domains/${id}/convert`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Bulk operations
  async bulkImportLeads(data: {
    domains: string[];
    assign_to?: string;
    campaign_id?: string;
    auto_enrich?: boolean;
  }): Promise<APIResponse<{ imported: number; duplicates: number; errors: string[] }>> {
    return this.request('/leads/domains/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bulkUpdateLeads(data: {
    ids: string[];
    status?: string;
    assigned_to?: string;
    campaign_id?: string;
  }): Promise<APIResponse<{ updated: number }>> {
    return this.request('/leads/domains/bulk', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async bulkDeleteLeads(ids: string[]): Promise<APIResponse<{ deleted: number }>> {
    return this.request(`/leads/domains/bulk?ids=${ids.join(',')}`, {
      method: 'DELETE',
    });
  }

  getExportUrl(params?: {
    status?: string;
    minScore?: number;
    ids?: string[];
    format?: 'csv' | 'json';
  }): string {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.minScore) query.set('minScore', params.minScore.toString());
    if (params?.ids) query.set('ids', params.ids.join(','));
    if (params?.format) query.set('format', params.format);
    return `${API_BASE_URL}/api/leads/domains/export?${query.toString()}`;
  }

  // ==================== LEAD STATS ====================

  async getLeadStats(days?: number): Promise<APIResponse<LeadStats>> {
    const query = days ? `?days=${days}` : '';
    return this.request(`/leads/stats${query}`);
  }

  async getEnrichmentStatus(): Promise<APIResponse<EnrichmentStatus>> {
    return this.request('/leads/enrichment-status');
  }

  // ==================== CAMPAIGNS ====================

  async getCampaigns(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<APIResponse<{ campaigns: Campaign[]; total: number; page: number; totalPages: number }>> {
    const query = params ? new URLSearchParams(params as any).toString() : '';
    return this.request(`/leads/campaigns${query ? '?' + query : ''}`);
  }

  async getCampaign(id: string): Promise<APIResponse<Campaign>> {
    return this.request(`/leads/campaigns/${id}`);
  }

  async createCampaign(data: Partial<Campaign>): Promise<APIResponse<Campaign>> {
    return this.request('/leads/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<APIResponse<Campaign>> {
    return this.request(`/leads/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string): Promise<APIResponse<void>> {
    return this.request(`/leads/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== DASHBOARD STATS ====================

  async getDashboardOverview(): Promise<APIResponse<{
    companies: { total: number; active: number; new_this_month: number };
    contacts: { total: number; leads: number; customers: number };
    deals: { total: number; value: number; won_this_month: number };
    leads: { total: number; new: number; converted: number; avg_score: number };
  }>> {
    // Aggregate stats from multiple endpoints
    const [companies, contacts, deals, leadStats] = await Promise.all([
      this.getCompanies({ limit: 1 }),
      this.getContacts({ limit: 1 }),
      this.getDeals({ limit: 1 }),
      this.getLeadStats(30),
    ]);

    return {
      success: true,
      data: {
        companies: {
          total: companies.data?.total || 0,
          active: 0,
          new_this_month: 0,
        },
        contacts: {
          total: contacts.data?.total || 0,
          leads: 0,
          customers: 0,
        },
        deals: {
          total: deals.data?.total || 0,
          value: 0,
          won_this_month: 0,
        },
        leads: {
          total: leadStats.data?.overview?.totalLeads || 0,
          new: leadStats.data?.overview?.newLeads || 0,
          converted: leadStats.data?.overview?.convertedLeads || 0,
          avg_score: leadStats.data?.overview?.avgScore || 0,
        },
      },
    };
  }

  // ==================== HEALTH CHECK ====================

  async healthCheck(): Promise<{ connected: boolean; latency?: number; error?: string }> {
    const start = Date.now();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
      });
      const latency = Date.now() - start;
      return { connected: response.ok || response.status === 401, latency };
    } catch (error: any) {
      return { connected: false, error: error.message };
    }
  }
}

// Export singleton instance
export const nexusApi = new NexusAPIService();

// Export class for custom instances
export { NexusAPIService };
