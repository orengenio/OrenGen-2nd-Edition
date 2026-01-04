# OrenGen.io - System Architecture

Complete infrastructure for AI-powered automation platform.

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ORENGEN.IO PLATFORM                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📱 Frontend Layer                                           │
│  ├─ orengen.io          → Marketing Site (Static HTML)      │
│  ├─ crm.orengen.io      → Twenty CRM (Client Management)    │
│  ├─ app.orengen.io      → Client Dashboard (Coming Soon)    │
│  └─ admin.orengen.io    → Admin Portal (Coming Soon)        │
│                                                               │
│  ⚙️  Backend Services                                        │
│  ├─ n8n.orengen.io      → Workflow Automation (Deployed)    │
│  ├─ PostgreSQL          → Database (CRM + n8n)              │
│  ├─ Redis               → Caching & Sessions                 │
│  └─ API Gateway         → Custom Business Logic (TBD)       │
│                                                               │
│  🔌 External Integrations                                    │
│  ├─ Twilio              → Voice & SMS                        │
│  ├─ OpenAI              → GPT-4, Whisper, TTS               │
│  ├─ Stripe              → Payment Processing                 │
│  └─ Custom APIs         → Your integrations                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🖥️ Server Resources

**Current Server:** 15.204.243.95

### Recommended Allocation

| Service          | Min RAM | Recommended | Production |
|-----------------|---------|-------------|------------|
| Marketing Site  | 256MB   | 512MB       | 1GB        |
| Twenty CRM      | 2GB     | 4GB         | 8GB        |
| n8n             | 1GB     | 2GB         | 4GB        |
| PostgreSQL      | 512MB   | 2GB         | 4GB        |
| Redis           | 256MB   | 512MB       | 1GB        |
| **Total**       | **4GB** | **9GB**     | **18GB**   |

**Note:** Start with 8-12GB server, scale up as needed.

## 🌐 Domain Configuration

| Domain              | Service        | SSL | Status    |
|---------------------|----------------|-----|-----------|
| orengen.io          | Marketing      | ✅  | Live      |
| crm.orengen.io      | Twenty CRM     | ⏳  | Setup     |
| n8n.orengen.io      | n8n Workflows  | ⏳  | Deployed  |
| app.orengen.io      | Client Portal  | ⏳  | Planned   |
| admin.orengen.io    | Admin Panel    | ⏳  | Planned   |

## 📂 Repository Structure

```
/workspaces/home/
├── marketing/              # Marketing website (orengen.io)
│   ├── index.html         # Homepage
│   ├── services.html      # Services page
│   ├── pricing.html       # Pricing page
│   ├── assets/            # Images, CSS, JS
│   │   └── images/        # Local image storage
│   ├── nginx.conf         # Web server config
│   └── Dockerfile         # Container image
│
├── crm/                   # Twenty CRM (crm.orengen.io)
│   ├── docker-compose.yml # CRM stack
│   ├── .env.example       # Configuration template
│   └── README.md          # Setup guide
│
├── wordpress/             # Legacy files (archived)
│   └── WORDPRESS-INTEGRATION-GUIDE.md
│
├── Dockerfile             # Marketing site Docker image
└── ARCHITECTURE.md        # This file
```

## 🔄 Data Flow Examples

### Example 1: Lead Capture → CRM → AI Call
```
1. User fills form on orengen.io
   ↓
2. Form POST → n8n webhook (n8n.orengen.io/webhook/lead)
   ↓
3. n8n workflow:
   - Creates contact in Twenty CRM (GraphQL API)
   - Triggers Twilio AI voice call
   - Sends notification email
   ↓
4. Sales rep sees lead in CRM dashboard (crm.orengen.io)
```

### Example 2: Client Portal Automation
```
1. Client logs into app.orengen.io
   ↓
2. Requests AI automation setup
   ↓
3. Admin approves in admin.orengen.io
   ↓
4. n8n creates workflow automatically
   ↓
5. Client gets white-labeled dashboard with their workflows
```

## 🔐 Security Setup

### Environment Variables Required

**Twenty CRM:**
- `POSTGRES_PASSWORD` - Database password
- `ACCESS_TOKEN_SECRET` - JWT token secret
- `LOGIN_TOKEN_SECRET` - Login security
- `REFRESH_TOKEN_SECRET` - Session refresh
- `FILE_TOKEN_SECRET` - File upload security

**n8n (Already deployed):**
- Configured in Coolify dashboard

### Generate Secrets
```bash
# Generate all 4 secrets at once
for i in {1..4}; do openssl rand -base64 32; done
```

## 🚀 Deployment Steps

