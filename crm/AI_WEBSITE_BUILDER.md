# AI Website Builder (Claude Code + Gemini)

## Overview
Automated website builder that asks the right questions, generates wireframes, designs perfect websites, and builds production-ready code using Claude Code API and Google Gemini Pro.

## How It Works

```
Client Intake → AI Questions → Wireframe (Claude) → Design (Gemini) → Code (Claude) → Deploy
```

### 6 Stages

1. **Questionnaire** (5-10 min) - 40 smart questions across 6 categories
2. **Wireframing** (2-3 min) - Claude generates wireframe based on responses
3. **Design** (3-5 min) - Gemini creates color palette, typography, mockups
4. **Development** (5-15 min) - Claude writes production-ready code
5. **Review** (Client approval) - Client reviews and requests changes
6. **Delivery** (1 min) - Auto-deploy to Vercel/Netlify/Cloudflare

## Questionnaire System

### 6 Categories (40 Questions)

#### 1. Business Questions (6 questions)
- Business name
- Industry
- Primary goal (leads, sales, branding, etc.)
- Target audience
- Value proposition
- Existing website?

#### 2. Branding Questions (5 questions)
- Logo availability
- Brand colors
- Tone (professional, friendly, playful, etc.)
- Brand guidelines
- Logo upload

#### 3. Features Questions (7 questions)
- Required pages (Home, About, Services, etc.)
- E-commerce functionality
- Blog needed?
- Booking/appointments
- Contact form
- User authentication
- Third-party integrations (CRM, analytics, payment)

#### 4. Content Questions (5 questions)
- Existing content availability
- Number of products/services
- Professional photos
- Content writing assistance
- Priority call-to-actions

#### 5. Design Questions (5 questions)
- Preferred style (Modern, Classic, Minimal, Bold, etc.)
- Inspirational websites (URLs)
- Light/Dark theme
- Animations preference
- Sticky navigation

#### 6. Technical Questions (5 questions)
- Mobile responsiveness (always yes)
- SEO optimization
- Analytics tracking
- Domain name ownership
- Hosting included?

### Smart Conditional Logic

Questions adapt based on previous answers:
- E-commerce questions only if user selected e-commerce
- Blog questions only if blog is needed
- Product questions only if selling products

## AI Agents

### Agent 1: Claude Code (Wireframing + Development)

**Role:** Structure & Code Expert

**Wireframe Generation Prompt:**
```
You are an expert web architect. Based on these client responses:

{JSON of all questionnaire responses}

Generate a comprehensive wireframe structure including:
1. All required pages with sections
2. Navigation structure (top/side/hamburger/mega-menu)
3. Layout for each section (single/two/three-column/grid)
4. Content hierarchy
5. User flow

Return JSON format matching the Wireframe interface.
```

**Code Generation Prompt:**
```
You are a senior full-stack developer. Generate production-ready code for this website:

Business: {businessName}
Framework: {selectedFramework} (React/Next.js/HTML/Vue/Astro)
Wireframe: {wireframeJSON}
Design: {designJSON}

Requirements:
- Mobile-first responsive design
- SEO optimized
- Performance optimized (Core Web Vitals)
- Accessibility (WCAG 2.1 AA)
- Modern best practices
- Clean, maintainable code
- Comments explaining key sections

Generate complete file structure with all necessary files.
```

### Agent 2: Gemini Pro (Design)

**Role:** Visual Design Expert

**Design Generation Prompt:**
```
You are an expert UI/UX designer. Create a beautiful, cohesive design system:

Client Profile:
- Industry: {industry}
- Style: {designStyle}
- Tone: {brandTone}
- Audience: {targetAudience}
- Inspiration: {inspirationalWebsites}

Generate:
1. Color Palette (primary, secondary, accent, bg, text + dark mode)
2. Typography System (heading, body, mono fonts with scale)
3. Component Designs (buttons, cards, forms, nav, footer)
4. Design Theme (mood, style keywords)

Return JSON format matching the Design interface.

Make it stunning, professional, and conversion-optimized.
```

## Workflow

### Step 1: Start Project (API/UI)

```typescript
POST /api/website-projects

{
  "projectName": "Acme Corp Website",
  "companyId": "uuid", // Link to CRM company
  "contactId": "uuid"  // Link to CRM contact
}

Response:
{
  "id": "project-uuid",
  "status": "questionnaire",
  "totalQuestions": 40,
  "questionsAnswered": 0
}
```

### Step 2: Get Questions

```typescript
GET /api/website-questions?category=business

Response:
[
  {
    "id": "q1",
    "category": "business",
    "question": "What is the name of your business?",
    "type": "text",
    "required": true,
    "order": 1
  },
  // ... more questions
]
```

### Step 3: Submit Responses

```typescript
POST /api/website-projects/:id/responses

{
  "responses": [
    {
      "questionId": "q1",
      "question": "What is the name of your business?",
      "answer": "Acme Corp"
    }
  ]
}
```

### Step 4: Generate Wireframe (Auto or Manual Trigger)

