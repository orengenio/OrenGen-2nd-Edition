/**
 * Federal Opportunities Service
 * Integration with SAM.gov API for federal contracting opportunities
 * Also supports Grants.gov for grant opportunities
 */

// Types
export interface FederalOpportunity {
  id: string;
  notice_id: string;
  title: string;
  agency: string;
  sub_agency?: string;
  type: 'Solicitation' | 'PreSolicitation' | 'Combined' | 'Award' | 'Grant' | 'Sources Sought';
  posted_date: string;
  response_deadline: string;
  archive_date?: string;
  set_aside?: string;
  set_aside_code?: string;
  naics_code?: string;
  naics_description?: string;
  psc_code?: string;
  place_of_performance?: {
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  description: string;
  url: string;
  point_of_contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  estimated_value?: {
    min?: number;
    max?: number;
  };
  award_info?: {
    awardee?: string;
    amount?: number;
    date?: string;
  };
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  keywords?: string[];
  match_score?: number;
}

export interface SearchFilters {
  keywords?: string;
  naics_codes?: string[];
  psc_codes?: string[];
  agencies?: string[];
  set_asides?: string[];
  posted_from?: string;
  posted_to?: string;
  response_deadline_from?: string;
  response_deadline_to?: string;
  opportunity_type?: string[];
  state?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResults {
  opportunities: FederalOpportunity[];
  total: number;
  offset: number;
  limit: number;
}

export interface AgencySpending {
  agency: string;
  total: number;
  year: number;
  contracts: number;
  avg_value: number;
}

export interface CompetitorInfo {
  name: string;
  duns?: string;
  uei?: string;
  recent_awards: Array<{
    title: string;
    agency: string;
    value: number;
    date: string;
  }>;
  win_rate?: number;
  total_value?: number;
}

// SAM.gov API Configuration
const SAM_API_BASE = 'https://api.sam.gov/opportunities/v2';
const GRANTS_API_BASE = 'https://www.grants.gov/grantsws/rest/opportunities';

// Set-aside codes mapping
export const SET_ASIDE_CODES: Record<string, string> = {
  SBA: 'Small Business',
  SBP: 'Small Business Set-Aside',
  '8A': '8(a) Business Development',
  '8AN': '8(a) Sole Source',
  HZC: 'HUBZone',
  SDVOSBS: 'Service-Disabled Veteran-Owned',
  SDVOSBC: 'SDVOSB Sole Source',
  WOSB: 'Women-Owned Small Business',
  EDWOSB: 'Economically Disadvantaged WOSB',
  VSB: 'Veteran-Owned Small Business',
};

// Opportunity types
export const OPPORTUNITY_TYPES = [
  'Solicitation',
  'PreSolicitation',
  'Combined',
  'Sources Sought',
  'Special Notice',
  'Award Notice',
];

// Main Service Class
export class FederalOpportunitiesService {
  private apiKey: string;
  private tenantId: string;

  constructor(apiKey: string, tenantId: string) {
    this.apiKey = apiKey;
    this.tenantId = tenantId;
  }

  // Search SAM.gov opportunities
  async searchOpportunities(filters: SearchFilters): Promise<SearchResults> {
    const params = new URLSearchParams();

    // Build query parameters
    if (filters.keywords) {
      params.append('q', filters.keywords);
    }
    if (filters.naics_codes?.length) {
      params.append('ncode', filters.naics_codes.join(','));
    }
    if (filters.psc_codes?.length) {
      params.append('psc', filters.psc_codes.join(','));
    }
    if (filters.set_asides?.length) {
      params.append('typeOfSetAside', filters.set_asides.join(','));
    }
    if (filters.posted_from) {
      params.append('postedFrom', filters.posted_from);
    }
    if (filters.posted_to) {
      params.append('postedTo', filters.posted_to);
    }
    if (filters.response_deadline_from) {
      params.append('rdlfrom', filters.response_deadline_from);
    }
    if (filters.state) {
      params.append('state', filters.state);
    }

    params.append('limit', String(filters.limit || 25));
    params.append('offset', String(filters.offset || 0));
    params.append('api_key', this.apiKey);

    try {
      const response = await fetch(`${SAM_API_BASE}/search?${params.toString()}`);

      if (!response.ok) {
        console.error('SAM.gov API error:', await response.text());
        // Return mock data for development
        return this.getMockOpportunities(filters);
      }

      const data = await response.json();
      return this.transformSAMResponse(data);
    } catch (error) {
      console.error('SAM.gov API error:', error);
      // Return mock data for development
      return this.getMockOpportunities(filters);
    }
  }

  // Get opportunity by ID
  async getOpportunity(noticeId: string): Promise<FederalOpportunity | null> {
    try {
      const response = await fetch(
        `${SAM_API_BASE}/opportunities/${noticeId}?api_key=${this.apiKey}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return this.transformSAMOpportunity(data);
    } catch (error) {
      console.error('SAM.gov API error:', error);
      return null;
    }
  }

  // Search grants from Grants.gov
  async searchGrants(keywords: string, limit: number = 25): Promise<FederalOpportunity[]> {
    try {
      const response = await fetch(`${GRANTS_API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keywords,
          oppStatuses: 'forecasted|posted',
          rows: limit,
        }),
      });

