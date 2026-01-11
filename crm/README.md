# B2B CRM with Role-Based Access Control

## Overview
Enterprise-grade B2B CRM system built for OrenGen.io with comprehensive role-based access control.

## Features
- **Multi-level Access Control**: 6 role types (Super Admin, Admin, Sales Manager, Sales Rep, Account Manager, Viewer)
- **Company Management**: Track prospects, customers, and partners
- **Deal Pipeline**: Visual pipeline with customizable stages
- **Activity Tracking**: Calls, emails, meetings, notes, tasks
- **Contact Management**: Unlimited contacts per company
- **Product Catalog**: Manage products and pricing
- **Analytics**: Revenue tracking, forecasting, conversion rates
- **Team Management**: Organize sales teams with hierarchy

## Tech Stack
- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React + TypeScript (from Nexus)
- **Auth**: JWT tokens with role-based permissions
- **Deployed**: app.orengen.io (internal) + partners.orengen.io (partner portal)

## Quick Start

1. **Setup Database**
```bash
psql -U postgres -c "CREATE DATABASE orengen_crm;"
psql orengen_crm < database/schema.sql
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run Dev Server**
```bash
npm run dev
```

Visit: http://localhost:3000
