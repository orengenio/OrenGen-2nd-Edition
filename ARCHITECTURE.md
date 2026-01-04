# OrenGen.io - System Architecture

Complete 3-layer infrastructure for AI-powered automation platform.

## 🏗️ System Overview - 3 LAYERS

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: PUBLIC                           │
│  📱 orengen.io (Marketing Site) - Lead Generation           │
│     ├─ Static HTML/CSS/JS                                    │
│     ├─ Demo bar, lead capture forms                          │
│     └─ Webhook to n8n → CRM                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  LAYER 2: CLIENT PORTAL                      │
│  🎯 app.orengen.io - White-Label Client Services            │
│     ├─ AI Agents (voice, chat, automation)                   │
│     ├─ Automations & Workflows                               │
│     ├─ Websites & Funnels                                    │
│     ├─ CRM (Twenty) - Client's contacts/deals               │
│     ├─ Ads & Marketing campaigns                             │
│     └─ Multi-tenant, branded per client                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               LAYER 3: NEXUS ADMIN (YOU ONLY)                │
│  ⚡ nexus.orengen.io - Mission Control Center                │
│                                                               │
│  📊 CONTROL ROOM                                             │
│     ├─ CRM Database (all clients, contacts, deals)           │
│     ├─ Universal Calendar (integrations)                     │
│     └─ Knowledge Wiki                                        │
│                                                               │
│  📈 GROWTH                                                   │
│     ├─ New Project wizard                                    │
│     ├─ Brand & Press kit generator                           │
│     ├─ UGC / Creator management                              │
│     ├─ Web & Funnel builder                                  │
│     ├─ Form Generator                                        │
│     ├─ Omni-Channel Ops                                      │
│     └─ Community & Courses                                   │
│                                                               │
│  🏛️ FEDERAL                                                  │
│     ├─ Opportunity Studio (SAM.gov scouting)                 │
│     ├─ RFP Intelligence                                      │
│     ├─ Proposal Studio                                       │
│     ├─ Grant Studio                                          │
│     └─ Compliance & Risk                                     │
│                                                               │
│  🔧 INFRASTRUCTURE                                           │
│     ├─ Integrations Hub (Twilio, OpenAI, etc)               │
│     ├─ FOSS Registry                                         │
│     ├─ Vault (Secrets management)                            │
│     ├─ Automation (n8n workflows)                            │
│     └─ Data & Sheets                                         │
│                                                               │
│  ⚙️ SYSTEM                                                   │
│     ├─ Agent Studio (create/manage AI agents)                │
│     ├─ API & Developers tools                                │
│     └─ Settings                                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🌐 Domain Configuration

| Domain              | Layer          | Purpose                    | Status    |
|---------------------|----------------|----------------------------|-----------|
| orengen.io          | Public         | Marketing & Lead Gen       | ✅ Live   |
| app.orengen.io      | Client Portal  | White-label client tools   | 📋 Build  |
| nexus.orengen.io    | Admin Only     | Your control center        | ⏳ Deploy |
| crm.orengen.io      | Backend        | Twenty CRM (internal)      | ⏳ Deploy |
| n8n.orengen.io      | Backend        | Workflow automation        | ✅ Live   |

## 📂 Repository Structure

```
/workspaces/home/
├── marketing/              # ✅ LAYER 1 - Public Marketing (orengen.io)
│   ├── index.html         # Homepage with demo bar, forms
│   ├── services.html      # Services showcase
│   ├── pricing.html       # Pricing tiers
│   ├── case-studies.html  # Portfolio/case studies
│   ├── about.html         # Company info, HUB certification
│   ├── contact.html       # Contact forms
│   ├── assets/images/     # Local images (11MB)
│   ├── nginx.conf         # Custom nginx config
│   └── Dockerfile         # Container build
│
├── nexus/                 # ✅ LAYER 3 - Admin Platform (nexus.orengen.io)
│   ├── App.tsx           # Main TanStack Router app
│   ├── components/
│   │   ├── NexusContext.tsx      # State management
│   │   ├── Dashboard.tsx         # Control room
│   │   ├── FederalDashboard.tsx  # Gov contracting
│   │   ├── ProposalWorkstation.tsx
│   │   ├── Settings.tsx          # Federal profile, integrations
│   │   └── [...all Nexus components]
│   ├── types.ts          # TypeScript definitions
│   ├── constants.ts      # Initial data, configs
│   └── package.json      # Dependencies (TanStack, Recharts, etc)
│
├── nexus-platform/        # ⚠️ DUPLICATE? (needs cleanup)
│   └── [same structure as nexus/]
│
├── marketing-react/       # 🔄 React Marketing (optional alternative)
│   └── [React version of marketing site]
│
├── crm/                   # ⏳ LAYER 2 Backend - Twenty CRM
│   ├── docker-compose.yml # CRM stack
│   ├── .env.example       # Configuration
│   └── README.md          # Setup guide
│
├── ARCHITECTURE.md        # ✅ This file
├── README.md             # ✅ Project status & checklist
├── setup.sh              # ✅ Secret generation script
├── Dockerfile            # ✅ Marketing site image
└── docker-compose.yaml   # Root compose (if needed)
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

### Phase 1: Nexus Admin Platform (PRIORITY)

**Deploy your control center first:**

1. **Prepare Nexus for production:**
   ```bash
   cd nexus
   npm install
   npm run build
   ```

2. **Create Nexus Dockerfile:**
   - Build optimized production bundle
   - Nginx to serve React app
   - Environment variable injection

3. **Deploy to Coolify:**
   - Domain: `nexus.orengen.io`
   - Enable authentication/password protection
   - SSL via Coolify

4. **Configure integrations:**
   - Connect to Twenty CRM API
   - Link n8n webhooks
   - Set up API keys (Twilio, OpenAI, etc)

### Phase 2: Twenty CRM (Backend)

**Already configured, ready to deploy:**

```bash
# Generate secrets
./setup.sh

# In Coolify:
1. Create Docker Compose service
2. Repository: orengenio/OrenGen-2nd-Edition
3. Base directory: crm
4. Add environment variables
5. Domain: crm.orengen.io
6. Deploy
```

### Phase 3: Client Portal (Future)

**Build white-label client interface:**

- Option A: Clone Nexus, strip to client features only
- Option B: Build fresh with Next.js/React
- Features: Agents, Automations, Websites, CRM access, Marketing tools
- Multi-tenant architecture
- Domain: app.orengen.io

### Phase 4: Integration & Testing

1. **Connect layers:**
   - Marketing forms → n8n → Twenty CRM
   - Nexus → CRM API for client management
   - Client Portal → CRM for their data

2. **Test flows:**
   - Lead capture end-to-end
   - Client onboarding automation
   - Federal opportunity scouting
   - AI agent deployment

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