      if (!response.ok) {
        return this.getMockGrants(keywords);
      }

      const data = await response.json();
      return this.transformGrantsResponse(data);
    } catch (error) {
      console.error('Grants.gov API error:', error);
      return this.getMockGrants(keywords);
    }
  }

  // Calculate match score based on company profile
  calculateMatchScore(
    opportunity: FederalOpportunity,
    profile: {
      naics_codes?: string[];
      psc_codes?: string[];
      set_asides?: string[];
      keywords?: string[];
      past_performance_agencies?: string[];
    }
  ): number {
    let score = 50; // Base score

    // NAICS match
    if (profile.naics_codes?.includes(opportunity.naics_code || '')) {
      score += 20;
    }

    // PSC match
    if (profile.psc_codes?.includes(opportunity.psc_code || '')) {
      score += 10;
    }

    // Set-aside eligibility
    if (opportunity.set_aside_code && profile.set_asides?.includes(opportunity.set_aside_code)) {
      score += 15;
    }

    // Past performance with agency
    if (profile.past_performance_agencies?.includes(opportunity.agency)) {
      score += 15;
    }

    // Keyword matching
    const oppText = `${opportunity.title} ${opportunity.description}`.toLowerCase();
    const matchedKeywords = profile.keywords?.filter(kw =>
      oppText.includes(kw.toLowerCase())
    ) || [];
    score += Math.min(matchedKeywords.length * 5, 15);

    return Math.min(score, 100);
  }

  // Get agency spending data
  async getAgencySpending(fiscalYear?: number): Promise<AgencySpending[]> {
    // In production, this would call USAspending.gov API
    // For now, return mock data
    return [
      { agency: 'Department of Defense', total: 450000000000, year: 2024, contracts: 125000, avg_value: 3600000 },
      { agency: 'Department of Energy', total: 45000000000, year: 2024, contracts: 8500, avg_value: 5294118 },
      { agency: 'Department of Health and Human Services', total: 38000000000, year: 2024, contracts: 12000, avg_value: 3166667 },
      { agency: 'Department of Homeland Security', total: 25000000000, year: 2024, contracts: 7500, avg_value: 3333333 },
      { agency: 'NASA', total: 22000000000, year: 2024, contracts: 4200, avg_value: 5238095 },
      { agency: 'General Services Administration', total: 18000000000, year: 2024, contracts: 15000, avg_value: 1200000 },
      { agency: 'Department of Veterans Affairs', total: 15000000000, year: 2024, contracts: 9000, avg_value: 1666667 },
    ];
  }

  // Get competitor information
  async getCompetitorInfo(uei: string): Promise<CompetitorInfo | null> {
    // In production, this would call SAM.gov Entity API and USAspending.gov
    // For now, return mock data
    return {
      name: 'Sample Competitor Inc',
      uei: uei,
      recent_awards: [
        { title: 'IT Modernization Support', agency: 'DOE', value: 4200000, date: '2024-01-15' },
        { title: 'Cybersecurity Services', agency: 'DHS', value: 2800000, date: '2023-11-20' },
      ],
      win_rate: 35,
      total_value: 12500000,
    };
  }

  // Track opportunity
  async trackOpportunity(
    opportunityId: string,
    status: 'watching' | 'pursuing' | 'submitted' | 'won' | 'lost'
  ): Promise<void> {
    // In production, store in database
    console.log(`Tracking opportunity ${opportunityId} with status ${status}`);
  }

  // Transform SAM.gov API response
  private transformSAMResponse(data: any): SearchResults {
    const opportunities = (data.opportunitiesData || []).map((opp: any) =>
      this.transformSAMOpportunity(opp)
    );

    return {
      opportunities,
      total: data.totalRecords || opportunities.length,
      offset: data.offset || 0,
      limit: data.limit || 25,
    };
  }

  // Transform single SAM.gov opportunity
  private transformSAMOpportunity(opp: any): FederalOpportunity {
    return {
      id: opp.noticeId || opp.opportunityId,
      notice_id: opp.noticeId,
      title: opp.title,
      agency: opp.department || opp.agency?.name,
      sub_agency: opp.subTier,
      type: opp.type || 'Solicitation',
      posted_date: opp.postedDate,
      response_deadline: opp.responseDeadLine || opp.archiveDate,
      archive_date: opp.archiveDate,
      set_aside: opp.typeOfSetAsideDescription,
      set_aside_code: opp.typeOfSetAside,
      naics_code: opp.naicsCode,
      naics_description: opp.naicsDescription,
      psc_code: opp.classificationCode,
      place_of_performance: opp.placeOfPerformance ? {
        city: opp.placeOfPerformance.city?.name,
        state: opp.placeOfPerformance.state?.name,
        country: opp.placeOfPerformance.country?.name,
        zip: opp.placeOfPerformance.zip,
      } : undefined,
      description: opp.description?.body || opp.description || '',
      url: `https://sam.gov/opp/${opp.noticeId}/view`,
      point_of_contact: opp.pointOfContact ? {
        name: opp.pointOfContact.fullName,
        email: opp.pointOfContact.email,
        phone: opp.pointOfContact.phone,
      } : undefined,
      attachments: opp.resourceLinks?.map((link: any) => ({
        name: link.resourceName,
        url: link.resourceUrl,
        type: link.resourceType,
      })),
    };
  }

