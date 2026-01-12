# OrenGen CRM - Complete Full Stack Application

🚀 **AI-Powered B2B CRM with Lead Generation and Website Builder**

Complete, production-ready CRM system built with Next.js 15, PostgreSQL, Anthropic Claude & Google Gemini.

## 🎯 Features

✅ **B2B CRM System** - Companies, Contacts, Deals, Activities with RBAC
✅ **⚡ Speed-to-Lead** - Real-time notifications, auto-assignment, 5-min SLA
✅ **Lead Generation** - Auto-scraping, enrichment, advanced scoring (0-100)
✅ **AI Website Builder** - Claude-powered wireframes & code generation
✅ **Modern Dashboard** - React 19, TypeScript, Tailwind CSS
✅ **Real-Time Updates** - WebSocket notifications, live dashboard
✅ **Secure** - JWT auth, bcrypt, Row-Level Security  

## 📦 Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local with DATABASE_URL, JWT_SECRET, CLAUDE_API_KEY
npm run db:setup
npm run db:migrate  # Run database migrations for webhooks & assignments
npm run dev
```

**Default Login:** `admin@orengen.io` / `admin123`

**Access Lead Queue:** Dashboard → Lead Generation → Queue

## ⚡ Speed-to-Lead Highlights

🔥 **Real-Time Notifications** - Instant alerts for new leads via WebSocket
📊 **Advanced Scoring (0-100)** - Multi-factor algorithm with HOT/WARM/COLD tiers
🎯 **Auto-Assignment** - Round-robin & workload-based lead distribution
📋 **Priority Queue** - SLA-based dashboard with 5-min response time for hot leads
🔔 **Desktop Alerts** - Browser notifications with sound for high-priority leads
🔗 **Webhooks** - Zapier, Make.com integrations for external workflows

[See full Speed-to-Lead documentation →](./SPEED-TO-LEAD.md)

## 📚 Documentation

- [API Documentation](./API-DOCUMENTATION.md)
- [Backend Guide](./BACKEND-README.md)
- [⚡ Speed-to-Lead Features](./SPEED-TO-LEAD.md)
- [Deployment Guide](./DEPLOYMENT-GUIDE.md)

## 🛠️ Tech Stack

Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS
Backend: Next.js API, PostgreSQL, JWT, Socket.IO
AI: Anthropic Claude, Google Gemini
Real-Time: WebSocket notifications, live updates  

## 🚀 Deployment

Vercel: `vercel`  
Docker: `docker build -t orengen-crm .`  

See [BACKEND-README.md](./BACKEND-README.md) for full deployment guide.

## 📞 Support

Email: support@orengen.io  
GitHub: [Issues](https://github.com/orengenio/OrenGen-2nd-Edition/issues)  

---

**Built by OrenGen Worldwide** | January 2026
