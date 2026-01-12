export interface CampaignData {
  subjectLines: string[];
  body: string;
  imagePromptSuggestion: string;
}

export type ImageResolution = '1K' | '2K' | '4K';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  resolution: ImageResolution;
}
