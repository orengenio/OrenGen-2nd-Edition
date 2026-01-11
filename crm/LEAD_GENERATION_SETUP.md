# Lead Generation System Setup (Foylo/Cyberleads Clone)

## Overview
Automated lead generation system that scrapes newly registered domains, detects tech stacks, enriches contact data, and scores leads - all for $0-20/month.

## Architecture

```
ICANN CZDS → Domain Scraper → webanalyze → Enrichment → Scoring → PostgreSQL → CRM
                  ↓              (Tech Stack)    ↓         ↓
              N8N Workflow         ↓          Whoxy API  Lead Score
                                   ↓          Hunter.io   Algorithm
                              Filter Rules
```

## Cost Breakdown

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| ICANN CZDS | **FREE** | 1,151 TLDs, daily updates |
| Whoxy API | $2/1K lookups | Pay-as-you-go, or FREE for nonprofits (250K) |
| webanalyze | **FREE** | Self-hosted, open source |
| Your infrastructure | **$0** | N8N, Postal, MailWizz already running |
| **Total** | **$0-20/mo** | For 10K domains/month |

## Setup Steps

### 1. ICANN CZDS Access (FREE - Zone Files)

**Apply for access:**
1. Go to https://czds.icann.org
2. Create account
3. Request access to TLDs (.com, .net, .io, .ai, etc.)
4. Wait 2-5 days for approval (90%+ approval rate)
5. Download daily zone file diffs

**Available TLDs:** 1,151 zones including:
- .com, .net, .org
- .io, .ai, .co
- Country codes: .uk, .de, .fr, etc.

### 2. Whoxy Setup (WHOIS Enrichment)

**Sign up:**
- URL: https://whoxy.com
- Pricing: $2 per 1,000 lookups
- FREE tier: 500 lookups/month
- Nonprofit: Up to 250,000 FREE

**Get API key:**
```bash
# In your .env file:
WHOXY_API_KEY=your_key_here
```

### 3. Install webanalyze (Tech Stack Detection)

**Option A: Go Binary (Recommended - Fast)**
```bash
# Install Go if needed
sudo apt install golang-go

# Install webanalyze
go install github.com/rverton/webanalyze/cmd/webanalyze@latest

# Update tech fingerprints
webanalyze -update

# Test single domain
webanalyze -host example.com -output json

# Bulk scan from file
webanalyze -hosts domains.txt -output json -worker 10 > results.json
```

**Option B: Python (Alternative)**
```bash
git clone https://github.com/enthec/webappanalyzer
cd webappanalyzer
pip install -r requirements.txt
python webappanalyzer.py -u https://example.com
```

### 4. Database Setup

```bash
# Already done if you ran schema.sql
# Tables created:
# - lead_sources
# - domain_leads
# - lead_gen_campaigns
# - lead_gen_config
```

### 5. N8N Workflow Setup

**Create workflow:** `/crm/n8n-workflows/domain-lead-generator.json`

**Workflow Steps:**
1. **Schedule Trigger** (Daily at 2 AM)
2. **ICANN CZDS Downloader** (HTTP Request or cron job)
3. **Zone File Parser** (Extract new domains)
4. **Filter Domains** (Apply campaign filters)
5. **Whoxy Enrichment** (Get WHOIS data)
6. **webanalyze Scanner** (Detect tech stack)
7. **Lead Scoring** (Calculate 0-100 score)
8. **PostgreSQL Insert** (Save to domain_leads table)
9. **Notification** (Slack/Email summary)

### 6. Lead Scoring Algorithm

```javascript
// Factors (0-100 score)
let score = 0;

// Domain age (newer = better)
if (daysSinceRegistration < 7) score += 30;
else if (daysSinceRegistration < 30) score += 20;

// Tech stack matches
if (techStack.cms === 'WordPress') score += 15;
if (techStack.cms === 'Shopify') score += 20;
if (!techStack.hasContactForm) score -= 10; // No way to reach them

// Email found
if (enrichmentData.emails.length > 0) score += 20;

// WHOIS data quality
if (whoisData.registrantOrg) score += 10;
if (whoisData.registrantEmail) score += 5;

// Target country
if (whoisData.registrantCountry === 'US') score += 10;

return Math.min(score, 100);
```

### 7. Enrichment Services (Optional)

**Hunter.io (Email Finder)**
```bash
# API: https://hunter.io/api
# Pricing: $49/mo for 1,000 searches
HUNTER_API_KEY=your_key
```

**Snov.io (Alternative)**
```bash
# API: https://snov.io/api
# Pricing: $39/mo for 1,000 credits
SNOV_API_KEY=your_key
```

## Usage

### Create Lead Gen Campaign

