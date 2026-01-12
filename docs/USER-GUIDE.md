# OrenGen CRM Platform - Complete User Guide

The most comprehensive all-in-one business operating system. CRM, lead generation, AI automation, reputation management, freelance hub, and more - unified in one powerful platform.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Platform Overview](#platform-overview)
3. [Core Features](#core-features)
4. [Growth Tools](#growth-tools)
5. [Unique Differentiators](#unique-differentiators)
6. [Federal Contracting Suite](#federal-contracting-suite)
7. [AI Agent Studio](#ai-agent-studio)
8. [Pricing & Packages](#pricing--packages)
9. [Competitive Advantages](#competitive-advantages)
10. [API Reference](#api-reference)
11. [Deployment](#deployment)

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- npm or yarn

### Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Accessing Nexus Dashboard

```bash
cd nexus
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## Platform Overview

OrenGen is a **complete business operating system** that combines:

| Category | Features |
|----------|----------|
| **CRM** | Contacts, Companies, Deals, Pipeline, Activities |
| **Lead Generation** | Domain discovery, enrichment, scoring, campaigns |
| **Marketing** | Email, SMS, campaigns, automations |
| **Reputation** | Review monitoring, AI responses, request campaigns |
| **Social** | Smart commenting, authority building |
| **Communication** | SIM integration, VoIP, call tracking |
| **Freelance** | Platform integration, AI proposals, package creation |
| **Federal** | Government contracting, RFPs, proposals |
| **AI Agents** | 8+ specialized AI workers |

---

## Core Features

### CRM Database

Full-featured B2B CRM with:

- **Companies**: Track organizations, industries, revenue, status
- **Contacts**: Individual relationship management with lifecycle stages
- **Deals**: Sales pipeline with customizable stages and probability
- **Activities**: Call/email/meeting logging with notes
- **Custom Fields**: Extend any entity with custom data

#### Deal Pipeline Stages
1. Lead (10% probability)
2. Qualified (25%)
3. Proposal (50%)
4. Negotiation (75%)
5. Closed Won (100%)
6. Closed Lost (0%)

### Lead Generation System

Discover and qualify leads automatically:

- **Domain Discovery**: Add domains and auto-enrich
- **WHOIS Enrichment**: Company info, registration dates
- **Tech Stack Detection**: Identify technologies used
- **Email Finding**: Hunter.io + Snov.io integration
- **Lead Scoring**: 0-100 automated scoring
- **Bulk Import**: CSV upload with auto-processing

#### Lead Scoring Factors
| Factor | Weight | Description |
|--------|--------|-------------|
| Domain Age | 20pts | Established businesses score higher |
| WHOIS Data | 20pts | Complete registration info |
| Tech Stack | 20pts | Modern tech = better fit |
| Email Quality | 20pts | Verified emails available |
| Company Signals | 20pts | Size, industry indicators |

### Universal Calendar

- **Multi-Provider Sync**: Google, Outlook, iCloud, CalDAV
- **Smart Scheduling**: Availability detection
- **Meeting Links**: Auto-generate Zoom/Meet links
- **Reminders**: Multi-channel notifications
- **Team Calendars**: Shared availability view

---

## Growth Tools

### Campaign Studio (Omni-Channel Marketing)

Execute multi-channel campaigns:

- **Email Sequences**: Drip campaigns with personalization
- **SMS Marketing**: Bulk and triggered messages
- **Social Posting**: Schedule across platforms
- **A/B Testing**: Subject lines, content variants
- **Analytics**: Open rates, clicks, conversions

### Reputation Manager

Monitor and improve your online reputation:

**Supported Platforms:**
- Google Business Profile
- Yelp
- Facebook
- Trustpilot
- G2
- Capterra
- BBB

**Features:**
- Real-time review monitoring
- AI-powered response generation
- Sentiment analysis (positive/neutral/negative)
- Review request campaigns via email/SMS
- Analytics dashboard with trends

#### AI Response Tones
- Grateful & Professional
- Empathetic & Solution-Focused
- Apologetic & Recovery-Oriented

### Smart Social Commenting

Build authority through strategic engagement:

**Platforms:**
- Facebook
- Instagram
- LinkedIn
- X/Twitter
- Threads
- YouTube
- TikTok

**Features:**
- Post discovery by keywords/hashtags
- AI-generated comments in multiple tones
- Comment scheduling and queue
- Strategy templates
- Engagement analytics

#### Comment Tones
| Tone | Use Case |
|------|----------|
| Helpful Expert | Share knowledge, provide value |
| Curious Learner | Ask thoughtful questions |
| Supportive Peer | Encourage and validate |
| Thought Leader | Share unique insights |
| Friendly Networker | Build connections |

### Freelance Hub

Manage all freelance platforms in one place:

**Connected Platforms:**
- Upwork
- Fiverr
- Freelancer.com
- Toptal
- Guru
- PeoplePerHour
- 99designs
- Contra
- FlexJobs

**Features:**
- Unified job discovery across platforms
- Job scoring (match %, client quality, competition)
- AI proposal generation in 5 tones
- Service package creation (Basic/Standard/Premium)
- Auto-apply with smart filters
- Earnings analytics by platform

#### Proposal Tones
- Professional (formal, structured)
- Friendly (warm, approachable)
- Confident (achievement-focused)
- Consultative (partnership approach)
- Value-Focused (ROI-driven)

---

## Unique Differentiators

### SIM & Number Integration ⭐ (EXCLUSIVE)

**No competitor offers this.** Route your personal phone number through the CRM without calls/texts showing on your actual device.

**How It Works:**
1. Connect your personal cell phone SIM
2. Configure call forwarding using carrier codes
3. All calls route through CRM
4. Track, record, and manage in one place
5. Optional AI agent for after-hours

**Supported Carriers:**
- Verizon (*72)
- AT&T (*72)
- T-Mobile (**21*)
- Sprint (*72)
- Any carrier with call forwarding

**Routing Modes:**
| Mode | Description |
|------|-------------|
| CRM Only | All calls go directly to CRM |
| CRM Primary | CRM first, device as backup |
| Device Primary | Device first, CRM logs |
| Smart Routing | AI decides based on context |
| Schedule Based | Business hours routing |

**Features:**
- Personal number privacy (leads don't see your device)
- Call recording & transcription
- SMS inbox in CRM
- AI voicemail transcription
- Number porting to VoIP

### White-Label Ready

Full branding customization for agencies:
- Custom logos (light/dark/icon/favicon)
- Color themes (4 presets + custom)
- Typography customization
- Custom login pages
- Email templates with branding
- Hide "Powered by OrenGen"
- Custom CSS injection

---

## Federal Contracting Suite

Complete government contracting toolkit:

### Opportunity Studio
- SAM.gov integration
- FPDS data feeds
- Opportunity alerts
- Bid/No-Bid analysis

### RFP Intelligence
- Document parsing
- Requirement extraction
- Compliance matrix generation
- Competitor analysis

### Proposal Studio
- Template library
- Section management
- Collaborative editing
- Version control
- Export to Word/PDF

### Grant Studio
- Foundation database
- Application tracking
- Budget templates
- Report generation

### Compliance Studio
- FAR/DFAR compliance checks
- Cybersecurity requirements (CMMC)
- Small business certifications
- Past performance database

---

## AI Agent Studio

8 specialized AI agents working for you:

| Agent | Role | Capabilities |
|-------|------|--------------|
| **Brand Guardian** | Brand consistency | Voice enforcement, content review |
| **Web Architect** | Site development | Landing pages, funnels, SEO |
| **Creator Manager** | UGC coordination | Scripts, hooks, CTAs |
| **Campaign Orchestrator** | Marketing automation | Sequences, A/B tests |
| **Automation Engineer** | Workflow building | n8n integrations |
| **Data Analyst** | Business intelligence | Reports, insights |
| **Proposal Writer** | Document creation | RFPs, grants, bids |
| **Support Agent** | Customer service | Tickets, chat, FAQ |

### Agent Controls
- Start/Stop individual agents
- Schedule-based activation
- Task assignment and monitoring
- Performance analytics
- Workflow builder

---

## Pricing & Packages

### Recommended Pricing Strategy

Based on market analysis and feature set, here are optimal pricing tiers:

---

### 🌱 **STARTER** - $97/month
*Perfect for solopreneurs and small teams*

**Included:**
- CRM (up to 2,500 contacts)
- Lead Generation (100 leads/month)
- Basic Email Campaigns
- Calendar Integration (1 provider)
- Knowledge Wiki
- Mobile App Access

**Limits:**
- 1 user
- 1 pipeline
- Basic reporting
- Email support

---

### 🚀 **PROFESSIONAL** - $297/month
*For growing businesses and agencies*

**Everything in Starter, plus:**
- CRM (up to 25,000 contacts)
- Lead Generation (500 leads/month)
- Reputation Manager (3 locations)
- Smart Social Commenting
- Universal Calendar (all providers)
- Campaign Studio (email + SMS)
- Freelance Hub (3 platforms)
- White-Label (your branding)

**Limits:**
- 5 users
- 5 pipelines
- Advanced reporting
- Priority support

---

### 💎 **ENTERPRISE** - $697/month
*Full-featured business operating system*

**Everything in Professional, plus:**
- Unlimited contacts
- Unlimited leads
- Reputation Manager (unlimited locations)
- SIM Integration (3 numbers)
- AI Agent Studio (all 8 agents)
- Federal Contracting Suite
- Freelance Hub (all platforms)
- Custom integrations
- Dedicated success manager

**Limits:**
- 25 users
- Unlimited pipelines
- Custom reporting
- Phone + chat support
- SLA guarantee

---

### 🏢 **AGENCY** - $1,497/month
*For agencies managing multiple clients*

**Everything in Enterprise, plus:**
- Multi-tenant architecture
- Unlimited sub-accounts
- Client billing management
- Agency dashboard
- Reseller pricing
- API access (full)
- Custom development hours
- White-glove onboarding

---

### Add-Ons (Any Tier)

| Add-On | Price | Description |
|--------|-------|-------------|
| Extra SIM Numbers | $29/mo each | Additional personal number routing |
| AI Agent Hours | $99/mo | 10,000 additional AI interactions |
| Extra Users | $29/user/mo | Additional team members |
| SMS Credits | $0.02/msg | Beyond included limit |
| API Access | $99/mo | Full API for Starter/Pro |
| Dedicated IP | $49/mo | For email deliverability |
| Custom Integration | $499 one-time | Connect any platform |

---

### Annual Pricing (20% Discount)

| Tier | Monthly | Annual (Save 20%) |
|------|---------|-------------------|
| Starter | $97 | $77/mo ($924/yr) |
| Professional | $297 | $237/mo ($2,844/yr) |
| Enterprise | $697 | $557/mo ($6,684/yr) |
| Agency | $1,497 | $1,197/mo ($14,364/yr) |

---

### Founding Member Special (Limited)

**50% OFF for life** for the first 100 customers:

- Starter: ~~$97~~ → **$49/month**
- Professional: ~~$297~~ → **$149/month**
- Enterprise: ~~$697~~ → **$349/month**
- Agency: ~~$1,497~~ → **$749/month**

*Lock in this rate forever - never increases*

---

## Competitive Advantages

### vs GoHighLevel ($97-497/mo)
| Feature | OrenGen | GoHighLevel |
|---------|---------|-------------|
| SIM Integration | ✅ Unique | ❌ |
| Freelance Hub | ✅ | ❌ |
| AI Agents | ✅ 8 agents | ❌ Limited |
| Federal Suite | ✅ | ❌ |
| Lead Enrichment | ✅ Built-in | ❌ Requires addon |
| Smart Commenting | ✅ | ❌ |

### vs HubSpot ($45-3,600/mo)
| Feature | OrenGen | HubSpot |
|---------|---------|---------|
| Price | $97-697 | $45-3,600 |
| All-in-One | ✅ | ⚠️ Add-ons |
| No Per-Contact Pricing | ✅ | ❌ |
| White-Label | ✅ Pro+ | ❌ |
| SIM Integration | ✅ | ❌ |

### vs Salesforce ($25-300/user/mo)
| Feature | OrenGen | Salesforce |
|---------|---------|------------|
| Simplicity | ✅ | ❌ Complex |
| Price | Fixed | Per-user |
| Marketing Included | ✅ | ❌ Extra |
| Setup Time | Hours | Months |

### vs Pipedrive ($14-99/user/mo)
| Feature | OrenGen | Pipedrive |
|---------|---------|-----------|
| Marketing | ✅ Full | ❌ Basic |
| Lead Gen | ✅ Built-in | ❌ |
| Reputation | ✅ | ❌ |
| Freelance | ✅ | ❌ |

### Why OrenGen Wins

1. **Only platform with personal SIM routing** - Route your cell through CRM
2. **Freelance platform unification** - Upwork, Fiverr, etc. in one place
3. **AI-first architecture** - 8 specialized agents included
4. **All-in-one pricing** - No per-user, per-contact surprises
5. **Federal contracting suite** - Government contractors covered
6. **White-label ready** - Agencies can resell
7. **Modern tech stack** - React, Next.js, Supabase

---

## API Reference

### Base URL
```
https://api.orengen.com/v1
```

### Authentication
```
Authorization: Bearer <jwt-token>
```

### Rate Limits
| Tier | Requests/min |
|------|--------------|
| Starter | 60 |
| Professional | 300 |
| Enterprise | 1000 |
| Agency | Unlimited |

### Core Endpoints

#### Auth
```
POST /auth/login
POST /auth/register
GET  /auth/me
POST /auth/refresh
```

#### CRM
```
GET    /crm/contacts
POST   /crm/contacts
GET    /crm/contacts/:id
PUT    /crm/contacts/:id
DELETE /crm/contacts/:id

GET    /crm/companies
POST   /crm/companies
GET    /crm/deals
POST   /crm/deals
GET    /crm/activities
POST   /crm/activities
```

#### Leads
```
GET    /leads/domains
POST   /leads/domains
POST   /leads/domains/:id/enrich
POST   /leads/domains/:id/convert
POST   /leads/domains/bulk
GET    /leads/stats
GET    /leads/campaigns
```

#### Reputation
```
GET    /reputation/reviews
POST   /reputation/reviews/:id/respond
POST   /reputation/requests
GET    /reputation/stats
```

#### Social Commenting
```
GET    /social/posts
POST   /social/comments
GET    /social/strategies
POST   /social/strategies
```

#### SIM Integration
```
GET    /sim/numbers
POST   /sim/numbers
GET    /sim/calls
GET    /sim/messages
POST   /sim/messages
```

#### Freelance
```
GET    /freelance/accounts
POST   /freelance/accounts
GET    /freelance/jobs
POST   /freelance/proposals
GET    /freelance/packages
POST   /freelance/packages
```

---

## Deployment

### Recommended Stack
- **Frontend**: Vercel
- **Backend**: Railway / Render
- **Database**: Supabase
- **File Storage**: Cloudflare R2
- **Email**: SendGrid / Resend

### Docker Deployment
```bash
docker-compose up -d
```

### Environment Variables
```env
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com

# Optional Integrations
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
SENDGRID_API_KEY=...
WHOXY_API_KEY=...
HUNTER_API_KEY=...
OPENAI_API_KEY=...
```

See `DEPLOYMENT-GUIDE.md` for full instructions.

---

## Support

- **Documentation**: `/docs` folder
- **Community**: Discord server
- **Email**: support@orengen.com
- **Enterprise**: Dedicated success manager

---

## Roadmap

### Coming Soon
- [ ] LinkedIn Sales Navigator integration
- [ ] WhatsApp Business API
- [ ] Zapier/Make native connectors
- [ ] Mobile app (iOS/Android)
- [ ] AI video personalization
- [ ] Predictive lead scoring
- [ ] Revenue intelligence

---

*OrenGen - The Complete Business Operating System*

**Built to make you the best in your industry.**
