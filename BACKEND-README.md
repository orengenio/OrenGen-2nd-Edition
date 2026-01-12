# OrenGen CRM Backend

Complete B2B CRM system with integrated Lead Generation and AI Website Builder powered by Claude Code and Gemini.

## 🚀 Features

### 1. B2B CRM System
- **Companies Management** - Track organizations with custom fields, industry, size, revenue
- **Contacts Management** - Manage decision-makers with LinkedIn integration
- **Deals Pipeline** - Visual sales pipeline with stages and probability tracking
- **Activities** - Log calls, emails, meetings, notes, and tasks
- **Role-Based Access Control** - 6 user roles with granular permissions
- **Multi-Tenancy** - Row-Level Security for data isolation

### 2. Lead Generation System
- **Domain Scraping** - ICANN CZDS integration for new domain discovery
- **Lead Enrichment** - Automatic WHOIS lookup, email finding, tech stack detection
- **Lead Scoring** - AI-powered lead scoring (0-100)
- **Campaign Management** - Create targeted lead generation campaigns
- **Data Sources** - Whoxy, Hunter.io, Snov.io integration

### 3. AI Website Builder
- **Smart Questionnaire** - Comprehensive 45+ question survey
- **AI Wireframing** - Claude AI generates complete wireframe structures
- **Code Generation** - Generate production-ready code in React, Next.js, HTML
- **Multi-Framework Support** - React, Next.js, HTML, Vue, Astro
- **Auto-Deployment** - Optional deployment to Vercel, Netlify, Cloudflare

---

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Row-Level Security
- **Authentication**: JWT with bcrypt
- **AI Integration**:
  - Anthropic Claude API (Sonnet 3.5)
  - Google Gemini API
- **APIs**:
  - ICANN CZDS for domain data
  - Whoxy for WHOIS lookups
  - Hunter.io for email finding
  - Snov.io for email verification

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Claude API key (from Anthropic)
- Gemini API key (optional, from Google)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/orengen_crm"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# AI APIs
CLAUDE_API_KEY="sk-ant-api03-..."
GEMINI_API_KEY="AIza..."

# Lead Generation (Optional)
ICANN_CZDS_USERNAME="your_username"
ICANN_CZDS_PASSWORD="your_password"
WHOXY_API_KEY="your_whoxy_api_key"
HUNTER_API_KEY="your_hunter_api_key"
SNOV_API_KEY="your_snov_api_key"

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key"
```

### Step 3: Set Up Database

Run the automated database setup:

```bash
npm run db:setup
```

This will:
- Create all tables and indexes
- Set up Row-Level Security policies
- Create default pipeline and stages
- Create a default admin user

**Default Admin Credentials:**
- Email: `admin@orengen.io`
- Password: `admin123`

⚠️ **IMPORTANT**: Change the admin password immediately!

### Step 4: Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

---

## 📚 API Documentation

See [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) for complete API reference.

### Quick Examples

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orengen.io","password":"admin123"}'
```

#### Create Company
```bash
curl -X POST http://localhost:3000/api/crm/companies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "industry": "Technology",
    "size": "medium",
    "website": "https://acme.com"
  }'
```

#### Generate AI Wireframe
```bash
curl -X POST http://localhost:3000/api/websites/projects/PROJECT_ID/generate-wireframe \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🗄️ Database Schema

### Core CRM Tables
- `users` - User accounts with role-based access
- `teams` - Sales teams
- `companies` - Organizations
- `contacts` - Decision-makers
- `deals` - Sales opportunities
- `activities` - Interactions and tasks
- `products` - Product catalog
- `pipelines` - Sales pipelines
- `pipeline_stages` - Pipeline stages

### Lead Generation Tables
- `lead_sources` - Lead origin tracking
- `domain_leads` - Scraped/imported domains
- `lead_gen_campaigns` - Campaign management
- `lead_gen_config` - API configuration

### AI Website Builder Tables
- `website_projects` - Website projects
- `website_questions` - Questionnaire templates
- `wireframes` - AI-generated wireframes
- `designs` - Design specifications
- `generated_code` - Generated code files
- `ai_webbuilder_config` - AI configuration

---

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Bcrypt password hashing (12 rounds)
- Role-based access control (RBAC)
- Row-Level Security (RLS) in PostgreSQL

### Data Protection
- API key encryption in database
- Secure password storage
- SQL injection prevention (parameterized queries)
- CORS configuration

### Rate Limiting (Recommended)
Implement rate limiting for:
- Auth endpoints: 10 req/min
- Standard endpoints: 100 req/min
- AI endpoints: 10 req/hour

---

## 🔄 API Workflow Examples

### 1. Complete CRM Flow

```javascript
// 1. Register/Login
const { token } = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
}).then(r => r.json());