```typescript
POST /api/website-projects/:id/generate-wireframe

// System calls Claude Code API
const wireframe = await generateWireframe(projectResponses);

// Saves to database
INSERT INTO wireframes (project_id, pages, navigation, generated_by)
VALUES ($1, $2, $3, 'claude');
```

### Step 5: Generate Design (Auto or Manual Trigger)

```typescript
POST /api/website-projects/:id/generate-design

// System calls Gemini API
const design = await generateDesign(projectResponses, wireframe);

// Saves to database
INSERT INTO designs (project_id, theme, color_palette, typography, generated_by)
VALUES ($1, $2, $3, $4, 'gemini');
```

### Step 6: Generate Code (Auto or Manual Trigger)

```typescript
POST /api/website-projects/:id/generate-code

{
  "framework": "next" // or react, html, vue, astro
}

// System calls Claude Code API
const code = await generateCode(wireframe, design, framework);

// Saves to database
INSERT INTO generated_code (project_id, framework, files, dependencies, generated_by)
VALUES ($1, $2, $3, $4, 'claude');
```

### Step 7: Deploy (Auto or Manual)

```typescript
POST /api/website-projects/:id/deploy

{
  "platform": "vercel" // or netlify, cloudflare
}

// Creates GitHub repo
// Pushes code
// Deploys via API
// Returns deployment URL
```

## Example Generated Output

### Wireframe JSON (Claude Code)

```json
{
  "pages": [
    {
      "name": "Home",
      "path": "/",
      "sections": [
        {
          "type": "hero",
          "layout": "single-column",
          "content": "Above-fold hero with headline, subheadline, CTA buttons",
          "position": 1
        },
        {
          "type": "features",
          "layout": "three-column",
          "content": "3 key features with icons",
          "position": 2
        },
        {
          "type": "testimonials",
          "layout": "two-column",
          "content": "Customer testimonials carousel",
          "position": 3
        },
        {
          "type": "cta",
          "layout": "single-column",
          "content": "Final call-to-action section",
          "position": 4
        }
      ]
    }
  ],
  "navigation": {
    "type": "top",
    "items": [
      {"label": "Home", "path": "/"},
      {"label": "About", "path": "/about"},
      {"label": "Services", "path": "/services"},
      {"label": "Contact", "path": "/contact"}
    ],
    "sticky": true,
    "transparent": false
  }
}
```

### Design JSON (Gemini)

```json
{
  "theme": {
    "name": "Modern Tech",
    "style": "modern",
    "mood": ["professional", "trustworthy", "innovative"]
  },
  "colorPalette": {
    "primary": "#2563eb",
    "secondary": "#7c3aed",
    "accent": "#f59e0b",
    "background": "#ffffff",
    "text": "#1f2937",
    "darkMode": {
      "primary": "#60a5fa",
      "secondary": "#a78bfa",
      "accent": "#fbbf24",
      "background": "#0f172a",
      "text": "#f1f5f9"
    }
  },
  "typography": {
    "headingFont": "Inter",
    "bodyFont": "Inter",
    "scale": {
      "h1": "3.5rem",
      "h2": "2.5rem",
      "h3": "1.875rem",
      "body": "1rem",
      "small": "0.875rem"
    }
  },
  "components": [
    {
      "name": "Primary Button",
      "type": "button",
      "styles": {
        "padding": "0.75rem 2rem",
        "borderRadius": "0.5rem",
        "background": "#2563eb",
        "color": "#ffffff",
        "fontWeight": "600"
      },
      "variants": ["primary", "secondary", "outline"]
    }
  ]
}
```

### Generated Code (Claude Code)

```typescript
// files: Array<CodeFile>
[
  {
    "path": "app/page.tsx",
    "content": "// Next.js Home Page\nimport Hero from '@/components/Hero';\n...",
    "language": "typescript"
  },
  {
    "path": "components/Hero.tsx",
    "content": "export default function Hero() { ... }",
    "language": "typescript"
  },
  {
    "path": "styles/globals.css",
    "content": ":root { --primary: #2563eb; ... }",
    "language": "css"
  },
  {
    "path": "package.json",
    "content": "{ \"name\": \"acme-website\", ... }",
    "language": "json"
  }
]

// dependencies
[
  {"name": "next", "version": "14.0.0", "type": "dependency"},
  {"name": "react", "version": "18.2.0", "type": "dependency"},
  {"name": "tailwindcss", "version": "3.4.0", "type": "devDependency"}
]
```

## API Integration

### Claude Code API

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

async function generateWireframe(responses: WebsiteResponse[]) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: wireframePrompt(responses)
    }]
  });
  
  return JSON.parse(message.content[0].text);
}

async function generateCode(wireframe, design, framework) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: codeGenerationPrompt(wireframe, design, framework)
    }]
  });
  
  // Parse and structure code files
  return parseGeneratedCode(message.content[0].text);
}
```

### Gemini API

```typescript
import { GoogleGenerativeAI } from '@google/genai';

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateDesign(responses: WebsiteResponse[], wireframe) {
  const model = genai.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const result = await model.generateContent(designPrompt(responses, wireframe));
  const text = result.response.text();
  
  return JSON.parse(text);
}
```

## Deployment Integration

### Vercel

```typescript
import { createDeployment } from '@vercel/client';

