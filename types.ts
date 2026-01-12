export enum AppMode {
  TRANSFORM = 'TRANSFORM',
  GENERATE = 'GENERATE'
}

export enum IconStyle {
  EMOJI_3D = '3D Emoji',
  FLAT_ICON = 'Flat App Icon',
  PIXEL_ART = 'Pixel Art',
  STICKER = 'Sticker',
  CLAYMORPHISM = 'Claymorphism',
  CUSTOM = 'Custom Edit'
}

export type ImageSize = '1K' | '2K' | '4K';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  mode: AppMode;
  timestamp: number;
}