// 2. Create Company
const company = await fetch('/api/crm/companies', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ name: 'Acme Corp', industry: 'Tech' })
}).then(r => r.json());

// 3. Add Contact
const contact = await fetch('/api/crm/contacts', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    companyId: company.data.id,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@acme.com'
  })
}).then(r => r.json());

// 4. Create Deal
const deal = await fetch('/api/crm/deals', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    companyId: company.data.id,
    contactId: contact.data.id,
    title: 'Q1 Deal',
    value: 50000
  })
}).then(r => r.json());
```

### 2. Lead Generation Flow

```javascript
// 1. Create domain lead
const lead = await fetch('/api/leads/domains', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ domain: 'newlead.com' })
}).then(r => r.json());

// 2. Enrich lead data
const enriched = await fetch(`/api/leads/domains/${lead.data.id}/enrich`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Now has WHOIS data, emails, tech stack
console.log(enriched.data.enrichmentData.emails);
```

### 3. AI Website Builder Flow

```javascript
// 1. Create project
const project = await fetch('/api/websites/projects', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    projectName: 'Client Website',
    companyId: 'uuid'
  })
}).then(r => r.json());

// 2. Get questions
const questions = await fetch('/api/websites/questions', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 3. Submit answers (update project.responses in database)

// 4. Generate wireframe
const wireframe = await fetch(`/api/websites/projects/${project.data.id}/generate-wireframe`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// 5. Generate code
const code = await fetch(`/api/websites/projects/${project.data.id}/generate-code`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ framework: 'react' })
}).then(r => r.json());

// Download generated files
console.log(code.data.files);
```

---

## 🧪 Testing

### Manual Testing with curl

Test authentication:
```bash
# Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orengen.io","password":"admin123"}' \
  | jq -r '.data.token')

# Get current user
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# List companies
curl http://localhost:3000/api/crm/companies?page=1&limit=10 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📈 Scaling Considerations

### Performance Optimization
- Database indexes on frequently queried fields
- Connection pooling (max 20 connections)
- API response caching (implement Redis)
- Pagination for all list endpoints

### Database Scaling
- Read replicas for reporting
- Partitioning for large tables (activities, domain_leads)
- Archive old data periodically

### AI API Optimization
- Implement caching for similar requests
- Rate limiting to prevent abuse
- Queue system for background processing

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql postgresql://postgres:password@localhost:5432/orengen_crm

# Check if tables exist
\dt

# Verify schema
\d users
```

### API Not Working

1. Check environment variables are set correctly
2. Verify JWT_SECRET is at least 32 characters
3. Check database connection string
4. Ensure PostgreSQL is running
5. Check logs: `npm run dev` shows errors

### AI Generation Failing

1. Verify Claude API key is valid
2. Check API key has credits/quota
3. Ensure project has questionnaire responses
4. Check error logs for specific API errors

---

## 📝 Development Guidelines

### Code Structure

```
/app/api/               # API routes (Next.js App Router)
  /auth/               # Authentication endpoints
  /crm/                # CRM endpoints
  /leads/              # Lead generation endpoints
  /websites/           # AI website builder endpoints
/lib/                  # Shared utilities
  db.ts                # Database connection
  auth.ts              # Authentication utilities
  encryption.ts        # API key encryption
  api-response.ts      # Response helpers
/crm/                  # CRM-specific code
  database/schema.sql  # Database schema
  types.ts             # TypeScript types
/scripts/              # Utility scripts
  setup-database.js    # Database setup
```

### Adding New Endpoints

1. Create route file in `/app/api/[path]/route.ts`
2. Use existing auth and permission checks
3. Follow response format conventions
4. Add to API documentation
5. Test thoroughly

---

## 🚀 Production Deployment

### Environment Checklist

- [ ] Set secure `JWT_SECRET` (64+ characters)
- [ ] Set secure `ENCRYPTION_KEY`
- [ ] Configure production `DATABASE_URL`
- [ ] Add all required API keys
- [ ] Change default admin password
- [ ] Enable SSL/HTTPS
- [ ] Set up database backups
- [ ] Configure monitoring (Sentry, etc.)
- [ ] Set up rate limiting
- [ ] Review and restrict CORS settings

### Deployment Platforms

#### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 📞 Support

- **Documentation**: [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
- **Email**: support@orengen.io
- **GitHub**: https://github.com/orengenio/OrenGen-2nd-Edition

---

## 📄 License

Proprietary - OrenGen Worldwide

---

**Built with ❤️ by OrenGen Worldwide**
