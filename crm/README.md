# Twenty CRM Deployment

Modern open-source CRM for OrenGen.io

## Quick Start

### 1. Generate Secrets
```bash
# Generate 4 random secrets for production
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update:
- `POSTGRES_PASSWORD` - Strong database password
- `SERVER_URL` - Your CRM domain (e.g., https://crm.orengen.io)
- `FRONT_BASE_URL` - Same as SERVER_URL
- All 4 `*_SECRET` variables with generated secrets

### 3. Deploy in Coolify

**Method A: Docker Compose (Recommended)**
1. In Coolify, create new "Docker Compose" service
2. Point to this repository
3. Set base directory to `/crm`
4. Add environment variables from `.env`
5. Deploy!

**Method B: Manual**
```bash
docker-compose up -d
```

### 4. Access CRM
- URL: https://crm.orengen.io (or your configured domain)
- First visit: Create admin account
- Login and configure workspace

## Features

✅ **Contacts & Companies** - Full contact management
✅ **Deals & Pipeline** - Sales pipeline tracking
✅ **Tasks & Notes** - Activity tracking
✅ **Custom Fields** - Fully customizable
✅ **API Access** - GraphQL + REST APIs
✅ **n8n Integration** - Built-in automation support
✅ **White Label Ready** - Full theming control

## Integration with n8n

Twenty has GraphQL API that n8n can consume:
- API Endpoint: `https://crm.orengen.io/graphql`
- Use HTTP Request node or GraphQL node
- Authentication: API Keys (generate in Settings)

Example n8n workflow:
1. Trigger: Webhook receives lead
2. Action: Create contact in Twenty via GraphQL
3. Action: Add to pipeline
4. Action: Trigger AI voice call

## White Labeling

### Custom Branding
1. Go to Settings → Workspace
2. Update:
   - Workspace name: "OrenGen CRM"
   - Logo: Upload your logo
   - Colors: Match your brand

### Advanced Customization
Twenty is open-source, you can:
- Fork the repo
- Modify UI components
- Add custom features
- Deploy your custom version

## Database Backup

```bash
# Backup
docker exec -t crm-postgres-1 pg_dump -U twenty twenty > backup.sql

# Restore
docker exec -i crm-postgres-1 psql -U twenty twenty < backup.sql
```

## Troubleshooting

**Issue**: CRM won't start
- Check logs: `docker-compose logs twenty`
- Verify database is healthy: `docker-compose ps`
- Ensure all secrets are set

**Issue**: Can't login
- Reset admin: Access database and reset password
- Check `ACCESS_TOKEN_SECRET` is consistent

**Issue**: Slow performance
- Increase database resources in Coolify
- Add Redis caching (already included)
- Check database indexes

## Resources

- [Twenty Documentation](https://twenty.com/developers)
- [GitHub Repository](https://github.com/twentyhq/twenty)
- [API Documentation](https://twenty.com/developers/graphql-api)
