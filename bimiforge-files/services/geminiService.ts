import { GoogleGenerativeAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.warn("⚠️ Gemini API key not found. Set VITE_GEMINI_API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export interface BimiConversionOptions {
  brandName: string;
  preserveColors?: boolean;
  maxComplexity?: 'low' | 'medium' | 'high';
}

/**
 * Convert any image to BIMI-compliant SVG Tiny 1.2 (Tiny-PS)
 */
export async function convertToBimiSvg(
  imageData: string | File,
  options: BimiConversionOptions
): Promise<string> {
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 8192,
    }
  });

  let imageBase64 = '';
  let mimeType = 'image/png';

  // Handle File or base64 string
  if (typeof imageData === 'string') {
    // Already base64
    imageBase64 = imageData.replace(/^data:image\/\w+;base64,/, '');
    const mimeMatch = imageData.match(/^data:(image\/\w+);base64,/);
    if (mimeMatch) mimeType = mimeMatch[1];
  } else {
    // Convert File to base64
    const buffer = await imageData.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    imageBase64 = btoa(String.fromCharCode(...bytes));
    mimeType = imageData.type || 'image/png';
  }

  const prompt = `You are an expert SVG vectorization engine specializing in BIMI (Brand Indicators for Message Identification) compliance.

**CRITICAL REQUIREMENTS - SVG Tiny 1.2 Portable/Secure (Tiny-PS) Profile:**

1. **Strict SVG Structure:**
   - XML declaration: <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
   - Root element MUST include: version="1.2" baseProfile="tiny-ps"
   - ViewBox: 0 0 1080 1080 (standard BIMI dimensions)
   - Width and height: 512x512 (optimal rendering)
   - Namespace: xmlns="http://www.w3.org/2000/svg"

2. **FORBIDDEN Elements (will cause rejection):**
   - NO <script> tags
   - NO <foreignObject>
   - NO external resources (xlink:href to external URLs)
   - NO base64-embedded raster images
   - NO <use> elements referencing external files
   - NO CSS animations or transitions
   - NO filters, masks, or gradients (use solid colors only)
   - NO text elements with external fonts

3. **ALLOWED Elements:**
   - <title> (brand name)
   - <path> with d attribute (primary shapes)
   - <rect>, <circle>, <ellipse>, <line>, <polyline>, <polygon>
   - <g> for grouping (with transform only)
   - Solid fill colors (hex format)
   - Simple stroke properties

4. **Optimization:**
   - Minimize path complexity (reduce unnecessary points)
   - Use fill over stroke when possible
   - Combine similar shapes into single paths
   - Remove decimal precision beyond 2 places
   - No comments or metadata

**TASK:**
Analyze the provided ${mimeType} image for "${options.brandName}" and generate a production-ready BIMI-compliant SVG Tiny 1.2 (Tiny-PS) logo.

- Preserve brand recognition (key shapes, proportions)
- Use vector paths only (no raster embedding)
${options.preserveColors ? '- Preserve original color palette' : '- Optimize color palette for clarity'}
- Ensure high visual fidelity at small sizes (32x32 to 512x512px)
- Target complexity: ${options.maxComplexity || 'medium'}

**OUTPUT FORMAT:**
Return ONLY the complete SVG code. No explanations. No markdown code blocks. Just pure XML starting with <?xml and ending with </svg>.`;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: imageBase64
      }
    },
    { text: prompt }
  ]);

  const response = result.response;
  let svgCode = response.text();

  // Clean up response (remove markdown code blocks if present)
  svgCode = svgCode.replace(/```xml\n?/g, '').replace(/```svg\n?/g, '').replace(/```\n?/g, '').trim();

  // Validate basic SVG structure
  if (!svgCode.startsWith('<?xml') && !svgCode.startsWith('<svg')) {
    throw new Error('Generated output is not valid SVG');
  }

  if (!svgCode.includes('baseProfile="tiny-ps"') && !svgCode.includes("baseProfile='tiny-ps'")) {
    console.warn('⚠️ Generated SVG missing Tiny-PS profile. Attempting to fix...');
    // Auto-fix if missing
    svgCode = svgCode.replace(
      /<svg([^>]*)>/,
      '<svg version="1.2" baseProfile="tiny-ps" xmlns="http://www.w3.org/2000/svg"$1>'
    );
  }

  return svgCode;
}

/**
 * Validate and sanitize pasted SVG code for BIMI compliance
 */
export async function sanitizePastedSvg(
  svgCode: string,
  brandName: string
): Promise<string> {
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8192,
    }
  });

  const prompt = `You are an SVG compliance validator for BIMI (Brand Indicators for Message Identification).

**YOUR TASK:**
Take the provided SVG code and convert it to be 100% BIMI-compliant (SVG Tiny 1.2 Portable/Secure).

**CRITICAL FIXES REQUIRED:**

1. **Structure:**
   - Add XML declaration if missing: <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
   - Ensure root <svg> has: version="1.2" baseProfile="tiny-ps"
   - Set viewBox="0 0 1080 1080" (standard BIMI)
   - Set width="512" height="512"
   - Add xmlns="http://www.w3.org/2000/svg"

2. **REMOVE/REPLACE:**
   - ALL <script> tags → DELETE
   - ALL <foreignObject> → DELETE
   - ALL external xlink:href → Convert to inline or DELETE
   - ALL base64 images → Convert to vector paths or DELETE
   - ALL filters → Remove (use solid colors)
   - ALL gradients → Convert to solid fills
   - ALL CSS animations → Remove
   - ALL <style> blocks → Convert to inline attributes
   - ALL text with web fonts → Use system fonts or convert to paths

3. **Add:**
   - <title>${brandName}</title> as first child of <svg>

**OUTPUT:**
Return ONLY the sanitized SVG code. No explanations. No markdown. Pure XML.`;

  const result = await model.generateContent([
    { text: `SVG Code to Sanitize:\n\n${svgCode}` },
    { text: prompt }
  ]);

  let sanitized = result.response.text();
  sanitized = sanitized.replace(/```xml\n?/g, '').replace(/```svg\n?/g, '').replace(/```\n?/g, '').trim();

  return sanitized;
}
