export enum View {
  DASHBOARD = 'DASHBOARD',
  CAMPAIGN_WIZARD = 'CAMPAIGN_WIZARD', // Mautic/MailWizz style
  CONTENT_STUDIO = 'CONTENT_STUDIO',   // WordPress/ImageGen style
  INTELLIGENCE_HUB = 'INTELLIGENCE_HUB', // Search/Maps
  LIVE_VOICE = 'LIVE_VOICE',            // Gemini Live
  AGENT_ORCHESTRATOR = 'AGENT_ORCHESTRATOR' // AI Agents + MCP
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface SearchResult {
  title: string;
  uri: string;
}

export interface MapResult {
  title: string;
  uri: string;
  rating?: number;
  userRatingCount?: number;
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT_2_3 = '2:3',
  LANDSCAPE_3_2 = '3:2',
  PORTRAIT_3_4 = '3:4',
  LANDSCAPE_4_3 = '4:3',
  PORTRAIT_9_16 = '9:16',
  LANDSCAPE_16_9 = '16:9',
  CINEMATIC_21_9 = '21:9'
}