  // Transform Grants.gov response
  private transformGrantsResponse(data: any): FederalOpportunity[] {
    return (data.oppHits || []).map((grant: any) => ({
      id: grant.id,
      notice_id: grant.number,
      title: grant.title,
      agency: grant.agency?.name || grant.agencyName,
      type: 'Grant',
      posted_date: grant.openDate,
      response_deadline: grant.closeDate,
      description: grant.synopsis || grant.description || '',
      url: `https://www.grants.gov/search-results-detail/${grant.id}`,
      estimated_value: grant.awardCeiling ? {
        min: grant.awardFloor,
        max: grant.awardCeiling,
      } : undefined,
    }));
  }

  // Mock data for development
  private getMockOpportunities(filters: SearchFilters): SearchResults {
    const mockOpps: FederalOpportunity[] = [
      {
        id: 'mock-1',
        notice_id: 'W912DQ24Q1234',
        title: 'Enterprise Cloud Migration Services',
        agency: 'Department of Defense',
        sub_agency: 'Army Corps of Engineers',
        type: 'Solicitation',
        posted_date: '2024-01-15',
        response_deadline: '2024-02-15',
        set_aside: 'Small Business Set-Aside',
        set_aside_code: 'SBP',
        naics_code: '541512',
        naics_description: 'Computer Systems Design Services',
        description: 'The Army Corps of Engineers requires cloud migration services for legacy systems...',
        url: 'https://sam.gov/opp/mock-1/view',
        estimated_value: { min: 1000000, max: 5000000 },
        match_score: 85,
      },
      {
        id: 'mock-2',
        notice_id: 'DE-SOL-0012345',
        title: 'Cybersecurity Operations Support',
        agency: 'Department of Energy',
        type: 'Combined',
        posted_date: '2024-01-10',
        response_deadline: '2024-02-28',
        set_aside: '8(a) Business Development',
        set_aside_code: '8A',
        naics_code: '541519',
        naics_description: 'Other Computer Related Services',
        description: 'DOE seeks qualified contractors for cybersecurity operations center support...',
        url: 'https://sam.gov/opp/mock-2/view',
        estimated_value: { min: 2000000, max: 10000000 },
        match_score: 92,
      },
      {
        id: 'mock-3',
        notice_id: 'HHSN-2024-00123',
        title: 'Healthcare Data Analytics Platform',
        agency: 'Department of Health and Human Services',
        sub_agency: 'Centers for Medicare & Medicaid Services',
        type: 'PreSolicitation',
        posted_date: '2024-01-08',
        response_deadline: '2024-03-15',
        naics_code: '541511',
        naics_description: 'Custom Computer Programming Services',
        description: 'CMS requires a modern data analytics platform for healthcare claims analysis...',
        url: 'https://sam.gov/opp/mock-3/view',
        estimated_value: { min: 5000000, max: 25000000 },
        match_score: 78,
      },
    ];

    // Filter based on search criteria
    let filtered = mockOpps;
    if (filters.keywords) {
      const kw = filters.keywords.toLowerCase();
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(kw) ||
        opp.description.toLowerCase().includes(kw)
      );
    }

    return {
      opportunities: filtered,
      total: filtered.length,
      offset: filters.offset || 0,
      limit: filters.limit || 25,
    };
  }

  // Mock grants for development
  private getMockGrants(keywords: string): FederalOpportunity[] {
    return [
      {
        id: 'grant-1',
        notice_id: 'HHS-2024-ACF-1234',
        title: 'Community Health Innovation Grant',
        agency: 'Health and Human Services',
        type: 'Grant',
        posted_date: '2024-01-05',
        response_deadline: '2024-04-01',
        description: 'Funding opportunity for community health organizations to implement innovative solutions...',
        url: 'https://grants.gov/view/grant-1',
        estimated_value: { min: 100000, max: 500000 },
        match_score: 72,
      },
    ];
  }
}

// Factory function
export function createFederalOpportunitiesService(
  apiKey: string,
  tenantId: string
): FederalOpportunitiesService {
  return new FederalOpportunitiesService(apiKey, tenantId);
}

// Get API key from environment
export function getSAMApiKey(): string {
  return process.env.SAM_GOV_API_KEY || '';
}
