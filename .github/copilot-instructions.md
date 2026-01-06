# OrenGen.io Platform - AI Agent Instructions

## Architecture Overview

**3-Layer System:**
1. **Public Layer** (`/marketing/`) - Static HTML marketing site at orengen.io
2. **Client Portal** (`/marketing-react/`, planned `app.orengen.io`) - White-label client services
3. **Nexus Admin** (`/nexus/`, `nexus.orengen.io`) - Internal control center with 15+ studio modules

**Key Insight:** This is a monorepo with multiple deployment targets, not a single application. Each folder has its own `docker-compose.yaml` or `Dockerfile` for isolated deployment to Coolify (self-hosted PaaS).

## Project Structure & Boundaries

```
/marketing/          → Static nginx site (deployed)
/marketing-react/    → React rewrite of marketing (Vite + Tailwind)
/nexus/              → React admin platform (TanStack ecosystem)
/nexus-platform/     → Alternative nexus implementation
/crm/                → Twenty CRM docker-compose stack
/nexus-deploy/       → Production dockerfile for nexus
```

**Critical:** Never mix dependencies between folders. Each is self-contained with its own `package.json`, build process, and deployment config.

## Technology Stack Patterns

### Nexus Platform (`/nexus/`)
- **React 19** with TypeScript
- **Routing:** TanStack Router (memory history, not browser routing)
- **State:** `NexusContext.tsx` with `localStorage` persistence (see `usePersistedState` hook)
- **Data:** TanStack Query for async, TanStack Table for displays
- **AI Services:** Separate service modules in `/services/` for Anthropic, Google Gemini, OpenRouter
- **Build:** Vite with `import.meta.env.VITE_*` variables (NOT `process.env`)

### Marketing Sites
- **Static:** Plain HTML + nginx with clean URLs (no .html extensions via nginx rewrite rules)
- **React Version:** Vite + React 18 + Tailwind CSS (component-based rebuild)

### Environment Variables
- **Nexus:** Use `VITE_` prefix (e.g., `VITE_ANTHROPIC_API_KEY`)
- **Exception:** Gemini uses legacy `process.env.API_KEY` (see `vite.config.ts` define block)
- **CRM:** Standard Docker env vars (see `crm/.env.example`)

## Development Workflows

### Local Development
```bash
# Nexus admin platform
cd nexus && npm install && npm run dev  # → http://localhost:3000

# Marketing React site  
cd marketing-react && npm install && npm run dev

# No local CRM - uses docker-compose, deploy to Coolify
```

### Deployment to Coolify
1. **Marketing:** Uses `/Dockerfile` at root, builds nginx container from `/marketing/`
2. **Nexus:** Uses `/nexus-deploy/Dockerfile`, runs multi-stage build with nginx
3. **CRM:** Uses `crm/docker-compose.yaml`, requires running `./setup.sh` for secrets first

**Always check:** `docker-compose.yaml` or `Dockerfile` in target directory for build instructions.

## State Management Pattern (Nexus)

All app state lives in `NexusContext.tsx` and persists to `localStorage` with keys like `nexus_projects`, `nexus_dark_mode`, etc.

**Critical types** (`types.ts`):
- `Project` - Core entity with checklist, KPIs, brand identity, landing pages
- `ChecklistItem` - Tasks linked to AI agents via `agentId` field
- `Opportunity` - Federal contracting opportunities (SAM.gov integration concept)
- `Contact` - CRM contacts

**Pattern:** Components consume context via `useNexus()` hook, never prop-drill state.

## AI Service Architecture

Services in `nexus/services/`:
- `claudeService.ts` - Anthropic Claude SDK
- `geminiService.ts` - Google Generative AI
- `openRouterService.ts` - Multi-model proxy

**Convention:** Each exports a single request function (e.g., `requestClaude(prompt: string)`) returning streamed responses.

## Key Conventions

1. **No Backend API:** Nexus is 100% frontend. Future integration points via n8n webhooks or direct API calls from browser.
2. **Router Usage:** Always use TanStack Router's `useNavigate()` hook, never window.location or anchor tags for internal nav.
3. **Icon Library:** `lucide-react` for all icons
4. **Data Persistence:** `localStorage` only (no database until CRM integration)
5. **File Naming:** PascalCase for React components (`Dashboard.tsx`), camelCase for services/utils

## Common Pitfalls to Avoid

- Don't import TanStack Router's `Link` component - navigation is menu-driven via `Layout.tsx`
- Don't add backend API calls - this is static deployment, use n8n webhooks for server-side logic
- Don't use `process.env` in Vite projects except where explicitly defined in `vite.config.ts`
- Don't modify nginx.conf without testing clean URL rewrites (marketing relies on this)
- Don't add new dependencies to nexus without checking bundle size impact

## Documentation Files

- `ARCHITECTURE.md` - System design, 3-layer explanation, domain mapping
- `README.md` - Current project status, deployment checklist
- `DEPLOY-NOW.md` - Step-by-step Coolify deployment with generated secrets
- `PROJECT-README.md` - Quick reference for both sites
- `setup.sh` - Secret generation for CRM deployment

**When unclear:** Check ARCHITECTURE.md first for "why", then README.md for "what's done".

## Federal/Government Features

Nexus includes `FederalDashboard.tsx` and `ProposalWorkstation.tsx` for government contracting (SAM.gov, RFPs, grants). These are demo/planning features, not connected to real APIs yet.

**Pattern:** Opportunities have `type: 'Contract' | 'Grant'`, use mock data from `constants.ts`.
