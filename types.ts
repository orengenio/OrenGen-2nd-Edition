export enum AppView {
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  STUDIO = 'STUDIO',
  SETTINGS = 'SETTINGS'
}

export enum BlueprintTab {
  OVERVIEW = 'OVERVIEW',
  PRD = 'PRD',
  WIREFRAMES = 'WIREFRAMES',
  COPY = 'COPY',
  DESIGN_SYSTEM = 'DESIGN_SYSTEM',
  POLICIES = 'POLICIES',
  ASSETS = 'ASSETS',
  CONTENT_STUDIO = 'CONTENT_STUDIO',
  DEV_HANDOFF = 'DEV_HANDOFF'
}

export interface ReferenceLink {
  id: string;
  url: string;
  type: 'COMPETITOR' | 'INSPIRATION' | 'REQUIREMENTS' | 'BRAND' | 'LEGAL' | 'TECH' | 'OTHER';
  note: string;
}

export interface ProjectData {
  id: string;
  name: string;
  category: string;
  targetUsers: string;
  corePromise: string;
  userActions: string[];
  monetization: string;
  platforms: string[];
  integrations: string[];
  complianceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  brandTone: string;
  referenceLinks: ReferenceLink[];
  screenshots?: string[]; // Base64
}

export interface WireframeComponent {
  type: 'Button' | 'Input' | 'Image' | 'Text' | 'Card' | 'Navigation' | 'List';
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface WireframeScreen {
  id: string;
  title: string;
  description: string;
  components: WireframeComponent[];
}

export interface Artifacts {
  prd: string;
  wireframes: string; // JSON String of WireframeScreen[]
  copyDeck: string;
  designSystem: string;
  policies: string;
  tickets: string;
  generatedAssets: string[]; // URLs/Base64
  insights: string;
  marketingPlan: string;
  marketingGrounding?: { title: string; url: string }[];
}

export interface Project {
  data: ProjectData;
  artifacts: Artifacts;
  status: 'DRAFT' | 'GENERATING' | 'COMPLETE';
  lastUpdated: number;
}
