import { Opportunity, AgentStatus, CompanyProfile, NaicsCode } from './types';

export const ADMIN_PROFILE: CompanyProfile = {
  name: "OrenGen Worldwide LLC",
  location: "Mansfield, TX 76063",
  uei: "RX16QFYT6YM5",
  cage: "Pending",
  hubStatus: "Active (Approved May 22, 2025)",
  certifications: ["Texas HUB", "MBE (Pending)", "SBA 8(a) (Planned)"],
  aggressiveTarget: 8000000,
  strategyDescription: "Targeting $8M in annual awards with 5-7% pricing undercut logic.",
  naics: [
    { code: "541519", desc: "Other Computer Related Services" },
    { code: "541513", desc: "Computer Facilities Management" },
    { code: "541511", desc: "Custom Computer Programming" },
    { code: "541512", desc: "Computer Systems Design" },
    { code: "518210", desc: "Data Processing/Hosting" },
    { code: "519290", desc: "All Other Information Services" },
    { code: "541613", desc: "Marketing Consulting Services" },
    { code: "541618", desc: "Other Management Consulting" },
    { code: "541870", desc: "Advertising Agencies" },
    { code: "541910", desc: "Marketing Research" },
    { code: "541430", desc: "Graphic Design" },
    { code: "541860", desc: "Direct Mail Advertising" },
    { code: "541820", desc: "Public Relations" },
    { code: "512110", desc: "Motion Picture/Video Production" },
    { code: "611420", desc: "Computer Training" },
  ]
};

export const DEFAULT_CLIENT_PROFILE: CompanyProfile = {
  name: "My Company Inc.",
  location: "City, State, Zip",
  uei: "ENTER-UEI-HERE",
  cage: "ENTER-CAGE",
  hubStatus: "N/A",
  certifications: [],
  aggressiveTarget: 1000000,
  strategyDescription: "Standard growth strategy.",
  naics: [
    { code: "541511", desc: "Custom Computer Programming" }
  ]
};

// Export CORE_NAICS for backwards compatibility with UI components if needed directly
export const CORE_NAICS = ADMIN_PROFILE.naics;

export const MOCK_AGENTS: AgentStatus[] = [
  { name: "SAM Agent", status: 'active', lastRun: "Just now", itemsFound: 12 },
  { name: "Grants Agent", status: 'active', lastRun: "5 mins ago", itemsFound: 3 },
  { name: "CMBL Agent", status: 'active', lastRun: "2 mins ago", itemsFound: 8 },
  { name: "AI Ranker", status: 'active', lastRun: "Processing", itemsFound: 23 },
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "OPP-2025-001",
    title: "AI-Driven CRM Implementation",
    agency: "Department of Veterans Affairs",
    source: "SAM.gov",
    naics: "541512",
    value: 450000,
    postedDate: "2025-06-10",
    deadline: "2025-07-01",
    status: "QUALIFIED",
    aiScore: 98,
    matchReason: "Perfect NAICS match. High set-aside probability.",
    description: "Request for cloud-based CRM solutions utilizing artificial intelligence for patient intake.",
    setAside: "Total Small Business"
  },
  {
    id: "OPP-2025-002",
    title: "Statewide Digital Marketing Campaign",
    agency: "Texas Department of Transportation",
    source: "Texas CMBL",
    naics: "541810",
    value: 125000,
    postedDate: "2025-06-11",
    deadline: "2025-06-25",
    status: "NEW",
    aiScore: 92,
    matchReason: "Local preference via HUB certification.",
    description: "Marketing and PR services for new highway safety initiative.",
    setAside: "HUB Only"
  },
  {
    id: "OPP-2025-003",
    title: "Cybersecurity Training Services",
    agency: "National Science Foundation",
    source: "Grants.gov",
    naics: "611420",
    value: 750000,
    postedDate: "2025-06-09",
    deadline: "2025-08-15",
    status: "DRAFTING",
    aiScore: 88,
    matchReason: "Grant aligns with tech training capabilities.",
    description: "Develop and deliver cybersecurity curriculum for remote workforce.",
    setAside: "N/A"
  }
];

// A comprehensive list of common government contracting NAICS codes for the lookup tool
export const NAICS_DATABASE: NaicsCode[] = [
    // 541 - Professional, Scientific, and Technical Services
    { code: "541110", desc: "Offices of Lawyers" },
    { code: "541211", desc: "Offices of Certified Public Accountants" },
    { code: "541310", desc: "Architectural Services" },
    { code: "541330", desc: "Engineering Services" },
    { code: "541430", desc: "Graphic Design Services" },
    { code: "541511", desc: "Custom Computer Programming Services" },
    { code: "541512", desc: "Computer Systems Design Services" },
    { code: "541513", desc: "Computer Facilities Management Services" },
    { code: "541519", desc: "Other Computer Related Services" },
    { code: "541611", desc: "Administrative Management and General Management Consulting Services" },
    { code: "541612", desc: "Human Resources Consulting Services" },
    { code: "541613", desc: "Marketing Consulting Services" },
    { code: "541618", desc: "Other Management Consulting Services" },
    { code: "541620", desc: "Environmental Consulting Services" },
    { code: "541690", desc: "Other Scientific and Technical Consulting Services" },
    { code: "541715", desc: "Research and Development in the Physical, Engineering, and Life Sciences" },
    { code: "541810", desc: "Advertising Agencies" },
    { code: "541820", desc: "Public Relations Agencies" },
    { code: "541910", desc: "Marketing Research and Public Opinion Polling" },
    { code: "541930", desc: "Translation and Interpretation Services" },
    { code: "541990", desc: "All Other Professional, Scientific, and Technical Services" },

    // 518/519 - Information
    { code: "518210", desc: "Data Processing, Hosting, and Related Services" },
    { code: "519130", desc: "Internet Publishing and Broadcasting and Web Search Portals" },

    // 561 - Administrative and Support Services
    { code: "561110", desc: "Office Administrative Services" },
    { code: "561210", desc: "Facilities Support Services" },
    { code: "561320", desc: "Temporary Help Services" },
    { code: "561421", desc: "Telephone Answering Services" },
    { code: "561612", desc: "Security Guards and Patrol Services" },
    { code: "561720", desc: "Janitorial Services" },
    { code: "561730", desc: "Landscaping Services" },
    
    // 236/237/238 - Construction
    { code: "236220", desc: "Commercial and Institutional Building Construction" },
    { code: "237110", desc: "Water and Sewer Line and Related Structures Construction" },
    { code: "237310", desc: "Highway, Street, and Bridge Construction" },
    { code: "238210", desc: "Electrical Contractors and Other Wiring Installation Contractors" },
    { code: "238220", desc: "Plumbing, Heating, and Air-Conditioning Contractors" },

    // 611 - Educational Services
    { code: "611420", desc: "Computer Training" },
    { code: "611430", desc: "Professional and Management Development Training" },
    { code: "611710", desc: "Educational Support Services" }
];