# OrenGen CRM API Documentation

Complete API documentation for the OrenGen B2B CRM, Lead Generation, and AI Website Builder platform.

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [CRM API](#crm-api)
- [Lead Generation API](#lead-generation-api)
- [AI Website Builder API](#ai-website-builder-api)
- [Error Handling](#error-handling)

---

## Getting Started

### Base URL

```
Development: http://localhost:3000/api
Production: https://orengen.io/api
```

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (copy `.env.example` to `.env.local`):
```bash
cp .env.example .env.local
```

3. Set up the database:
```bash
npm run db:setup
```

4. Start the development server:
```bash
npm run dev
```

---

## Authentication

All API endpoints (except `/auth/register` and `/auth/login`) require authentication using JWT tokens.

### Register

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "sales_rep"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "sales_rep",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### Login

Authenticate and receive a JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "sales_rep"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User

Get the authenticated user's profile.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "sales_rep",
    "avatar": null,
    "teamId": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLogin": "2024-01-01T00:00:00Z"
  }
}
```

### Using the Token

Include the JWT token in the `Authorization` header for all authenticated requests:

```
Authorization: Bearer <your-jwt-token>
```

---

## CRM API

### Companies

#### List Companies

**Endpoint:** `GET /api/crm/companies`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `search` (string, optional)
- `status` (string, optional: prospect|active|inactive|churned)

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2
    }
  }
}
```

#### Create Company

**Endpoint:** `POST /api/crm/companies`

**Request Body:**
```json
{
  "name": "Acme Corp",
  "industry": "Technology",
  "size": "medium",
  "website": "https://acme.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102",
    "country": "USA"
  },
  "annualRevenue": 5000000,
  "employeeCount": 50,
  "status": "prospect"
}
```

#### Get Company

**Endpoint:** `GET /api/crm/companies/[id]`

#### Update Company

**Endpoint:** `PUT /api/crm/companies/[id]`

#### Delete Company

**Endpoint:** `DELETE /api/crm/companies/[id]`

### Contacts

#### List Contacts

**Endpoint:** `GET /api/crm/contacts`

**Query Parameters:**
- `page`, `limit`, `search`
- `companyId` (string, optional)
- `status` (string, optional: lead|qualified|customer|partner)

#### Create Contact

**Endpoint:** `POST /api/crm/contacts`

**Request Body:**
```json
{
  "companyId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@acme.com",
  "phone": "+1234567890",
  "jobTitle": "CEO",
  "department": "Executive",
  "isPrimary": true,
  "linkedInUrl": "https://linkedin.com/in/johndoe",
  "status": "lead"
}
```

#### Get/Update/Delete Contact

Same pattern as companies: `/api/crm/contacts/[id]`

### Deals

#### List Deals

**Endpoint:** `GET /api/crm/deals`

**Query Parameters:**
- `page`, `limit`
- `stage` (string, optional)
- `companyId` (string, optional)

#### Create Deal

**Endpoint:** `POST /api/crm/deals`

**Request Body:**
```json
{
  "companyId": "uuid",
  "contactId": "uuid",
  "title": "Q1 Enterprise Deal",
  "value": 50000,
  "currency": "USD",
  "stage": "prospecting",
  "probability": 25,
  "expectedCloseDate": "2024-03-31"
}
```

### Activities

#### List Activities

**Endpoint:** `GET /api/crm/activities`

**Query Parameters:**
- `page`, `limit`
- `type` (call|email|meeting|note|task)
- `companyId`, `dealId`, `status`

#### Create Activity

**Endpoint:** `POST /api/crm/activities`

**Request Body:**
```json
{
  "type": "call",
  "subject": "Initial discovery call",
  "description": "Discussed requirements and budget",
  "companyId": "uuid",
  "contactId": "uuid",
  "dealId": "uuid",
  "status": "completed",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "duration": 30
}
```

---

## Lead Generation API

### Domain Leads

#### List Domain Leads

**Endpoint:** `GET /api/leads/domains`

**Query Parameters:**
- `page`, `limit`, `search`
- `status` (new|enriched|qualified|contacted|converted|rejected)
- `minScore` (number, 0-100)

**Response:**
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "uuid",
        "domain": "example.com",
        "leadScore": 75,
        "status": "enriched",
        "whoisData": {...},
        "enrichmentData": {...},
        "scrapedDate": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

#### Create Domain Lead

**Endpoint:** `POST /api/leads/domains`

**Request Body:**
```json
{
  "domain": "newlead.com",
  "notes": "Found through manual research"
}
```

#### Enrich Domain Lead

**Endpoint:** `POST /api/leads/domains/[id]/enrich`

Automatically fetches WHOIS data, emails, and other enrichment information using configured APIs.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "domain": "example.com",
    "leadScore": 85,
    "whoisData": {
      "registrar": "GoDaddy",
      "registrationDate": "2020-01-01",
      "expirationDate": "2025-01-01"
    },
    "enrichmentData": {
      "emails": ["contact@example.com"],
      "source": "hunter"
    }
  }
}
```

---

## AI Website Builder API

### Website Projects

#### List Website Projects

**Endpoint:** `GET /api/websites/projects`

**Query Parameters:**
- `page`, `limit`
- `status` (questionnaire|wireframing|design|development|review|completed|delivered)

#### Create Website Project

**Endpoint:** `POST /api/websites/projects`

**Request Body:**
```json
{
  "projectName": "Acme Corp Website Redesign",
  "companyId": "uuid",
  "contactId": "uuid",
  "domain": "acme.com"
}
```

### Questions

#### Get Website Questions

**Endpoint:** `GET /api/websites/questions`

Returns all questionnaire questions grouped by category.

**Query Parameters:**
- `category` (business|branding|features|content|technical|design)

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [...],
    "grouped": {
      "business": [...],
      "branding": [...],
      "features": [...],
      "content": [...],
      "technical": [...],
      "design": [...]
    },
    "categories": ["business", "branding", "features", "content", "technical", "design"]
  }
}
```

