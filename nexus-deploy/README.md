# Nexus Admin Platform - Deployment Guide

Admin-only control center for OrenGen.io

## 🎯 What is Nexus?

Your complete mission control platform with:
- **Control Room**: CRM, Calendar, Knowledge Wiki
- **Growth Tools**: Projects, Brand, UGC, Funnels, Forms
- **Federal Ops**: SAM.gov scouting, RFP/Proposal/Grant management
- **Infrastructure**: Integrations, FOSS registry, n8n automation
- **System**: Agent studio, API tools, Settings

## 🚀 Quick Deploy

### 1. Build & Deploy to Coolify

**In Coolify Dashboard:**
1. Create new "Dockerfile" service
2. Name: "Nexus Admin"
3. Repository: `orengenio/OrenGen-2nd-Edition`
4. Dockerfile path: `nexus-deploy/Dockerfile`
5. Domain: `nexus.orengen.io`
6. Enable SSL
7. Deploy!

### 2. Protect with Authentication

**Option A: Cloudflare Zero Trust** (Recommended)
- Free tier available
- SSO/OAuth support
- Easy email-based access
- Add to Cloudflare Workers

**Option B: Nginx Basic Auth**
```bash
# Generate password file
htpasswd -c .htpasswd admin

# Add to nginx.conf:
auth_basic "Nexus Admin Access";
auth_basic_user_file /etc/nginx/.htpasswd;
```

**Option C: Coolify Built-in Auth**
- Enable in Coolify service settings
- Set username/password
- Automatic HTTP Basic Auth

### 3. Configure Integrations

Create `.env` file in nexus root (or set in Coolify):

```env
# API Endpoints
VITE_CRM_API_URL=https://crm.orengen.io/graphql
VITE_N8N_WEBHOOK_URL=https://n8n.orengen.io/webhook

# External Services
VITE_TWILIO_ACCOUNT_SID=your_sid
VITE_OPENAI_API_KEY=your_key

# Google Services (for calendar, sheets)
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_API_KEY=your_api_key

# SAM.gov (for federal opportunities)
VITE_SAM_API_KEY=your_sam_gov_api_key

# Authentication (if using custom auth)
VITE_AUTH_SECRET=your_secret_key
```

## 📦 Local Development

```bash
cd nexus
npm install
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔐 Security

**CRITICAL: This is your admin platform**

1. **Always use HTTPS** (Coolify handles this)
2. **Enable authentication** (Cloudflare Zero Trust recommended)
3. **Limit access** by IP if possible
4. **Rotate secrets** regularly
5. **Monitor access logs**

## 🔗 Integrations

### Connect to Twenty CRM
```typescript
// In Nexus, API calls to CRM
const response = await fetch(import.meta.env.VITE_CRM_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    query: `query { ... }`
  })
});
```

### Connect to n8n
```typescript
// Trigger n8n workflows from Nexus
const response = await fetch(`${import.meta.env.VITE_N8N_WEBHOOK_URL}/trigger-workflow`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create_lead',
    data: contactData
  })
});
```

## 🎨 Customization

### White Label
Update `nexus/constants.ts`:
```typescript
export const BRAND_CONFIG = {
  name: 'OrenGen Nexus',
  logo: '/logo.png',
  colors: {
    primary: '#C85A3D',
    accent: '#1A4D7A'
  }
};
```

### Add Features
All components in `nexus/components/`
- Extend existing studios
- Add new agent types
- Customize federal profiles

## 📊 Features Breakdown

### Control Room
- CRM Database (contacts, companies, deals)
- Universal Calendar (Google, Outlook, CalDAV)
- Knowledge Wiki (markdown-based docs)

### Growth Studios
- **New Project**: Wizard for client onboarding
- **Brand & Press**: Logo, colors, messaging
- **UGC / Creator**: Content creator management
- **Web & Funnel**: Landing page builder
- **Form Generator**: Dynamic form creation
- **Omni-Channel**: Multi-platform campaigns
- **Community**: Courses, forums, membership

### Federal Operations
- **Opportunity Studio**: SAM.gov opportunity scouting
- **RFP Intelligence**: AI-powered RFP analysis
- **Proposal Studio**: Proposal writing assistant
- **Grant Studio**: Grant application management
- **Compliance**: Risk assessment, set-aside tracking

### Infrastructure
- **Integrations Hub**: Connect APIs (Twilio, OpenAI, etc)
- **FOSS Registry**: Open-source tool catalog
- **Vault**: Secrets management
- **Automation**: n8n workflow builder
- **Data & Sheets**: Google Sheets integration

### System
- **Agent Studio**: Create/configure AI agents
- **API & Developers**: API keys, webhooks, docs
- **Settings**: User profile, preferences, integrations

## 🐛 Troubleshooting

**Build fails:**
```bash
# Clear node_modules and rebuild
rm -rf nexus/node_modules nexus/package-lock.json
cd nexus && npm install
npm run build
```

**Can't access after deploy:**
- Check Coolify logs
- Verify DNS points to server
- Ensure SSL certificate generated
- Check authentication settings

**API calls failing:**
- Verify environment variables set
- Check CORS settings on CRM/n8n
- Confirm API keys are valid
- Check network/firewall rules

## 📚 Resources

- **TanStack Router**: https://tanstack.com/router
- **Recharts**: https://recharts.org
- **Lucide Icons**: https://lucide.dev
- **SAM.gov API**: https://open.gsa.gov/api/sam-api/
