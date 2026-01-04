# OrenGen Platform - Complete System

**Two-Site Architecture**: Public Marketing Site + Admin Nexus Platform

---

## 📁 Project Structure

```
/marketing/          → orengen.io (Public website)
/nexus/              → app.orengen.io (Admin platform)
/wordpress/          → WordPress integration files (optional)
```

---

## 🌍 Site 1: Marketing Website (orengen.io)

**Location:** `/marketing/`

**Purpose:** Client-facing public website

**Tech Stack:**
- Static HTML/CSS/JavaScript
- Nginx web server
- Fast, SEO-optimized

**Pages:**
- ✅ Homepage (orengen-v2-home.html)
- ✅ About, Services, Pricing
- ✅ Case Studies, Contact
- ✅ Legal (Privacy, Terms)

**Deploy to Coolify:**
```bash
cd marketing
# Coolify will use docker-compose.yaml
```

**Environment Variables (Coolify):**
```
SERVICE_FQDN_MARKETING=orengen.io
```

---

## 🔐 Site 2: Nexus Admin Platform (app.orengen.io)

**Location:** `/nexus/`

**Purpose:** Backend admin dashboard with AI integrations

**Tech Stack:**
- React 19 + TypeScript
- Vite (build tool)
- TanStack Router + Query + Table + Form
- AI: Claude, Gemini, OpenRouter

**Features:**
- CRM
- Calendar Studio
- Campaign Studio
- Brand Studio
- Web Studio
- Form Studio
- Data Studio
- Automation Studio
- Agent Workspace
- 15+ more modules

**Setup:**
```bash
cd nexus
npm install
npm run dev
```

**Environment Variables:**
Create `nexus/.env.local`:
```env
VITE_GEMINI_API_KEY=your_gemini_key
VITE_ANTHROPIC_API_KEY=your_anthropic_key
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_APP_URL=https://app.orengen.io
VITE_MARKETING_URL=https://orengen.io
```

**Deploy to Coolify:**
```bash
cd nexus
npm run build
# Coolify will use docker-compose.yaml
```

**Environment Variables (Coolify):**
```
SERVICE_FQDN_NEXUS=app.orengen.io
NODE_ENV=production
VITE_GEMINI_API_KEY=xxx
VITE_ANTHROPIC_API_KEY=xxx
VITE_OPENROUTER_API_KEY=xxx
```

---

## 🤖 AI Integrations (Nexus Only)

### Claude (Anthropic)
```typescript
import { sendToClaude, generateCode } from './services/claudeService';

const response = await sendToClaude([
  { role: 'user', content: 'Create a React component' }
]);

const code = await generateCode('Create a login form', 'typescript');
```

### OpenRouter (Multi-Model Access)
```typescript
import { sendToOpenRouter, AVAILABLE_MODELS } from './services/openRouterService';

const response = await sendToOpenRouter(
  [{ role: 'user', content: 'Analyze this data' }],
  AVAILABLE_MODELS.CLAUDE_SONNET
);

// Compare multiple models
const results = await compareModels('Your prompt', [
  AVAILABLE_MODELS.CLAUDE_SONNET,
  AVAILABLE_MODELS.GPT4,
  AVAILABLE_MODELS.GEMINI_PRO
]);
```

### Gemini
```typescript
import { generateContent } from './services/geminiService';

const response = await generateContent('Your prompt');
```

---

## 🚀 Deployment Guide

### Deploy Marketing Site (orengen.io)

1. In Coolify, create new application
2. Connect GitHub repo: `orengenio/home`
3. Set build pack: **Docker Compose**
4. Base directory: `/marketing`
5. Add environment variable:
   - `SERVICE_FQDN_MARKETING` = `orengen.io`
6. Deploy!

### Deploy Nexus Platform (app.orengen.io)

1. In Coolify, create new application
2. Connect GitHub repo: `orengenio/home`
3. Set build pack: **Docker Compose**
4. Base directory: `/nexus`
5. Add environment variables:
   - `SERVICE_FQDN_NEXUS` = `app.orengen.io`
   - `VITE_GEMINI_API_KEY` = your key
   - `VITE_ANTHROPIC_API_KEY` = your key
   - `VITE_OPENROUTER_API_KEY` = your key
6. Deploy!

### DNS Configuration

Point both domains to your Coolify server IP:

```
A Record: orengen.io → 15.204.243.95
A Record: app.orengen.io → 15.204.243.95
```

---

## 🔗 User Flow

1. **Visitor** → orengen.io (marketing site)
2. **Click "Login"** button (top right)
3. **Redirects** → app.orengen.io
4. **Login** (auth required)
5. **Access** → Full Nexus platform with all studios

---

## 📊 What to Keep vs Archive

### ✅ Keep (In Use)
- `/marketing/` - All production pages
- `/nexus/` - Full Nexus platform
- `/wordpress/` - Integration guides

### 📦 Archive (Not Needed)
- `orengen-homepage-v3.html` (root)
- `orengen_*_redesign.html` files (various versions)
- `orengen-nexus.zip` (extracted to /nexus)
- `orengen.io---2nd-edition.zip` (extracted, not using)
- `/marketing-react/` folder (alternate React version)
- `/nexus-platform/` folder (duplicate, using /nexus)

---

## 🛠️ Development

### Marketing Site (Local)
```bash
cd marketing
python3 -m http.server 8000
# Open http://localhost:8000/orengen-v2-home.html
```

### Nexus Platform (Local)
```bash
cd nexus
npm install
npm run dev
# Open http://localhost:5173
```

---

## 📝 Next Steps

1. ✅ Marketing site structure organized
2. ✅ Nexus platform set up with AI integrations
3. ✅ Login button added to homepage
4. ✅ Deployment configs created
5. ⏳ Add authentication to Nexus
6. ⏳ Configure API keys in Coolify
7. ⏳ Deploy both sites
8. ⏳ Test full user flow

---

## 🆘 Support

Need help? Contact: dev@orengen.io
