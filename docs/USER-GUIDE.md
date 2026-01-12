# OrenGen CRM Platform - Complete User Guide

A comprehensive guide to the OrenGen B2B CRM system with lead generation, AI website builder, and Nexus super-admin dashboard.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication & Roles](#authentication--roles)
3. [CRM Dashboard](#crm-dashboard)
4. [Lead Generation System](#lead-generation-system)
5. [AI Website Builder](#ai-website-builder)
6. [Nexus Super-Admin Dashboard](#nexus-super-admin-dashboard)
7. [API Reference](#api-reference)
8. [Configuration](#configuration)

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

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
JWT_SECRET=your-secure-secret-key

# Lead Enrichment APIs (optional)
WHOXY_API_KEY=your-whoxy-key
HUNTER_API_KEY=your-hunter-key
SNOV_API_KEY=your-snov-key
```

---

## Authentication & Roles

### User Roles

| Role | Access Level | Description |
|------|--------------|-------------|
| `super_admin` | Full | Complete system access, all tenants |
| `admin` | High | Tenant admin, all features within org |
| `manager` | Medium | Team management, reports, assignments |
| `sales_rep` | Standard | CRM access, lead management |
| `marketing` | Limited | Campaigns, website builder |
| `viewer` | Read-only | Dashboard viewing only |

### Login

**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "user@company.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "admin" },
    "token": "eyJhbG..."
  }
}
```

Store the JWT token and include it in all subsequent requests:
```
Authorization: Bearer <token>
```

---

## CRM Dashboard

### Companies

Manage your B2B accounts and track company relationships.

#### View All Companies
Navigate to **Dashboard > Companies** or call:
```
GET /api/crm/companies?page=1&limit=20&search=acme
```

#### Create Company
```json
POST /api/crm/companies
{
  "name": "Acme Corp",
  "industry": "Technology",
  "website": "https://acme.com",
  "size": "51-200",
  "status": "prospect",
  "annual_revenue": 5000000
}
```

#### Company Statuses
- `prospect` - Potential customer, initial stage
- `active` - Current customer
- `inactive` - Former customer or dormant

---

### Contacts

Track individuals within companies.

#### Contact Fields
| Field | Type | Description |
|-------|------|-------------|
| first_name | string | Contact's first name |
| last_name | string | Contact's last name |
| email | string | Primary email (required) |
| phone | string | Phone number |
| job_title | string | Role at company |
| company_id | uuid | Link to company |
| status | enum | lead/prospect/customer/churned |

#### Contact Statuses
- `lead` - New contact, not yet qualified
- `prospect` - Qualified, in sales process
- `customer` - Converted, paying customer
- `churned` - Former customer

---

### Deals

Track sales opportunities through your pipeline.

#### Deal Stages
1. **lead** - Initial inquiry (10% probability)
2. **qualified** - Confirmed interest (25%)
3. **proposal** - Proposal sent (50%)
4. **negotiation** - Terms discussion (75%)
5. **closed_won** - Deal completed (100%)
6. **closed_lost** - Deal lost (0%)

#### Create Deal
```json
POST /api/crm/deals
{
  "title": "Enterprise License - Acme Corp",
  "value": 50000,
  "stage": "qualified",
  "probability": 25,
  "expected_close_date": "2024-03-15",
  "company_id": "uuid",
  "contact_id": "uuid"
}
```

---

### Activities

Log all interactions with contacts and companies.

#### Activity Types
- `call` - Phone calls
- `email` - Email correspondence
- `meeting` - In-person or virtual meetings
- `note` - Internal notes
- `task` - Action items

```json
POST /api/crm/activities
{
  "type": "call",
  "title": "Discovery Call",
  "description": "Discussed requirements...",
  "status": "completed",
  "company_id": "uuid",
  "contact_id": "uuid"
}
```

---

## Lead Generation System

The lead generation system helps you discover, enrich, and qualify potential customers from domain data.

### Domain Leads Overview

Domain leads are potential customers identified by their website domain. The system enriches these with:
- WHOIS registration data
- Technology stack detection
- Email discovery
- Automated lead scoring

### Adding Leads

#### Single Domain
```json
POST /api/leads/domains
{
  "domain": "example.com",
  "notes": "Found via industry research"
}
```

#### Bulk Import
```json
POST /api/leads/domains/bulk
{
  "domains": [
    "company1.com",
    "company2.com",
    "company3.com"
  ],
  "campaign_id": "optional-uuid",
  "auto_enrich": true
}
```

### Lead Enrichment

Enrichment pulls data from multiple sources to build a complete lead profile.

#### Trigger Enrichment
```json
POST /api/leads/domains/{id}/enrich
{
  "skipWhois": false,
  "skipTechStack": false,
  "skipEmailFinder": false,
  "preferredEmailSource": "both"
}
```

#### Data Sources

| Service | Data Provided | API Key Required |
|---------|--------------|------------------|
| WHOIS (Whoxy) | Registration date, registrant info, expiry | Yes |
| Hunter.io | Email addresses, verification | Yes |
| Snov.io | Alternative email finder | Yes |
| Tech Stack | CMS, frameworks, analytics tools | No |

#### Enrichment Response
```json
{
  "success": true,
  "data": {
    "domain": "example.com",
    "lead_score": 78,
    "whois_data": {
      "registrant_name": "John Doe",
      "registrant_company": "Example Inc",
      "creation_date": "2015-03-20",
      "domain_age_years": 9
    },
    "tech_stack": {
      "cms": "WordPress",
      "framework": "React",
      "analytics": ["Google Analytics", "Hotjar"]
    },
    "enrichment_data": {
      "emails": [
        { "email": "john@example.com", "confidence": 95 },
        { "email": "info@example.com", "confidence": 80 }
      ]
    }
  }
}
```

### Lead Scoring

Leads are automatically scored 0-100 based on multiple factors:

| Factor | Max Points | Description |
|--------|------------|-------------|
| Domain Age | 20 | Older domains = established business |
| WHOIS Data | 20 | Complete registration info |
| Tech Stack | 20 | Modern tech = good fit |
| Email Quality | 20 | Verified emails available |
| Company Size | 20 | Inferred from signals |

**Score Interpretation:**
- **70-100**: Hot lead - prioritize outreach
- **50-69**: Warm lead - good potential
- **30-49**: Cool lead - needs nurturing
- **0-29**: Cold lead - low priority

### Lead Statuses

| Status | Description | Next Action |
|--------|-------------|-------------|
| `new` | Just added, no enrichment | Run enrichment |
| `enriched` | Data collected | Review & qualify |
| `qualified` | Meets criteria | Assign to sales |
| `contacted` | Outreach initiated | Follow up |
| `converted` | Became customer | Create company/contact |
| `rejected` | Not a fit | Archive |

### Lead Assignment

Assign leads to team members:
```json
POST /api/leads/domains/{id}/assign
{
  "user_id": "user-uuid"
}
```

### Lead Conversion

Convert a qualified lead to a CRM company and contact:
```json
POST /api/leads/domains/{id}/convert
{
  "company_name": "Example Inc",
  "company_industry": "Technology",
  "contact_first_name": "John",
  "contact_last_name": "Doe",
  "contact_email": "john@example.com",
  "create_contact": true
}
```

This creates:
- A new Company record
- A new Contact linked to that company
- Updates the lead status to `converted`

### Campaigns

Organize leads into campaigns for tracking and segmentation.

#### Create Campaign
```json
POST /api/leads/campaigns
{
  "name": "Q1 2024 Tech Outreach",
  "description": "Target SaaS companies in finance",
  "status": "active",
  "filters": {
    "industry": "SaaS",
    "minScore": 50
  }
}
```

#### Campaign Metrics
Each campaign tracks:
- `leads_generated` - Total leads added
- `leads_qualified` - Passed qualification
- `leads_contacted` - Outreach sent
- `leads_converted` - Became customers

### Lead Statistics

Get pipeline analytics:
```
GET /api/leads/stats?days=30
```

**Response:**
```json
{
  "overview": {
    "totalLeads": 1250,
    "newLeads": 85,
    "enrichedLeads": 980,
    "qualifiedLeads": 420,
    "contactedLeads": 180,
    "convertedLeads": 45,
    "avgScore": 52,
    "highValueLeads": 180
  },
  "conversionFunnel": {
    "total": 1250,
    "enriched": 980,
    "qualified": 420,
    "contacted": 180,
    "converted": 45,
    "rates": {
      "enrichment": "78.4%",
      "qualification": "42.9%",
      "contact": "42.9%",
      "conversion": "25.0%"
    }
  }
}
```

### Export Leads

Export leads to CSV or JSON:
```
GET /api/leads/domains/export?format=csv&status=qualified&minScore=60
```

---

## AI Website Builder

Create professional websites using AI-powered generation.

### How It Works

1. **Answer Questions** - Describe your business through guided prompts
2. **Generate Wireframe** - AI creates page structure
3. **Generate Code** - Full HTML/CSS/JS output
4. **Export** - Download or deploy

### Create Website Project

```json
POST /api/websites/projects
{
  "name": "Acme Corp Website",
  "description": "Corporate website for tech company"
}
```

### Answer Discovery Questions

```json
POST /api/websites/questions
{
  "project_id": "uuid",
  "answers": {
    "business_name": "Acme Corp",
    "industry": "Technology",
    "target_audience": "B2B enterprises",
    "primary_goal": "Lead generation",
    "color_preference": "Blue and white",
    "pages_needed": ["Home", "About", "Services", "Contact"]
  }
}
```

### Generate Wireframe

```json
POST /api/websites/projects/{id}/generate-wireframe
```

Returns structured page layout with sections and components.

### Generate Code

```json
POST /api/websites/projects/{id}/generate-code
{
  "framework": "html",
  "includeStyles": true
}
```

---

## Nexus Super-Admin Dashboard

Nexus is your private backend control center with full system visibility.

### Accessing Nexus

Nexus runs as a separate React application:
```bash
cd nexus
npm install
npm run dev
# Opens at http://localhost:5173
```

### Configuration

Set the backend API URL in `nexus/.env.local`:
```env
VITE_API_URL=http://localhost:3000
```

### Studios Overview

| Studio | Purpose |
|--------|---------|
| **Control Room** | System health, metrics overview |
| **CRM Database** | Full contacts/companies management |
| **Lead Generation** | Domain leads, enrichment, campaigns |
| **Universal Calendar** | Unified calendar management |
| **Knowledge Wiki** | Internal documentation |
| **Brand Studio** | Brand guidelines, assets |
| **Web Studio** | Website builder interface |
| **Campaign Studio** | Marketing automation |
| **Opportunity Studio** | Federal contracting opportunities |
| **Vault** | Secrets and API key management |
| **Agent Studio** | AI agent configuration |

### CRM in Nexus

The CRM view provides:
- **Contacts tab** - Full CRUD with status filtering
- **Companies tab** - Organization management
- **Stats cards** - Real-time counts
- **Search** - Global filtering
- **Pagination** - Handle large datasets

### Lead Generation in Nexus

Access via sidebar > Lead Generation:

**Leads Tab:**
- Domain table with score, status, tech stack
- Bulk selection for operations
- One-click enrichment
- Export selected/all

**Campaigns Tab:**
- Campaign cards with metrics
- Status management (draft/active/paused/completed)

**Stats Tab:**
- Overview metrics (8 cards)
- Visual conversion funnel
- Score distribution

### Backend Connection

Nexus connects to your main CRM backend. If you see connection errors:
1. Ensure the Next.js backend is running (`npm run dev` in root)
2. Check `VITE_API_URL` points to correct address
3. Login via the CRM frontend first to get a valid token

---

## API Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication Header
```
Authorization: Bearer <jwt-token>
```

### Endpoints Summary

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | User login |
| POST | /auth/register | New user registration |
| GET | /auth/me | Current user info |

#### CRM
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /crm/companies | List companies |
| POST | /crm/companies | Create company |
| GET | /crm/companies/:id | Get company |
| PUT | /crm/companies/:id | Update company |
| DELETE | /crm/companies/:id | Delete company |
| GET | /crm/contacts | List contacts |
| POST | /crm/contacts | Create contact |
| GET | /crm/contacts/:id | Get contact |
| PUT | /crm/contacts/:id | Update contact |
| DELETE | /crm/contacts/:id | Delete contact |
| GET | /crm/deals | List deals |
| POST | /crm/deals | Create deal |
| GET | /crm/activities | List activities |
| POST | /crm/activities | Create activity |

#### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /leads/domains | List domain leads |
| POST | /leads/domains | Add single lead |
| GET | /leads/domains/:id | Get lead details |
| PUT | /leads/domains/:id | Update lead |
| DELETE | /leads/domains/:id | Delete lead |
| POST | /leads/domains/:id/enrich | Enrich lead |
| POST | /leads/domains/:id/assign | Assign lead |
| POST | /leads/domains/:id/convert | Convert to CRM |
| POST | /leads/domains/bulk | Bulk import |
| PUT | /leads/domains/bulk | Bulk update |
| DELETE | /leads/domains/bulk | Bulk delete |
| GET | /leads/domains/export | Export leads |
| GET | /leads/stats | Pipeline statistics |
| GET | /leads/enrichment-status | Service health |
| GET | /leads/campaigns | List campaigns |
| POST | /leads/campaigns | Create campaign |
| GET | /leads/campaigns/:id | Get campaign |
| PUT | /leads/campaigns/:id | Update campaign |
| DELETE | /leads/campaigns/:id | Delete campaign |

#### Websites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /websites/projects | List projects |
| POST | /websites/projects | Create project |
| POST | /websites/questions | Submit answers |
| POST | /websites/projects/:id/generate-wireframe | Generate wireframe |
| POST | /websites/projects/:id/generate-code | Generate code |

---

## Configuration

### Database Schema

Run the schema files in order:
```bash
psql $DATABASE_URL -f scripts/crm-schema.sql
psql $DATABASE_URL -f scripts/lead-gen-schema.sql
```

### Row-Level Security

The database uses PostgreSQL RLS for multi-tenant isolation:
- Each record has a `tenant_id`
- Users can only access their tenant's data
- Super admins can access all tenants

### API Keys for Enrichment

Configure these for full enrichment capabilities:

| Service | Get Key From | Monthly Free Tier |
|---------|--------------|-------------------|
| Whoxy | whoxy.com | 500 requests |
| Hunter.io | hunter.io | 25 searches |
| Snov.io | snov.io | 50 credits |

### Performance Tips

1. **Batch enrichments** - Don't enrich all leads at once
2. **Use campaigns** - Segment leads for focused processing
3. **Set score thresholds** - Only contact leads above 50
4. **Regular exports** - Backup data periodically

---

## Support

- **Issues**: Report bugs at the project repository
- **Documentation**: Check `/docs` folder for additional guides
- **Deployment**: See `COOLIFY-DEPLOY.md` for production setup

---

*OrenGen CRM Platform - Built for B2B growth*
