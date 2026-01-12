# OrenGen Platform

**AI-Powered Business Automation & Buy-Lingual AI Agents**

OrenGen is a comprehensive all-in-one business operating system featuring AI-powered automation, multilingual voice agents, CRM, lead generation, and enterprise solutions.

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Component Setup](#component-setup)
   - [Marketing Site](#1-marketing-site-orengenio)
   - [Nexus Admin](#2-nexus-admin-nexusorengenio)
   - [CRM Backend](#3-crm-backend-crmorengenio)
   - [Client Portal](#4-client-portal-apporengenio)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [Deployment](#deployment)
9. [Self-Hosted Services](#self-hosted-services)
10. [API Keys & Integrations](#api-keys--integrations)
11. [Development](#development)
12. [Troubleshooting](#troubleshooting)

---

## Platform Overview

OrenGen consists of multiple interconnected services:

| Component | URL | Purpose |
|-----------|-----|---------|
| **Marketing Site** | orengen.io | Public-facing website |
| **Nexus Admin** | nexus.orengen.io | Internal admin control center |
| **CRM** | crm.orengen.io | Customer relationship management |
| **Client Portal** | app.orengen.io | White-label client dashboard |
| **Blog** | blog.orengen.io | WordPress blog |
| **n8n** | n8n.orengen.io | Workflow automation |

### Key Features

- **Buy-Lingual AI Agents** - Multilingual voice AI for sales & support
- **AI CRM** - Intelligent customer relationship management
- **Lead Generation** - AI-powered lead capture & enrichment
- **Federal Contracting** - SAM.gov integration, RFP analysis
- **FOSS Registry** - Self-hosted open source services

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: PUBLIC                          │
│                   orengen.io (Marketing)                    │
│              Static HTML/CSS/JS served via nginx            │
└─────────────────────────────────────────────────────────────┘
                              │
                    Form submissions → n8n webhooks
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 2: BACKEND                         │
│               crm.orengen.io (Twenty CRM)                   │
│          PostgreSQL 15 + Redis 7 + GraphQL API              │
└─────────────────────────────────────────────────────────────┘
                              │
                        API calls
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 3: ADMIN                           │
│               nexus.orengen.io (Control Room)               │
│               React 19 + Vite + TanStack Router             │
└─────────────────────────────────────────────────────────────┘
                              │
                     Client management
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   LAYER 4: CLIENT PORTAL                    │
│                 app.orengen.io (Dashboard)                  │
│                    Next.js 15 + API routes                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before starting, ensure you have:

### Required Software
- **Node.js** 18+ (20 recommended)
- **npm** 9+ or **pnpm**
- **Docker** 24+ and **Docker Compose** v2
- **Git** 2.40+

### Required Accounts (for full functionality)
- **Anthropic** - Claude API key
- **Google AI** - Gemini API key
- **Resend** - Email sending
- **Twilio** - Voice & SMS (optional)

### Server Requirements (Production)
- **VPS/Server** with 4GB+ RAM
- **Coolify** or similar self-hosted PaaS
- **Domain** with DNS access

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/orengenio/OrenGen-2nd-Edition.git
cd OrenGen-2nd-Edition
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install Nexus dependencies
cd nexus && npm install && cd ..

# Install marketing-react dependencies (optional)
cd marketing-react && npm install && cd ..
```

### 3. Configure Environment Variables

```bash
# Copy example environment files
cp .env.example .env.local
cp nexus/.env.example nexus/.env.local
cp crm/.env.example crm/.env
```

Edit each `.env` file with your API keys (see [Environment Variables](#environment-variables)).

### 4. Start Development Servers

**Option A: Start Nexus Admin (Vite)**
```bash
npm run dev
# Opens at http://localhost:3000
```

**Option B: Start Marketing Site (Static)**
```bash
cd marketing
npx serve .
# Opens at http://localhost:3000
```

**Option C: Start CRM Backend (Docker)**
```bash
cd crm
docker compose up -d
# CRM at http://localhost:3000
# PostgreSQL at localhost:5432
# Redis at localhost:6379
```

---

## Component Setup

### 1. Marketing Site (orengen.io)

The marketing site is a static HTML/CSS/JS site optimized for performance.

**Directory:** `/marketing/`

**Files:**
- `index.html` - Homepage
- `about.html` - About page
- `services.html` - Services & solutions
- `contact.html` - Contact form
- `privacy.html` - Privacy policy
- `terms.html` - Terms of service
- `assets/` - CSS, JS, images

**Local Development:**
```bash
cd marketing
npx serve . -p 8080
```

**Docker Build:**
```bash
docker build -t orengen-marketing -f marketing/Dockerfile .
docker run -p 80:80 orengen-marketing
```

**nginx Configuration:**
The `marketing/nginx.conf` handles:
- URL rewriting (`.html` extension removal)
- Gzip compression
- Cache headers
- Security headers

---

### 2. Nexus Admin (nexus.orengen.io)

The internal admin control center for managing all OrenGen operations.

**Directory:** `/nexus/`

**Tech Stack:**
- React 19
- Vite 6
- TanStack Router, Query, Form, Table
- Tailwind CSS
- Recharts
- Claude & Gemini AI SDKs

**Local Development:**
```bash
cd nexus
npm install
npm run dev
# Opens at http://localhost:3000
```

**Build for Production:**
```bash
cd nexus
npm run build
# Output: nexus/dist/
```

**Docker Build:**
```bash
docker build -t orengen-nexus -f nexus/Dockerfile .
docker run -p 80:80 orengen-nexus
```

**Key Components:**
| Studio | Purpose |
|--------|---------|
| Dashboard | Control room overview |
| CRM | Contact & deal management |
| Lead Gen | AI lead generation |
| Calendar | Scheduling & bookings |
| Agent Studio | AI agent configuration |
| Federal | SAM.gov opportunities |
| FOSS Registry | Self-hosted services |
| Settings | Platform configuration |

---

### 3. CRM Backend (crm.orengen.io)

Enterprise CRM powered by Twenty CRM with PostgreSQL and Redis.

**Directory:** `/crm/`

**Start with Docker Compose:**
```bash
cd crm
docker compose up -d
```

This starts:
- **PostgreSQL 15** (port 5432)
- **Redis 7** (port 6379)
- **Twenty CRM** (port 3000)

**Environment Variables (crm/.env):**
```env
# Database
POSTGRES_PASSWORD=your_secure_password

# Application URLs
SERVER_URL=https://crm.orengen.io
FRONT_BASE_URL=https://crm.orengen.io

# Security Tokens (generate with: openssl rand -hex 32)
ACCESS_TOKEN_SECRET=your_access_token_secret
LOGIN_TOKEN_SECRET=your_login_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
FILE_TOKEN_SECRET=your_file_token_secret

# Branding
EMAIL_FROM_ADDRESS=noreply@orengen.io
EMAIL_FROM_NAME=OrenGen CRM
```

**Database Schema:**
The CRM includes 20+ tables:
- `users` - User accounts with roles
- `companies` - Business entities
- `contacts` - People linked to companies
- `deals` - Sales pipeline
- `activities` - Calls, emails, meetings
- `leads` - Lead generation data

**Access the CRM:**
1. Open http://localhost:3000 (or your domain)
2. Create admin account on first launch
3. Configure workspace settings

---

### 4. Client Portal (app.orengen.io)

White-label client dashboard built with Next.js.

**Directory:** `/app/`

**Tech Stack:**
- Next.js 15 with Turbopack
- TypeScript
- Tailwind CSS
- API routes for backend logic

**Local Development:**
```bash
npm run dev
# Opens at http://localhost:3000
```

**API Routes:**
| Route | Purpose |
|-------|---------|
| `/api/auth/*` | Authentication |
| `/api/crm/*` | CRM operations |
| `/api/leads/*` | Lead generation |
| `/api/websites/*` | Website builder |
| `/api/federal/*` | Government contracts |

---

## Environment Variables

### Root `.env.local`

```env
# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="postgresql://postgres:password@localhost:5432/orengen_crm"

# ===========================================
# AUTHENTICATION
# ===========================================
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"

# ===========================================
# APPLICATION
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# ===========================================
# AI SERVICES
# ===========================================
CLAUDE_API_KEY="sk-ant-api03-..."
GEMINI_API_KEY="AIza..."
OPENROUTER_API_KEY="sk-or-..."

# ===========================================
# LEAD GENERATION
# ===========================================
HUNTER_API_KEY="your_hunter_api_key"
SNOV_API_KEY="your_snov_api_key"
WHOXY_API_KEY="your_whoxy_api_key"

# ===========================================
# EMAIL
# ===========================================
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@orengen.io"

# ===========================================
# SECURITY
# ===========================================
ENCRYPTION_KEY="your-32-character-encryption-key"
```

### Nexus `.env.local`

```env
# AI API Keys (prefix with VITE_ for client-side access)
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key

# App Configuration
VITE_APP_URL=https://app.orengen.io
VITE_MARKETING_URL=https://orengen.io
```

---

## Database Setup

### PostgreSQL Configuration

**1. Create Database:**
```sql
CREATE DATABASE orengen_crm;
CREATE USER orengen WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE orengen_crm TO orengen;
```

**2. Run Schema Migration:**
```bash
node scripts/setup-database.js
```

**3. Seed Initial Data (optional):**
```bash
npm run db:seed
```

### Database Schema Files
- `scripts/setup-database.js` - Main setup script
- `scripts/advanced-features-schema.sql` - Extended schema
- `scripts/lead-gen-schema.sql` - Lead generation tables

---

## Deployment

### Production Deployment with Coolify

OrenGen is designed to deploy on Coolify (self-hosted PaaS).

**Server Requirements:**
- Ubuntu 22.04+ or Debian 12+
- 4GB RAM minimum (8GB recommended)
- 40GB storage
- Docker pre-installed

**Step 1: Install Coolify**
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

**Step 2: Add Applications**

In Coolify dashboard:

1. **Marketing Site**
   - Source: Git repository
   - Dockerfile: `/marketing/Dockerfile`
   - Domain: `orengen.io`

2. **Nexus Admin**
   - Source: Git repository
   - Dockerfile: `/nexus-deploy/Dockerfile`
   - Domain: `nexus.orengen.io`
   - Environment: Add `VITE_*` variables

3. **CRM Backend**
   - Source: Docker Compose
   - File: `/crm/docker-compose.yaml`
   - Domain: `crm.orengen.io`
   - Environment: Add all CRM variables

**Step 3: Configure DNS**

Point your domains to your server IP:
```
orengen.io         A    YOUR_SERVER_IP
nexus.orengen.io   A    YOUR_SERVER_IP
app.orengen.io     A    YOUR_SERVER_IP
crm.orengen.io     A    YOUR_SERVER_IP
```

**Step 4: Enable SSL**

Coolify uses Traefik with Let's Encrypt for automatic SSL certificates.

---

### Manual Docker Deployment

**Build All Images:**
```bash
# Marketing
docker build -t orengen-marketing -f Dockerfile .

# Nexus
docker build -t orengen-nexus -f nexus-deploy/Dockerfile .

# CRM (use docker-compose)
cd crm && docker compose up -d
```

**Run with Docker Compose:**
```bash
docker compose up -d
```

---

## Self-Hosted Services

OrenGen includes a FOSS Registry for managing self-hosted services.

### Available Services

| Service | Purpose | Port |
|---------|---------|------|
| **OrenDesk (Chatwoot)** | Customer support | 3100 |
| **OrenSEO (SerpBear)** | SEO tracking | 3200 |
| **OrenApps (Appsmith)** | Internal tools | 8280 |
| **OrenMetrics (Matomo)** | Web analytics | 8380 |
| **Penpot** | Design tool | 9001 |
| **Mattermost** | Team chat | 8065 |
| **NocoDB** | Database UI | 8080 |
| **Grafana** | Monitoring | 3000 |
| **Paperless-ngx** | Document management | 8000 |
| **n8n** | Automation | 5678 |

### Adding Services

Services are managed in `nexus/components/OpenSourceRegistry.tsx`.

To add a new service:
1. Add Docker container via Coolify
2. Update the FOSS Registry component
3. Configure reverse proxy for subdomain

---

## API Keys & Integrations

### Required APIs

| Service | Purpose | Get Key |
|---------|---------|---------|
| **Anthropic Claude** | AI assistance | https://console.anthropic.com |
| **Google Gemini** | AI & image gen | https://aistudio.google.com |
| **Resend** | Email sending | https://resend.com |

### Optional APIs

| Service | Purpose | Get Key |
|---------|---------|---------|
| **Twilio** | Voice & SMS | https://twilio.com |
| **Hunter.io** | Email finding | https://hunter.io |
| **Snov.io** | Email verification | https://snov.io |
| **ElevenLabs** | Text-to-speech | https://elevenlabs.io |
| **OpenRouter** | Multi-model AI | https://openrouter.ai |

### Government APIs

| Service | Purpose | Get Key |
|---------|---------|---------|
| **SAM.gov** | Federal contracts | https://sam.gov/api |

---

## Development

### Project Structure

```
OrenGen-2nd-Edition/
├── marketing/              # Static marketing site
│   ├── index.html
│   ├── assets/
│   └── nginx.conf
├── nexus/                  # Admin control center
│   ├── components/         # React components
│   ├── services/           # API services
│   └── App.tsx
├── crm/                    # Twenty CRM setup
│   ├── docker-compose.yaml
│   └── .env.example
├── app/                    # Next.js client portal
│   ├── api/                # API routes
│   └── dashboard/
├── lib/                    # Shared services
│   ├── api-client.ts
│   ├── auth.ts
│   └── 25+ service files
├── chrome-extension/       # Lead capture extension
├── scripts/                # Database scripts
└── docs/                   # Documentation
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- --grep "CRM"
```

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Tailwind CSS for styling

### Git Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit
3. Push and create PR
4. Merge after review

---

## Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Docker containers not starting:**
```bash
# Check logs
docker compose logs -f

# Restart containers
docker compose down && docker compose up -d
```

**Database connection failed:**
```bash
# Check PostgreSQL is running
docker compose ps

# Test connection
psql -h localhost -U twenty -d twenty
```

**Build errors in Nexus:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment variables not loading:**
- Ensure `.env.local` exists (not `.env` for Vite)
- Prefix client-side vars with `VITE_`
- Restart dev server after changes

### Getting Help

- **GitHub Issues:** https://github.com/orengenio/OrenGen-2nd-Edition/issues
- **Documentation:** https://orengen.io/knowledge-base
- **Email:** hello@orengen.io

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with love by OrenGen Worldwide**

2026 OrenGen Worldwide. All rights reserved.