async function deployToVercel(code: GeneratedCode, projectName: string) {
  const deployment = await createDeployment({
    name: projectName,
    files: code.files.map(f => ({
      file: f.path,
      data: f.content
    })),
    projectSettings: {
      framework: code.framework
    }
  });
  
  return deployment.url;
}
```

### Netlify

```typescript
import { NetlifyAPI } from 'netlify';

async function deployToNetlify(code: GeneratedCode) {
  const netlify = new NetlifyAPI(process.env.NETLIFY_TOKEN);
  
  const site = await netlify.createSite({
    body: { name: projectName }
  });
  
  await netlify.deploy(site.id, code.files);
  
  return site.url;
}
```

## Cost Estimation

| Component | Cost Per Website | Notes |
|-----------|------------------|-------|
| Claude Code (Wireframe) | $0.05 | ~2K tokens output |
| Gemini Pro (Design) | $0.03 | ~1.5K tokens output |
| Claude Code (Code Gen) | $0.15 | ~8K tokens output |
| Deployment | $0 | Free tier (Vercel/Netlify) |
| **Total** | **~$0.23** | Per website generated |

**Monthly Estimates:**
- 50 websites/month = $11.50
- 100 websites/month = $23
- 500 websites/month = $115

## Timeline

- **Questionnaire**: 5-10 minutes (client fills out)
- **Wireframe Generation**: 10-30 seconds (Claude)
- **Design Generation**: 15-45 seconds (Gemini)
- **Code Generation**: 30-90 seconds (Claude)
- **Deployment**: 30-60 seconds (Vercel/Netlify)

**Total: ~12-15 minutes from start to live website**

## Quality Assurance

### Automated Checks
- Valid HTML/CSS/JS
- Lighthouse score ≥90
- Mobile responsiveness test
- Broken link check
- Image optimization
- SEO metadata present

### Review Process
1. AI generates website
2. Internal preview generated
3. Client reviews and approves
4. Revisions if needed (AI regenerates)
5. Final deployment

## Future Enhancements

- **AI Content Writing**: Gemini generates all page copy
- **Image Generation**: Stable Diffusion for custom images
- **A/B Testing**: Multiple design variations
- **CMS Integration**: Headless CMS auto-setup
- **Analytics Dashboard**: Built-in analytics
- **SEO Optimization**: Auto meta tags, schema markup
- **Multi-language**: i18n support
- **E-commerce**: Stripe/PayPal integration

## Example Use Cases

1. **Lead Magnet**: Offer free AI-generated websites to prospects → upsell hosting/maintenance
2. **Internal Tool**: Generate websites for OrenGen clients
3. **SaaS Product**: White-label AI website builder
4. **Freelance Service**: Faster website delivery
5. **Agency Offering**: Premium AI-powered web design service

## API Endpoints Summary

```
POST   /api/website-projects              - Create project
GET    /api/website-projects/:id          - Get project
PUT    /api/website-projects/:id          - Update project
DELETE /api/website-projects/:id          - Delete project

GET    /api/website-questions              - Get questions
POST   /api/website-projects/:id/responses - Submit responses

POST   /api/website-projects/:id/generate-wireframe - Generate wireframe
POST   /api/website-projects/:id/generate-design    - Generate design
POST   /api/website-projects/:id/generate-code      - Generate code

POST   /api/website-projects/:id/deploy             - Deploy website
GET    /api/website-projects/:id/preview            - Preview website

GET    /api/wireframes/:id                          - Get wireframe
GET    /api/designs/:id                             - Get design
GET    /api/generated-code/:id                      - Get code
```

## Database Queries

### Get Projects by Status

```sql
SELECT 
  wp.id,
  wp.project_name,
  wp.status,
  wp.questions_answered,
  wp.total_questions,
  c.name as company_name,
  u.name as created_by_name
FROM website_projects wp
LEFT JOIN companies c ON wp.company_id = c.id
LEFT JOIN users u ON wp.created_by = u.id
WHERE wp.status = 'questionnaire'
ORDER BY wp.created_at DESC;
```

### Get Complete Project

```sql
SELECT 
  wp.*,
  w.pages as wireframe_pages,
  w.navigation,
  d.color_palette,
  d.typography,
  gc.deployment_url
FROM website_projects wp
LEFT JOIN wireframes w ON w.project_id = wp.id
LEFT JOIN designs d ON d.project_id = wp.id
LEFT JOIN generated_code gc ON gc.project_id = wp.id
WHERE wp.id = $1;
```

## Setup

1. Add API keys to environment:
```bash
CLAUDE_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
VERCEL_TOKEN=...
NETLIFY_TOKEN=...
```

2. Run database migrations:
```bash
psql orengen_crm < database/schema.sql
```

3. Install dependencies:
```bash
npm install @anthropic-ai/sdk @google/genai
```

4. Start building websites!

