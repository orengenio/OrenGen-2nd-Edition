// API Client for Frontend
// Handles all API requests with authentication

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class APIClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
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
      const response = await fetch(`${API_URL}/api${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  // Auth endpoints
  async register(email: string, password: string, name: string, role?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    this.clearToken();
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // CRM - Companies
  async getCompanies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/crm/companies${query ? '?' + query : ''}`);
  }

  async getCompany(id: string) {
    return this.request(`/crm/companies/${id}`);
  }

  async createCompany(data: any) {
    return this.request('/crm/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCompany(id: string, data: any) {
    return this.request(`/crm/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCompany(id: string) {
    return this.request(`/crm/companies/${id}`, {
      method: 'DELETE',
    });
  }

  // CRM - Contacts
  async getContacts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    companyId?: string;
    status?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/crm/contacts${query ? '?' + query : ''}`);
  }

  async getContact(id: string) {
    return this.request(`/crm/contacts/${id}`);
  }

  async createContact(data: any) {
    return this.request('/crm/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContact(id: string, data: any) {
    return this.request(`/crm/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContact(id: string) {
    return this.request(`/crm/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // CRM - Deals
  async getDeals(params?: {
    page?: number;
    limit?: number;
    stage?: string;
    companyId?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/crm/deals${query ? '?' + query : ''}`);
  }

  async createDeal(data: any) {
    return this.request('/crm/deals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // CRM - Activities
  async getActivities(params?: {
    page?: number;
    limit?: number;
    type?: string;
    companyId?: string;
    dealId?: string;
    status?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/crm/activities${query ? '?' + query : ''}`);
  }

  async createActivity(data: any) {
    return this.request('/crm/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Leads
  async getLeads(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    minScore?: number;
    campaignId?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/leads/domains${query ? '?' + query : ''}`);
  }

  async getLead(id: string) {
    return this.request(`/leads/domains/${id}`);
  }

  async createLead(domain: string, notes?: string) {
    return this.request('/leads/domains', {
      method: 'POST',
      body: JSON.stringify({ domain, notes }),
    });
  }

  async updateLead(id: string, data: {
    status?: string;
    notes?: string;
    assigned_to?: string;
    lead_score?: number;
  }) {
    return this.request(`/leads/domains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string) {
    return this.request(`/leads/domains/${id}`, {
      method: 'DELETE',
    });
  }

  async enrichLead(id: string, options?: {
    skipWhois?: boolean;
    skipTechStack?: boolean;
    skipEmailFinder?: boolean;
    preferredEmailSource?: 'hunter' | 'snov' | 'both';
  }) {
    return this.request(`/leads/domains/${id}/enrich`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    });
  }

  async assignLead(id: string, userId: string) {
    return this.request(`/leads/domains/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async convertLead(id: string, data: {
    company_name?: string;
    company_industry?: string;
    company_size?: string;
    contact_first_name?: string;
    contact_last_name?: string;
    contact_email?: string;
    contact_job_title?: string;
    create_contact?: boolean;
  }) {
    return this.request(`/leads/domains/${id}/convert`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Leads - Bulk Operations
  async bulkImportLeads(data: {
    domains: string[];
    assign_to?: string;
    campaign_id?: string;
    auto_enrich?: boolean;
  }) {
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
  }) {
    return this.request('/leads/domains/bulk', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async bulkDeleteLeads(ids: string[]) {
    return this.request(`/leads/domains/bulk?ids=${ids.join(',')}`, {
      method: 'DELETE',
    });
  }

  async exportLeads(params?: {
    status?: string;
    minScore?: number;
    ids?: string[];
    format?: 'csv' | 'json';
  }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.minScore) query.set('minScore', params.minScore.toString());
    if (params?.ids) query.set('ids', params.ids.join(','));
    if (params?.format) query.set('format', params.format);

    // Return download URL for frontend to use
    return `/api/leads/domains/export?${query.toString()}`;
  }

  // Leads - Stats
  async getLeadStats(days?: number) {
    const query = days ? `?days=${days}` : '';
    return this.request(`/leads/stats${query}`);
  }

  async getEnrichmentStatus() {
    return this.request('/leads/enrichment-status');
  }

  // Leads - Campaigns
  async getCampaigns(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/leads/campaigns${query ? '?' + query : ''}`);
  }

  async getCampaign(id: string) {
    return this.request(`/leads/campaigns/${id}`);
  }

  async createCampaign(data: {
    name: string;
    description?: string;
    filters?: {
      tlds?: string[];
      technologies?: string[];
      excludeTechnologies?: string[];
      hasContactForm?: boolean;
      hasLiveChat?: boolean;
      registeredAfter?: string;
      registeredBefore?: string;
      countries?: string[];
      minLeadScore?: number;
      keywords?: string[];
    };
  }) {
    return this.request('/leads/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(id: string, data: {
    name?: string;
    description?: string;
    status?: 'draft' | 'active' | 'paused' | 'completed';
    filters?: any;
  }) {
    return this.request(`/leads/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string) {
    return this.request(`/leads/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // Website Builder
  async getWebsiteProjects(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/websites/projects${query ? '?' + query : ''}`);
  }

  async createWebsiteProject(data: any) {
    return this.request('/websites/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWebsiteQuestions(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request(`/websites/questions${query}`);
  }

  async generateWireframe(projectId: string) {
    return this.request(`/websites/projects/${projectId}/generate-wireframe`, {
      method: 'POST',
    });
  }

  async generateCode(projectId: string, framework: string = 'react') {
    return this.request(`/websites/projects/${projectId}/generate-code`, {
      method: 'POST',
      body: JSON.stringify({ framework }),
    });
  }
}

// Export singleton instance
export const apiClient = new APIClient();
