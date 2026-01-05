# Deploy Nexus to Coolify (app.orengen.io)

## Prerequisites
- ✅ Nexus code in GitHub repo: `orengenio/OrenGen-2nd-Edition`
- ✅ Coolify running on your VPS
- ✅ DNS: Point `app.orengen.io` to `15.204.243.95`

## Step 1: DNS Configuration
1. Go to your DNS provider (Namecheap/Cloudflare/etc)
2. Add A record:
   ```
   Type: A
   Host: app
   Value: 15.204.243.95
   TTL: 300
   ```
3. Wait for propagation (1-5 minutes)

## Step 2: Add Application in Coolify

1. **Login to Coolify**: http://15.204.243.95:8000
2. **Create New Resource**:
   - Click `+ New` → `Application`
   - Select your server
   - Choose `Public Repository`

3. **Repository Settings**:
   ```
   Repository URL: https://github.com/orengenio/OrenGen-2nd-Edition
   Branch: main
   Base Directory: /nexus
   ```

4. **Build Settings**:
   - Build Pack: `Dockerfile`
   - Dockerfile Location: `Dockerfile` (it's in /nexus root)
   - Docker Compose File: `docker-compose.yaml`

## Step 3: Environment Variables

In Coolify, go to `Environment Variables` and add:

```bash
# AI API Keys (REQUIRED - get these from respective providers)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# App URLs
VITE_APP_URL=https://app.orengen.io
VITE_MARKETING_URL=https://orengen.io

# Auth (configure later when you add auth provider)
VITE_AUTH_DOMAIN=
VITE_AUTH_CLIENT_ID=
```

**How to get API keys:**
- **Gemini**: https://aistudio.google.com/app/apikey
- **Anthropic (Claude)**: https://console.anthropic.com/settings/keys
- **OpenRouter**: https://openrouter.ai/keys

## Step 4: Domain Configuration

1. In Coolify app settings, go to `Domains`
2. Click `+ Add Domain`
3. Enter: `app.orengen.io`
4. Enable SSL (Let's Encrypt automatic)

## Step 5: Deploy

1. Click `Deploy` button
2. Watch build logs
3. Wait for "Application is running" status

## Step 6: Verify Deployment

1. Visit: https://app.orengen.io
2. You should see the Nexus landing page
3. Test navigation through different studios

## Troubleshooting

### Build fails
- Check Coolify build logs
- Verify Dockerfile exists in `/nexus` directory
- Check node_modules isn't committed (should be in .gitignore)

### 502 Bad Gateway
- Check if container is running: Coolify → Logs
- Verify port 80 is exposed
- Check nginx is serving correctly

### Environment variables not working
- Vite requires `VITE_` prefix for client-side vars
- Rebuild after adding new env vars
- Check browser console for API key errors

### DNS not resolving
- Run: `dig app.orengen.io` to verify DNS
- Clear browser DNS cache
- Wait up to 1 hour for full propagation

## Post-Deployment Tasks

1. **Test AI Features**: Verify Gemini/Claude/OpenRouter integration
2. **Add Authentication**: Integrate Clerk/Auth0/Supabase
3. **Connect CRM**: Link to Twenty CRM backend at crm.orengen.io
4. **Monitor Logs**: Check Coolify logs for errors
5. **Performance**: Monitor resource usage

## Architecture After Deployment

```
orengen.io (marketing)          → Coolify → Static HTML
app.orengen.io (nexus)          → Coolify → Docker (Vite + React + Nginx)
crm.orengen.io (twenty crm)     → Coolify → Docker Compose
```

All three domains running on same VPS (15.204.243.95) managed by Coolify with Traefik reverse proxy.