```sql
INSERT INTO lead_gen_campaigns (name, filters, status, created_by)
VALUES (
  'New WordPress Sites',
  '{
    "technologies": ["WordPress"],
    "tlds": [".com", ".net"],
    "registeredAfter": "2026-01-01",
    "hasContactForm": true,
    "countries": ["US", "CA", "UK"]
  }'::jsonb,
  'active',
  'your_user_id'
);
```

### Query High-Value Leads

```sql
SELECT 
  domain,
  lead_score,
  tech_stack->>'cms' as cms,
  enrichment_data->'emails' as emails,
  whois_data->>'registrantOrg' as company,
  status
FROM domain_leads
WHERE lead_score >= 70
  AND status = 'enriched'
  AND assigned_to IS NULL
ORDER BY lead_score DESC, scraped_date DESC
LIMIT 100;
```

### Convert Lead to CRM Company

```sql
-- Create company from lead
INSERT INTO companies (name, website, owner_id, status)
SELECT 
  whois_data->>'registrantOrg',
  'https://' || domain,
  $1, -- assign to user
  'prospect'
FROM domain_leads
WHERE id = $2;

-- Link lead to company
UPDATE domain_leads
SET company_id = $3, status = 'converted'
WHERE id = $2;
```

## Expected Results

### Timeline
- **Week 1-2**: Setup complete, first domains scraped
- **Week 3**: Enrichment running, lead scoring active
- **Week 4**: First outreach campaigns launched
- **Week 5-6**: First client conversions

### Volume (Daily)
- **Domains scraped**: 1,000 - 10,000/day
- **Filtered leads**: 50-200/day (based on criteria)
- **Enriched leads**: 30-100/day (with emails)
- **High-score leads**: 10-30/day (score ≥ 70)

### Conversion Funnel
- 10,000 domains scraped
- 500 match filters (5%)
- 200 enriched with emails (2%)
- 50 high-score leads (0.5%)
- 5-10 contacted respond (10-20%)
- 1-2 become clients (2-4%)

## Automation with N8N

### Workflow 1: Daily Domain Scraper
```
Cron (2 AM) 
  → Download CZDS zone diff
  → Parse new domains
  → Insert to staging table
```

### Workflow 2: Tech Stack Scanner
```
Cron (Every 4 hours)
  → Get 100 domains with status='new'
  → Run webanalyze batch scan
  → Update tech_stack column
  → Set status='enriched'
```

### Workflow 3: WHOIS Enricher
```
Cron (Every 2 hours)
  → Get 50 domains with high score + no WHOIS
  → Call Whoxy API batch
  → Update whois_data column
```

### Workflow 4: Email Finder
```
Cron (Every 6 hours)
  → Get 20 domains with score ≥ 70 + no emails
  → Call Hunter.io API
  → Update enrichment_data column
```

### Workflow 5: Auto-Outreach Trigger
```
Database Trigger
  → New lead with score ≥ 80
  → Has email
  → Create MailWizz subscriber
  → Add to "New WordPress Sites" campaign
  → Send intro email
```

## Monitoring

### Dashboard Queries

**Daily Stats:**
```sql
SELECT 
  DATE(scraped_date) as date,
  COUNT(*) as total_scraped,
  COUNT(CASE WHEN lead_score >= 70 THEN 1 END) as high_value,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted
FROM domain_leads
WHERE scraped_date >= NOW() - INTERVAL '30 days'
GROUP BY DATE(scraped_date)
ORDER BY date DESC;
```

**Top Tech Stacks:**
```sql
SELECT 
  tech_stack->>'cms' as cms,
  COUNT(*) as count,
  AVG(lead_score) as avg_score
FROM domain_leads
WHERE tech_stack IS NOT NULL
GROUP BY tech_stack->>'cms'
ORDER BY count DESC
LIMIT 10;
```

## Best Practices

1. **Start Small**: Begin with 1-2 TLDs (.com, .io)
2. **Filter Early**: Apply tech stack filters before enrichment to save API costs
3. **Score First**: Enrich only high-scoring leads
4. **Batch Processing**: Group API calls to maximize efficiency
5. **Rate Limiting**: Respect API limits (Whoxy: 10 req/sec)
6. **Clean Data**: Remove obvious spam domains (gambling, adult, etc.)
7. **Monitor Costs**: Track API usage in N8N

## Compliance

- **CAN-SPAM**: Include unsubscribe in all emails
- **GDPR**: Get consent for EU leads
- **WHOIS**: Public data, but respect privacy
- **Rate Limits**: Don't hammer APIs or websites

## Support

- ICANN CZDS: czds-help@icann.org
- Whoxy: hello@whoxy.com
- webanalyze: GitHub issues

## Next Steps

1. ✅ Database tables created
2. ⬜ Sign up for ICANN CZDS
3. ⬜ Get Whoxy API key
4. ⬜ Install webanalyze
5. ⬜ Create N8N workflows
6. ⬜ Launch first campaign
7. ⬜ Monitor results
8. ⬜ Scale up
