import { IconStyle } from './types';

export const STYLE_PRESETS = [
  {
    id: IconStyle.EMOJI_3D,
    label: '3D Emoji',
    promptSuffix: 'Transform this image into a cute, glossy 3D emoji style icon. Isolate the subject on a transparent background. Output PNG.',
    icon: '😎'
  },
  {
    id: IconStyle.FLAT_ICON,
    label: 'Flat Icon',
    promptSuffix: 'Transform this image into a modern, minimalist flat vector icon design on a transparent background. Simple shapes, solid colors, isolated subject. Output PNG.',
    icon: '📐'
  },
  {
    id: IconStyle.PIXEL_ART,
    label: 'Pixel Art',
    promptSuffix: 'Convert this image into high-quality pixel art on a transparent background. Retro game style, isolated subject. Output PNG.',
    icon: '👾'
  },
  {
    id: IconStyle.STICKER,
    label: 'Sticker',
    promptSuffix: 'Make this look like a die-cut sticker with a white border on a transparent background. Vector illustration style, isolated. Output PNG.',
    icon: '🏷️'
  },
  {
    id: IconStyle.CLAYMORPHISM,
    label: 'Clay',
    promptSuffix: 'Transform this into a soft, claymorphism style 3D render on a transparent background. Matte finish, soft shadows, isolated subject. Output PNG.',
    icon: '🏺'
  },
  {
    id: IconStyle.CUSTOM,
    label: 'Custom Edit',
    promptSuffix: '', // User provides full instruction
    icon: '✨'
  }
];

export const MODEL_FLASH_IMAGE = 'gemini-2.5-flash-image';
export const MODEL_PRO_IMAGE = 'gemini-3-pro-image-preview';