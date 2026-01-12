export type OpportunityStatus = 'NEW' | 'QUALIFIED' | 'DRAFTING' | 'SUBMITTED' | 'AWARDED' | 'LOST';

export interface NaicsCode {
  code: string;
  desc: string;
}

export interface CompanyProfile {
  name: string;
  location: string;
  uei: string;
  cage: string;
  hubStatus: string;
  certifications: string[];
  naics: NaicsCode[];
  aggressiveTarget: number;
  strategyDescription: string;
}

export interface Opportunity {
  id: string;
  title: string;
  agency: string;
  source: 'SAM.gov' | 'Grants.gov' | 'Texas CMBL' | 'DIR';
  naics: string;
  value: number;
  postedDate: string;
  deadline: string;
  status: OpportunityStatus;
  aiScore: number;
  matchReason: string;
  description: string;
  setAside?: string;
}

export interface AgentStatus {
  name: string;
  status: 'active' | 'idle' | 'error';
  lastRun: string;
  itemsFound: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: any;
}

export interface ProposalRequest {
  opportunityId: string;
  strategy: 'aggressive' | 'standard' | 'compliance';
  undercutPercent: number;
}