### 1. Marketing Site (DONE ✅)
- Deployed via Coolify
- Dockerfile builds nginx container
- Custom nginx.conf for clean URLs
- SSL via Coolify/Traefik

### 2. Twenty CRM (IN PROGRESS ⏳)
```bash
# In Coolify:
1. Create new "Docker Compose" service
2. Repository: orengenio/OrenGen-2nd-Edition
3. Base directory: crm
4. Add environment variables from .env.example
5. Domain: crm.orengen.io
6. Enable SSL
7. Deploy!
```

### 3. n8n Workflows (NEXT STEP)
- Already running
- Create integration workflows:
  - Lead capture from marketing site
  - CRM contact sync
  - AI voice call triggers
  - SMS automation

### 4. Client Dashboard (FUTURE)
- Next.js/React application
- Authentication via Supabase or Twenty
- White-label multi-tenant architecture
- Real-time updates from n8n

## 🔗 Integration Points

### n8n ↔ Twenty CRM
```javascript
// n8n HTTP Request Node
Method: POST
URL: https://crm.orengen.io/graphql
Headers: 
  Authorization: Bearer YOUR_API_KEY
Body:
  {
    query: `
      mutation CreateContact($data: ContactInput!) {
        createContact(data: $data) {
          id
          firstName
          lastName
          email
        }
      }
    `,
    variables: {
      data: {
        firstName: "{{$json.firstName}}",
        lastName: "{{$json.lastName}}",
        email: "{{$json.email}}"
      }
    }
  }
```

### Marketing Site → n8n
```javascript
// Form submission in index.html
fetch('https://n8n.orengen.io/webhook/lead-capture', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    source: 'marketing-site'
  })
})
```

## 📊 Monitoring & Backups

### Database Backups
```bash
# Automated daily backup script
docker exec crm-postgres-1 pg_dump -U twenty twenty > /backups/crm-$(date +%F).sql

# Keep last 30 days
find /backups -name "crm-*.sql" -mtime +30 -delete
```

### Health Checks
- Marketing: https://orengen.io (200 OK)
- CRM: https://crm.orengen.io/healthz
- n8n: https://n8n.orengen.io/healthz

## 🎯 Next Steps

**Phase 1: CRM Setup** (This Week)
- [ ] Deploy Twenty CRM to Coolify
- [ ] Generate and set all secrets
- [ ] Configure domain and SSL
- [ ] Create admin account
- [ ] White-label branding (logo, colors)

**Phase 2: Integration** (Week 2)
- [ ] Build n8n → CRM workflows
- [ ] Connect marketing form to n8n
- [ ] Set up AI voice call automation
- [ ] Test lead capture flow end-to-end

**Phase 3: Client Portal** (Week 3-4)
- [ ] Design Next.js dashboard
- [ ] Implement authentication
- [ ] Multi-tenant setup
- [ ] White-label customization per client

**Phase 4: Revenue** (Week 4+)
- [ ] Launch beta with first 3 clients
- [ ] Automate onboarding
- [ ] Scale infrastructure
- [ ] Add billing/subscriptions

## 💰 Cost Breakdown

**Server Costs:**
- 12GB RAM VPS: ~$40-60/month (Hetzner, DigitalOcean)

**Service Costs:**
- Twilio: Pay-as-you-go (~$0.01/min voice, $0.0075/SMS)
- OpenAI: Pay-as-you-go (~$0.01/1K tokens)
- Domain: $12/year
- Email: Free (SMTP via Gmail/SendGrid free tier)

**Total Monthly:** ~$60 + usage-based fees (pass to clients)

## 🆘 Troubleshooting

### CRM Won't Start
```bash
# Check logs
docker-compose -f crm/docker-compose.yml logs

# Verify database
docker exec -it crm-postgres-1 psql -U twenty -d twenty -c "SELECT 1"

# Reset if needed
docker-compose -f crm/docker-compose.yml down -v
docker-compose -f crm/docker-compose.yml up -d
```

### Memory Issues
```bash
# Check current usage
docker stats

# If hitting limits, upgrade server or optimize:
# - Reduce postgres shared_buffers
# - Reduce redis maxmemory
# - Lower Twenty deploy limits
```

### SSL/Domain Issues
- Verify DNS points to 15.204.243.95
- Check Coolify logs for Traefik errors
- Ensure ports 80/443 open on server
- Wait 5-10 minutes for Let's Encrypt

## 📚 Resources

- **Twenty Docs:** https://twenty.com/developers
- **n8n Docs:** https://docs.n8n.io
- **Coolify Docs:** https://coolify.io/docs
- **Twilio API:** https://www.twilio.com/docs
- **OpenAI API:** https://platform.openai.com/docs
