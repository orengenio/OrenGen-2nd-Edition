# OrenGen Services & Deployment Checklist

Complete reference guide for all OrenGen services, white-label branding, and deployment checklist.

---

## Table of Contents

1. [Deployment Checklist](#deployment-checklist)
2. [Core Platform Services](#core-platform-services)
3. [White-Label Product Suite](#white-label-product-suite)
4. [Self-Hosted FOSS Services](#self-hosted-foss-services)
5. [Third-Party Integrations](#third-party-integrations)
6. [AI Services](#ai-services)

---

## Deployment Checklist

### Phase 1: Infrastructure Setup

- [ ] **Server Provisioned**
  - VPS with 4GB+ RAM (8GB recommended)
  - Ubuntu 22.04 or Debian 12
  - 40GB+ storage
  - Static IP address

- [ ] **Docker Installed**
  ```bash
  curl -fsSL https://get.docker.com | bash
  ```

- [ ] **Coolify Installed**
  ```bash
  curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
  ```

- [ ] **DNS Configured**
  | Domain | Type | Value |
  |--------|------|-------|
  | orengen.io | A | YOUR_SERVER_IP |
  | nexus.orengen.io | A | YOUR_SERVER_IP |
  | app.orengen.io | A | YOUR_SERVER_IP |
  | crm.orengen.io | A | YOUR_SERVER_IP |
  | n8n.orengen.io | A | YOUR_SERVER_IP |

- [ ] **SSL Certificates Active** (via Traefik/Let's Encrypt)

---

### Phase 2: Database Setup

- [ ] **PostgreSQL 15 Running**
  ```bash
  cd crm && docker compose up -d postgres
  ```

- [ ] **Redis 7 Running**
  ```bash
  cd crm && docker compose up -d redis
  ```

- [ ] **Database Created**
  ```sql
  CREATE DATABASE orengen_crm;
  ```

- [ ] **Schema Migrated**
  ```bash
  node scripts/setup-database.js
  ```

---

### Phase 3: Core Services Deployment

- [ ] **Marketing Site Deployed**
  - Dockerfile: `/marketing/Dockerfile`
  - Domain: `orengen.io`
  - Port: 80

- [ ] **Nexus Admin Deployed**
  - Dockerfile: `/nexus-deploy/Dockerfile`
  - Domain: `nexus.orengen.io`
  - Port: 80
  - Environment variables configured

- [ ] **Twenty CRM Deployed**
  - Docker Compose: `/crm/docker-compose.yaml`
  - Domain: `crm.orengen.io`
  - Port: 3000

- [ ] **n8n Automation Deployed**
  - Domain: `n8n.orengen.io`
  - Port: 5678

---

### Phase 4: Environment Configuration

- [ ] **Root .env.local Created**
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] CLAUDE_API_KEY
  - [ ] GEMINI_API_KEY
  - [ ] RESEND_API_KEY
  - [ ] ENCRYPTION_KEY

- [ ] **Nexus .env.local Created**
  - [ ] VITE_GEMINI_API_KEY
  - [ ] VITE_ANTHROPIC_API_KEY
  - [ ] VITE_APP_URL

- [ ] **CRM .env Created**
  - [ ] POSTGRES_PASSWORD
  - [ ] ACCESS_TOKEN_SECRET
  - [ ] SERVER_URL
  - [ ] EMAIL_FROM_ADDRESS

---

### Phase 5: Self-Hosted Services

- [ ] **OrenDesk (Chatwoot)** - Port 3100
- [ ] **OrenSEO (SerpBear)** - Port 3200
- [ ] **OrenApps (Appsmith)** - Port 8280
- [ ] **OrenMetrics (Matomo)** - Port 8380
- [ ] **OrenDesign (Penpot)** - Port 9001
- [ ] **OrenChat (Mattermost)** - Port 8065
- [ ] **OrenData (NocoDB)** - Port 8080
- [ ] **OrenMonitor (Grafana)** - Port 3000
- [ ] **OrenDocs (Paperless-ngx)** - Port 8000
- [ ] **OrenSocial (Postiz)** - Port 4200

---

### Phase 6: Testing & Verification

- [ ] **Marketing Site**
  - [ ] Homepage loads
  - [ ] Contact form works
  - [ ] SSL certificate valid

- [ ] **Nexus Admin**
  - [ ] Login works
  - [ ] Dashboard loads
  - [ ] All studios accessible

- [ ] **CRM**
  - [ ] Admin account created
  - [ ] Contacts can be added
  - [ ] Deals pipeline works

- [ ] **Integrations**
  - [ ] n8n webhooks responding
  - [ ] Email sending works
  - [ ] AI APIs connected

---

### Phase 7: Go-Live

- [ ] **Backups Configured**
- [ ] **Monitoring Active**
- [ ] **Error Tracking Setup** (Sentry)
- [ ] **Analytics Configured** (OrenMetrics)
- [ ] **Team Access Granted**
- [ ] **Documentation Reviewed**

---

## Core Platform Services

### OrenGen Platform Domains

| Service | Domain | Description |
|---------|--------|-------------|
| **Marketing Site** | orengen.io | Public-facing website with product info, pricing, case studies |
| **Nexus Control Room** | nexus.orengen.io | Internal admin dashboard for all operations |
| **Client Portal** | app.orengen.io | White-label client dashboard |
| **CRM Backend** | crm.orengen.io | Twenty CRM with GraphQL API |
| **Automation** | n8n.orengen.io | Workflow automation and webhooks |
| **Blog** | blog.orengen.io | WordPress blog (external) |

---

## White-Label Product Suite

### Communication & Support

---

#### OrenAgents
**Powered by:** Buy-Lingual AI Voice Technology
**Description:** 24/7 multilingual AI voice agents for inbound support and outbound sales. Handles calls in 40+ languages with human-like conversation quality.

| Plan | Price | Minutes | Languages | Agents |
|------|-------|---------|-----------|--------|
| **Starter** | $297/mo | 500 min | 5 | 1 |
| **Professional** | $597/mo | 2,000 min | 15 | 3 |
| **Business** | $997/mo | 5,000 min | 40+ | 10 |
| **Enterprise** | Custom | Unlimited | All | Unlimited |

**Features by Plan:**

| Feature | Starter | Professional | Business | Enterprise |
|---------|---------|--------------|----------|------------|
| Inbound calls | Yes | Yes | Yes | Yes |
| Outbound calls | - | Yes | Yes | Yes |
| Language switching | Manual | Auto | Auto | Auto |
| CRM integration | Basic | Full | Full | Custom |
| Call recording | 30 days | 90 days | 1 year | Unlimited |
| Transcription | - | Yes | Yes | Yes |
| Custom voice | - | - | Yes | Yes |
| Dedicated support | - | - | - | Yes |

**White-Label Service:** Buy-Lingual AI Agents
> *Chatwoot integration available for unified support*

---

#### OrenDesk
**Powered by:** Chatwoot
**Port:** 3100
**Description:** Open source customer engagement platform for omnichannel support.

| Plan | Price | Agents | Conversations | Channels |
|------|-------|--------|---------------|----------|
| **Free** | $0/mo | 2 | 500/mo | 2 |
| **Starter** | $49/mo | 5 | 2,000/mo | 5 |
| **Business** | $149/mo | 15 | 10,000/mo | All |
| **Enterprise** | $349/mo | Unlimited | Unlimited | All |

**Features by Plan:**

| Feature | Free | Starter | Business | Enterprise |
|---------|------|---------|----------|------------|
| Live chat widget | Yes | Yes | Yes | Yes |
| Email integration | 1 | 3 | 10 | Unlimited |
| WhatsApp Business | - | Yes | Yes | Yes |
| Facebook/Instagram | - | Yes | Yes | Yes |
| Canned responses | 10 | 50 | Unlimited | Unlimited |
| Automation rules | - | 5 | 25 | Unlimited |
| CSAT surveys | - | Yes | Yes | Yes |
| Custom branding | - | - | Yes | Yes |
| API access | - | - | Yes | Yes |
| SSO/SAML | - | - | - | Yes |

**White-Label Service:** Chatwoot

---

#### OrenChat
**Powered by:** Mattermost
**Port:** 8065
**Description:** Secure team collaboration and messaging platform.

| Plan | Price | Users | Storage | History |
|------|-------|-------|---------|---------|
| **Free** | $0/mo | 10 | 5GB | 10K msgs |
| **Team** | $5/user/mo | Unlimited | 10GB/user | Unlimited |
| **Business** | $10/user/mo | Unlimited | 25GB/user | Unlimited |
| **Enterprise** | $15/user/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Team | Business | Enterprise |
|---------|------|------|----------|------------|
| Channels | 10 | Unlimited | Unlimited | Unlimited |
| Direct messages | Yes | Yes | Yes | Yes |
| File sharing | Yes | Yes | Yes | Yes |
| Guest accounts | - | 5 | 25 | Unlimited |
| Integrations | 5 | 50 | All | All |
| Mobile apps | Yes | Yes | Yes | Yes |
| SSO | - | - | Yes | Yes |
| Compliance exports | - | - | - | Yes |

**White-Label Service:** Mattermost

---

### Marketing & Growth

---

#### OrenLeads
**Powered by:** Custom AI Lead Generation
**Description:** AI-powered lead capture, qualification, and enrichment.

| Plan | Price | Leads/mo | Enrichments | Campaigns |
|------|-------|----------|-------------|-----------|
| **Starter** | $97/mo | 500 | 500 | 3 |
| **Growth** | $247/mo | 2,500 | 2,500 | 10 |
| **Scale** | $497/mo | 10,000 | 10,000 | Unlimited |
| **Enterprise** | $997/mo | 50,000 | 50,000 | Unlimited |

**Features by Plan:**

| Feature | Starter | Growth | Scale | Enterprise |
|---------|---------|--------|-------|------------|
| Domain discovery | Yes | Yes | Yes | Yes |
| Email finding | Yes | Yes | Yes | Yes |
| Email verification | Yes | Yes | Yes | Yes |
| WHOIS lookup | Yes | Yes | Yes | Yes |
| Tech stack detection | - | Yes | Yes | Yes |
| AI lead scoring | - | Yes | Yes | Yes |
| Custom scoring model | - | - | Yes | Yes |
| API access | - | Yes | Yes | Yes |
| CRM sync | Basic | Full | Full | Custom |
| Dedicated IP | - | - | - | Yes |

**White-Label Service:** Hunter.io + Snov.io + Custom AI

---

#### OrenSEO
**Powered by:** SerpBear
**Port:** 3200
**Description:** SEO rank tracking and keyword monitoring.

| Plan | Price | Keywords | Domains | Updates |
|------|-------|----------|---------|---------|
| **Free** | $0/mo | 25 | 1 | Weekly |
| **Starter** | $29/mo | 100 | 3 | Daily |
| **Professional** | $79/mo | 500 | 10 | Daily |
| **Agency** | $199/mo | 2,500 | Unlimited | Daily |

**Features by Plan:**

| Feature | Free | Starter | Professional | Agency |
|---------|------|---------|--------------|--------|
| Google tracking | Yes | Yes | Yes | Yes |
| Bing tracking | - | Yes | Yes | Yes |
| Position history | 30 days | 6 months | 2 years | Unlimited |
| Competitor tracking | - | 3 | 10 | Unlimited |
| Email alerts | - | Yes | Yes | Yes |
| Export reports | - | CSV | CSV/PDF | White-label |
| API access | - | - | Yes | Yes |
| Team members | 1 | 2 | 5 | Unlimited |

**White-Label Service:** SerpBear

---

#### OrenSocial
**Powered by:** Postiz
**Port:** 4200
**Description:** AI-powered social media scheduling and management.

| Plan | Price | Profiles | Posts/mo | AI Credits |
|------|-------|----------|----------|------------|
| **Free** | $0/mo | 3 | 30 | 10 |
| **Creator** | $19/mo | 5 | 150 | 50 |
| **Business** | $49/mo | 15 | 500 | 200 |
| **Agency** | $149/mo | 50 | Unlimited | 1,000 |

**Features by Plan:**

| Feature | Free | Creator | Business | Agency |
|---------|------|---------|----------|--------|
| Schedule posts | Yes | Yes | Yes | Yes |
| Content calendar | Yes | Yes | Yes | Yes |
| AI captions | Limited | Yes | Yes | Yes |
| AI image generation | - | Yes | Yes | Yes |
| Analytics | Basic | Full | Full | Full |
| Best time suggestions | - | Yes | Yes | Yes |
| Team members | 1 | 2 | 5 | 20 |
| Client workspaces | - | - | 5 | Unlimited |

**White-Label Service:** Postiz

---

### Analytics & Data

---

#### OrenMetrics
**Powered by:** Matomo
**Port:** 8380
**Description:** Privacy-focused web analytics with full data ownership.

| Plan | Price | Pageviews/mo | Sites | Users |
|------|-------|--------------|-------|-------|
| **Free** | $0/mo | 50,000 | 1 | 3 |
| **Startup** | $29/mo | 500,000 | 5 | 10 |
| **Business** | $99/mo | 5M | 25 | Unlimited |
| **Enterprise** | $299/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Startup | Business | Enterprise |
|---------|------|---------|----------|------------|
| Real-time analytics | Yes | Yes | Yes | Yes |
| Conversion tracking | Yes | Yes | Yes | Yes |
| Event tracking | Yes | Yes | Yes | Yes |
| Heatmaps | - | Yes | Yes | Yes |
| Session recordings | - | 1,000/mo | 10,000/mo | Unlimited |
| Funnels | - | 5 | 25 | Unlimited |
| A/B testing | - | - | Yes | Yes |
| Raw data export | - | - | Yes | Yes |
| Custom reports | - | - | Yes | Yes |
| No data sampling | Yes | Yes | Yes | Yes |

**White-Label Service:** Matomo

---

#### OrenMonitor
**Powered by:** Grafana
**Port:** 3000
**Description:** Infrastructure monitoring and observability platform.

| Plan | Price | Dashboards | Data Sources | Alerts |
|------|-------|------------|--------------|--------|
| **Free** | $0/mo | 3 | 3 | 5 |
| **Team** | $49/mo | 25 | 10 | 50 |
| **Business** | $149/mo | Unlimited | Unlimited | Unlimited |
| **Enterprise** | $349/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Team | Business | Enterprise |
|---------|------|------|----------|------------|
| Custom dashboards | Yes | Yes | Yes | Yes |
| Built-in data sources | Yes | Yes | Yes | Yes |
| Community plugins | Yes | Yes | Yes | Yes |
| Email alerts | Yes | Yes | Yes | Yes |
| Slack/Teams alerts | - | Yes | Yes | Yes |
| Log aggregation | - | Yes | Yes | Yes |
| Team annotations | - | Yes | Yes | Yes |
| SSO/LDAP | - | - | Yes | Yes |
| Audit logs | - | - | - | Yes |

**White-Label Service:** Grafana

---

#### OrenData
**Powered by:** NocoDB
**Port:** 8080
**Description:** No-code database and Airtable alternative.

| Plan | Price | Records | Bases | API Calls |
|------|-------|---------|-------|-----------|
| **Free** | $0/mo | 10,000 | 3 | 10K/mo |
| **Plus** | $20/mo | 100,000 | 10 | 100K/mo |
| **Business** | $50/mo | 1M | Unlimited | 1M/mo |
| **Enterprise** | $150/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Plus | Business | Enterprise |
|---------|------|------|----------|------------|
| Views (Grid, Gallery, Form) | Yes | Yes | Yes | Yes |
| API access | Yes | Yes | Yes | Yes |
| Webhooks | 3 | 10 | 50 | Unlimited |
| Automations | - | 10 | 50 | Unlimited |
| File attachments | 100MB | 1GB | 10GB | Unlimited |
| Collaborators | 3 | 10 | 50 | Unlimited |
| Audit log | - | - | Yes | Yes |

**White-Label Service:** NocoDB

---

### Development & Tools

---

#### OrenApps
**Powered by:** Appsmith
**Port:** 8280
**Description:** Low-code platform for building internal tools.

| Plan | Price | Apps | Users | Queries/mo |
|------|-------|------|-------|------------|
| **Free** | $0/mo | 3 | 5 | 5,000 |
| **Business** | $40/user/mo | Unlimited | Min 5 | 50K |
| **Enterprise** | Custom | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Business | Enterprise |
|---------|------|----------|------------|
| Drag-and-drop builder | Yes | Yes | Yes |
| 50+ widgets | Yes | Yes | Yes |
| Database connectors | 5 | All | All |
| REST/GraphQL APIs | Yes | Yes | Yes |
| JavaScript/Python | Yes | Yes | Yes |
| Version control (Git) | - | Yes | Yes |
| RBAC | Basic | Advanced | Custom |
| Audit logs | - | Yes | Yes |
| SSO/SAML | - | - | Yes |
| Custom branding | - | - | Yes |

**White-Label Service:** Appsmith

---

#### OrenAutomate
**Powered by:** n8n
**Port:** 5678
**Description:** Workflow automation with 400+ integrations.

| Plan | Price | Workflows | Executions/mo | Team |
|------|-------|-----------|---------------|------|
| **Free** | $0/mo | 5 | 1,000 | 1 |
| **Starter** | $20/mo | 20 | 10,000 | 3 |
| **Pro** | $50/mo | Unlimited | 50,000 | 10 |
| **Enterprise** | $200/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| Visual workflow builder | Yes | Yes | Yes | Yes |
| 400+ integrations | Yes | Yes | Yes | Yes |
| Webhook triggers | Yes | Yes | Yes | Yes |
| Schedule triggers | Yes | Yes | Yes | Yes |
| Code nodes (JS/Python) | Yes | Yes | Yes | Yes |
| Error handling | Basic | Advanced | Advanced | Advanced |
| Execution history | 7 days | 30 days | 90 days | Unlimited |
| Version control | - | - | Yes | Yes |
| SSO | - | - | - | Yes |

**White-Label Service:** n8n

---

#### OrenFlow
**Powered by:** Custom Pipeline Builder
**Description:** Visual pipeline builder for sales and operations.

| Plan | Price | Pipelines | Stages | Automations |
|------|-------|-----------|--------|-------------|
| **Starter** | $49/mo | 3 | 10 | 5 |
| **Growth** | $99/mo | 10 | Unlimited | 25 |
| **Enterprise** | $249/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Starter | Growth | Enterprise |
|---------|---------|--------|------------|
| Visual pipeline builder | Yes | Yes | Yes |
| Deal tracking | Yes | Yes | Yes |
| Task automation | Yes | Yes | Yes |
| Team assignments | Yes | Yes | Yes |
| SLA tracking | - | Yes | Yes |
| Custom fields | 10 | 50 | Unlimited |
| Analytics & reporting | Basic | Advanced | Custom |
| API access | - | Yes | Yes |

**White-Label Service:** Custom Build

---

### Productivity & Documents

---

#### OrenDocs
**Powered by:** Paperless-ngx
**Port:** 8000
**Description:** Document management with OCR and search.

| Plan | Price | Documents | Storage | Users |
|------|-------|-----------|---------|-------|
| **Free** | $0/mo | 500 | 5GB | 1 |
| **Pro** | $15/mo | 5,000 | 50GB | 5 |
| **Business** | $49/mo | Unlimited | 500GB | 25 |
| **Enterprise** | $149/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Pro | Business | Enterprise |
|---------|------|-----|----------|------------|
| OCR scanning | Yes | Yes | Yes | Yes |
| Full-text search | Yes | Yes | Yes | Yes |
| Auto-tagging | Basic | AI | AI | AI |
| Custom tags | 10 | Unlimited | Unlimited | Unlimited |
| Mobile upload | Yes | Yes | Yes | Yes |
| Email import | - | Yes | Yes | Yes |
| API access | - | Yes | Yes | Yes |
| Audit log | - | - | Yes | Yes |

**White-Label Service:** Paperless-ngx

---

#### OrenDesign
**Powered by:** Penpot
**Port:** 9001
**Description:** Open source design and prototyping platform.

| Plan | Price | Projects | Collaborators | Storage |
|------|-------|----------|---------------|---------|
| **Free** | $0/mo | 3 | 3 | 1GB |
| **Pro** | $15/mo | Unlimited | 10 | 25GB |
| **Team** | $8/user/mo | Unlimited | Unlimited | 100GB |
| **Enterprise** | Custom | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Pro | Team | Enterprise |
|---------|------|-----|------|------------|
| Vector editing | Yes | Yes | Yes | Yes |
| Prototyping | Yes | Yes | Yes | Yes |
| Components library | Yes | Yes | Yes | Yes |
| Real-time collaboration | - | Yes | Yes | Yes |
| Version history | 30 days | 1 year | Unlimited | Unlimited |
| Export (SVG, PNG, PDF) | Yes | Yes | Yes | Yes |
| Custom fonts | - | Yes | Yes | Yes |
| Design systems | - | - | Yes | Yes |

**White-Label Service:** Penpot

---

### Operations & HR

---

#### OrenHR
**Powered by:** OrangeHRM
**Port:** 8090
**Description:** Human resource management system.

| Plan | Price | Employees | Modules | Admin Users |
|------|-------|-----------|---------|-------------|
| **Free** | $0/mo | 25 | Core | 2 |
| **Professional** | $3/emp/mo | Unlimited | All | 5 |
| **Enterprise** | $5/emp/mo | Unlimited | All + Custom | Unlimited |

**Features by Plan:**

| Feature | Free | Professional | Enterprise |
|---------|------|--------------|------------|
| Employee database | Yes | Yes | Yes |
| Leave management | Yes | Yes | Yes |
| Time & attendance | - | Yes | Yes |
| Recruitment (ATS) | - | Yes | Yes |
| Performance reviews | - | Yes | Yes |
| Training & LMS | - | - | Yes |
| Payroll integration | - | - | Yes |
| Custom reports | - | Yes | Yes |
| API access | - | - | Yes |

**White-Label Service:** OrangeHRM

---

#### OrenVoice
**Powered by:** Twilio + ElevenLabs
**Description:** Enterprise voice infrastructure.

| Plan | Price | Numbers | Minutes | SMS |
|------|-------|---------|---------|-----|
| **Starter** | $99/mo | 2 | 500 | 500 |
| **Business** | $249/mo | 10 | 2,000 | 2,000 |
| **Enterprise** | $599/mo | 50 | 10,000 | 10,000 |
| **Unlimited** | Custom | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Starter | Business | Enterprise | Unlimited |
|---------|---------|----------|------------|-----------|
| Local numbers | Yes | Yes | Yes | Yes |
| Toll-free numbers | - | Yes | Yes | Yes |
| Inbound calls | Yes | Yes | Yes | Yes |
| Outbound calls | Yes | Yes | Yes | Yes |
| IVR menus | Basic | Advanced | Custom | Custom |
| Call recording | 30 days | 90 days | 1 year | Unlimited |
| Voice AI (ElevenLabs) | - | 500 chars | 5K chars | Unlimited |
| SMS messaging | Yes | Yes | Yes | Yes |
| Webhooks | Yes | Yes | Yes | Yes |

**White-Label Service:** Twilio + ElevenLabs

---

### DevOps & Infrastructure

---

#### OrenBackup
**Powered by:** pgBackWeb
**Port:** 8085
**Description:** PostgreSQL backup management.

| Plan | Price | Databases | Storage | Retention |
|------|-------|-----------|---------|-----------|
| **Free** | $0/mo | 1 | 5GB | 7 days |
| **Pro** | $19/mo | 5 | 50GB | 30 days |
| **Business** | $49/mo | 25 | 500GB | 1 year |
| **Enterprise** | $149/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Pro | Business | Enterprise |
|---------|------|-----|----------|------------|
| Scheduled backups | Daily | Hourly | Custom | Custom |
| Point-in-time recovery | - | Yes | Yes | Yes |
| S3-compatible storage | - | Yes | Yes | Yes |
| Email notifications | Yes | Yes | Yes | Yes |
| Slack alerts | - | Yes | Yes | Yes |
| Cross-region replication | - | - | Yes | Yes |

**White-Label Service:** pgBackWeb

---

#### OrenCI
**Powered by:** Jenkins
**Port:** 8081
**Description:** CI/CD automation server.

| Plan | Price | Pipelines | Builds/mo | Agents |
|------|-------|-----------|-----------|--------|
| **Free** | $0/mo | 5 | 100 | 1 |
| **Team** | $29/mo | 25 | 1,000 | 3 |
| **Business** | $99/mo | Unlimited | 10,000 | 10 |
| **Enterprise** | $299/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Free | Team | Business | Enterprise |
|---------|------|------|----------|------------|
| Pipeline as code | Yes | Yes | Yes | Yes |
| GitHub/GitLab integration | Yes | Yes | Yes | Yes |
| Docker builds | Yes | Yes | Yes | Yes |
| Parallel jobs | 1 | 3 | 10 | Unlimited |
| Build artifacts | 1GB | 10GB | 100GB | Unlimited |
| Plugins | Community | All | All | All |
| SSO | - | - | Yes | Yes |

**White-Label Service:** Jenkins

---

### Government & Enterprise

---

#### OrenFederal
**Powered by:** SAM.gov API + Custom AI
**Description:** Federal contracting and grant management.

| Plan | Price | Opportunities | Proposals/mo | Team |
|------|-------|---------------|--------------|------|
| **Starter** | $199/mo | 50/mo | 2 | 3 |
| **Professional** | $499/mo | Unlimited | 10 | 10 |
| **Enterprise** | $999/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Starter | Professional | Enterprise |
|---------|---------|--------------|------------|
| SAM.gov monitoring | Yes | Yes | Yes |
| Opportunity alerts | Email | Email + SMS | Custom |
| AI RFP parsing | Basic | Advanced | Custom |
| AI proposal drafts | - | Yes | Yes |
| Compliance tracking | - | Yes | Yes |
| Grant discovery | - | Yes | Yes |
| Capture management | - | - | Yes |
| Past performance DB | - | - | Yes |

**White-Label Service:** SAM.gov API + Claude AI

---

#### OrenWeb
**Powered by:** Custom AI Website Builder
**Description:** AI-powered website and funnel builder.

| Plan | Price | Sites | Pages | AI Generations |
|------|-------|-------|-------|----------------|
| **Starter** | $29/mo | 1 | 10 | 50/mo |
| **Professional** | $79/mo | 5 | 50 | 200/mo |
| **Agency** | $199/mo | 25 | Unlimited | 1,000/mo |
| **Enterprise** | $499/mo | Unlimited | Unlimited | Unlimited |

**Features by Plan:**

| Feature | Starter | Professional | Agency | Enterprise |
|---------|---------|--------------|--------|------------|
| AI page generation | Yes | Yes | Yes | Yes |
| Drag-and-drop editor | Yes | Yes | Yes | Yes |
| Templates | 10 | 50 | All | All + Custom |
| Custom domains | 1 | 5 | 25 | Unlimited |
| SSL certificates | Yes | Yes | Yes | Yes |
| Form builder | Yes | Yes | Yes | Yes |
| A/B testing | - | Yes | Yes | Yes |
| Analytics | Basic | Full | Full | Custom |
| White-label | - | - | Yes | Yes |
| API access | - | - | Yes | Yes |

**White-Label Service:** Custom AI + Gemini

---

## Self-Hosted FOSS Services

Complete list of all self-hosted open source services with their white-label names:

| White-Label Name | Open Source Software | Category | Port | Description |
|------------------|---------------------|----------|------|-------------|
| **OrenDesk** | Chatwoot | Support | 3100 | Customer engagement & live chat |
| **OrenSEO** | SerpBear | Marketing | 3200 | SEO rank tracking |
| **OrenApps** | Appsmith | Development | 8280 | Low-code internal tools |
| **OrenMetrics** | Matomo | Analytics | 8380 | Privacy-focused analytics |
| **OrenDesign** | Penpot | Design | 9001 | Design & prototyping |
| **OrenChat** | Mattermost | Collaboration | 8065 | Team messaging |
| **OrenData** | NocoDB | Data | 8080 | Database spreadsheet UI |
| **OrenMonitor** | Grafana | Monitoring | 3000 | Observability platform |
| **OrenDocs** | Paperless-ngx | Productivity | 8000 | Document management |
| **OrenSocial** | Postiz | Marketing | 4200 | Social media scheduling |
| **OrenBackup** | pgBackWeb | DevOps | 8085 | PostgreSQL backups |
| **OrenHR** | OrangeHRM | HR | 8090 | HR management |
| **OrenCI** | Jenkins | DevOps | 8081 | CI/CD automation |
| **OrenAutomate** | n8n | Automation | 5678 | Workflow automation |

---

## Third-Party Integrations

### Communication APIs

| Integration | Purpose | White-Label Feature |
|-------------|---------|---------------------|
| **Twilio** | Voice & SMS | OrenVoice |
| **ElevenLabs** | Text-to-Speech | OrenAgents voice |
| **Resend** | Email sending | All email features |
| **WhatsApp Business** | Messaging | OrenDesk channel |

### Lead Generation APIs

| Integration | Purpose | White-Label Feature |
|-------------|---------|---------------------|
| **Hunter.io** | Email finding | OrenLeads enrichment |
| **Snov.io** | Email verification | OrenLeads validation |
| **Whoxy** | WHOIS lookup | OrenLeads domain info |
| **ICANN CZDS** | Domain discovery | OrenLeads new domains |

### Payment & Commerce

| Integration | Purpose | White-Label Feature |
|-------------|---------|---------------------|
| **Stripe** | Payments | Subscription billing |
| **PayPal** | Payments | Alternative payments |

### Cloud & Deployment

| Integration | Purpose | White-Label Feature |
|-------------|---------|---------------------|
| **Coolify** | PaaS | Self-hosted deployment |
| **Cloudflare** | CDN/DNS | Edge delivery |
| **Vercel** | Hosting | Optional Next.js deployment |
| **GitHub** | Source control | CI/CD integration |

---

## AI Services

### AI Model Providers

| Provider | Models | Purpose |
|----------|--------|---------|
| **Anthropic Claude** | Claude 3.5 Sonnet, Opus | Code generation, analysis, content |
| **Google Gemini** | Gemini Pro, Flash | General AI, image generation |
| **OpenRouter** | Multiple models | Fallback & specialized tasks |
| **OpenAI** | GPT-4, GPT-4o | Alternative AI provider |

### AI Features by Product

| White-Label Product | AI Capabilities |
|---------------------|-----------------|
| **OrenAgents** | Voice synthesis, conversation AI, language detection |
| **OrenLeads** | Lead scoring, qualification prediction |
| **OrenSEO** | Content suggestions, keyword analysis |
| **OrenFederal** | RFP parsing, proposal drafting |
| **OrenWeb** | Page generation, content writing |
| **OrenDesk** | Auto-responses, sentiment analysis |
| **OrenSocial** | Post generation, best time prediction |

---

## Quick Reference Card

### Essential Ports

```
Marketing Site     : 80/443 (orengen.io)
Nexus Admin        : 80/443 (nexus.orengen.io)
Twenty CRM         : 3000   (crm.orengen.io)
n8n Automation     : 5678   (n8n.orengen.io)
PostgreSQL         : 5432   (internal)
Redis              : 6379   (internal)
```

### Essential Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Restart service
docker compose restart <service>

# Build Nexus
cd nexus && npm run build

# Build Marketing
docker build -t orengen-marketing -f Dockerfile .
```

### Essential URLs

```
Marketing:     https://orengen.io
Admin:         https://nexus.orengen.io
CRM:           https://crm.orengen.io
Automation:    https://n8n.orengen.io
Blog:          https://blog.orengen.io
GitHub:        https://github.com/orengenio
```

---

**OrenGen Worldwide** | 2026 | HUB Certified Minority Business Enterprise