### AI Generation

#### Generate Wireframe

**Endpoint:** `POST /api/websites/projects/[id]/generate-wireframe`

Uses Claude AI to generate a complete wireframe structure based on questionnaire responses.

**Response:**
```json
{
  "success": true,
  "data": {
    "wireframe": {
      "id": "uuid",
      "projectId": "uuid",
      "generatedBy": "claude"
    },
    "wireframeData": {
      "pages": [...],
      "navigation": {...}
    }
  },
  "message": "Wireframe generated successfully"
}
```

#### Generate Code

**Endpoint:** `POST /api/websites/projects/[id]/generate-code`

Uses Claude AI to generate complete, production-ready website code.

**Request Body:**
```json
{
  "framework": "react"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "generatedCode": {
      "id": "uuid",
      "framework": "react",
      "buildStatus": "success"
    },
    "files": [
      {
        "path": "src/App.jsx",
        "content": "import React from 'react'...",
        "language": "javascript"
      }
    ],
    "dependencies": [
      {
        "name": "react",
        "version": "^18.0.0",
        "type": "dependency"
      }
    ]
  },
  "message": "Website code generated successfully"
}
```

---

## Error Handling

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Role-Based Access Control

### User Roles

1. **super_admin** - Full access to everything
2. **admin** - Full CRM access, limited user management
3. **sales_manager** - Full CRM access for team, read-only users
4. **sales_rep** - Create/read/update own records
5. **account_manager** - Read/update companies and contacts
6. **viewer** - Read-only access

### Permission Matrix

| Resource | Super Admin | Admin | Sales Manager | Sales Rep | Account Manager | Viewer |
|----------|-------------|-------|---------------|-----------|-----------------|--------|
| Companies | CRUD | CRUD | CRU | CRU (own) | RU | R |
| Contacts | CRUD | CRUD | CRU | CRU (own) | RU | R |
| Deals | CRUD | CRUD | CRU | CRU (own) | RU | R |
| Activities | CRUD | CRUD | CRU | CRU | CRU | R |
| Users | CRUD | RU | R | R | R | - |
| Settings | CRUD | RU | R | R | R | - |
| Leads | CRUD | CRUD | RU | R | R | - |
| Websites | CRUD | CRUD | RU | R | R | - |

---

## Rate Limiting

API rate limits:
- **Authentication endpoints**: 10 requests per minute
- **Standard endpoints**: 100 requests per minute
- **AI generation endpoints**: 10 requests per hour

---

## Support

For API support, contact: support@orengen.io

Documentation last updated: January 11, 2026
