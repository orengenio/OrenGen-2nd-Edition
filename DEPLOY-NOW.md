# 🚀 DEPLOYMENT CHECKLIST - Execute Now

## ✅ Your Generated Secrets (SAVE THESE!)

```
ACCESS_TOKEN_SECRET=ihnh0FZkBNYv5ZtXU7NOEE0CgyD8wbu3FgxsHKxWpzA=
LOGIN_TOKEN_SECRET=TFeAreiCoCoEDJe0MICuF41n/+cIOOqvdoRLCsiPAak=
REFRESH_TOKEN_SECRET=PLzacYuLg6M1LSwH6rNBi7wD6hu2o2x5xQoK88PQ0EE=
FILE_TOKEN_SECRET=kWHmZE5mpT5SidgyM+6fndAqAE5vFZzk8I1K3Dz1kEg=
POSTGRES_PASSWORD=OnjjPD1RSZxse6+3TnXjK5WBff5ACwUv
```

---

## 🎯 STEP 1: Deploy Twenty CRM (10 minutes)

**In Coolify Dashboard:**

1. Click **"+ New Resource"** → **"Docker Compose"**

2. **Service Configuration:**
   - Name: `Twenty CRM`
   - Repository: `https://github.com/orengenio/OrenGen-2nd-Edition`
   - Branch: `main`
   - Base Directory: `crm`
   - Build Pack: Docker Compose

3. **Environment Variables** (click "Add" for each):
   ```
   POSTGRES_PASSWORD=OnjjPD1RSZxse6+3TnXjK5WBff5ACwUv
   SERVER_URL=https://crm.orengen.io
   FRONT_BASE_URL=https://crm.orengen.io
   ACCESS_TOKEN_SECRET=ihnh0FZkBNYv5ZtXU7NOEE0CgyD8wbu3FgxsHKxWpzA=
   LOGIN_TOKEN_SECRET=TFeAreiCoCoEDJe0MICuF41n/+cIOOqvdoRLCsiPAak=
   REFRESH_TOKEN_SECRET=PLzacYuLg6M1LSwH6rNBi7wD6hu2o2x5xQoK88PQ0EE=
   FILE_TOKEN_SECRET=kWHmZE5mpT5SidgyM+6fndAqAE5vFZzk8I1K3Dz1kEg=
   EMAIL_FROM_ADDRESS=noreply@orengen.io
   EMAIL_FROM_NAME=OrenGen CRM
   ```

4. **Domain Settings:**
   - Add Domain: `crm.orengen.io`
   - Enable SSL: ✅ Yes
   - Generate Certificate: ✅ Automatic

5. **Deploy!** → Click "Deploy"

6. **Wait 3-5 minutes** for build & startup

7. **Test:** Visit https://crm.orengen.io
   - You should see Twenty CRM login page
   - Create your admin account

---

## 🎯 STEP 2: Deploy Nexus Admin Platform (15 minutes)

**In Coolify Dashboard:**

1. Click **"+ New Resource"** → **"Dockerfile"**

2. **Service Configuration:**
   - Name: `Nexus Admin`
   - Repository: `https://github.com/orengenio/OrenGen-2nd-Edition`
   - Branch: `main`
   - Dockerfile Location: `nexus-deploy/Dockerfile`
   - Build Pack: Dockerfile

3. **Environment Variables** (for Nexus integrations):
   ```
   VITE_CRM_API_URL=https://crm.orengen.io/graphql
   VITE_N8N_WEBHOOK_URL=https://n8n.orengen.io/webhook
   ```

4. **Domain Settings:**
   - Add Domain: `nexus.orengen.io`
   - Enable SSL: ✅ Yes
   - Generate Certificate: ✅ Automatic

5. **Security: Add Authentication** (CRITICAL!)
   
   **Option A: Coolify Basic Auth** (Quick & Easy)
   - In service settings, enable "Basic Auth"
   - Username: `admin`
   - Password: `[create strong password]`
   
   **Option B: Cloudflare Zero Trust** (Recommended)
   - Go to Cloudflare dashboard
   - Add Zero Trust application
   - Protect nexus.orengen.io
   - Email-based authentication

6. **Deploy!** → Click "Deploy"

7. **Wait 5-10 minutes** for build (first build takes longer - npm install, build, etc)

8. **Test:** Visit https://nexus.orengen.io
   - Login with your credentials
   - You should see Nexus control center

---

## 🎯 STEP 3: Connect Everything (5 minutes)

### Link Nexus to CRM

1. **In Twenty CRM** (https://crm.orengen.io):
   - Go to Settings → API Keys
   - Create new API key
   - Name: "Nexus Integration"
   - Copy the key

2. **In Coolify** (Nexus service):
   - Add environment variable:
     ```
     VITE_CRM_API_KEY=[paste API key from CRM]
     ```
   - Redeploy Nexus

### Test Lead Capture Flow

1. **Visit marketing site**: https://orengen.io
2. **Fill demo bar** or contact form
3. **Check n8n**: Workflow should trigger
4. **Check CRM**: Contact should appear
5. **Check Nexus**: Should sync to control room

---

## ✅ Post-Deployment Checklist

- [ ] CRM accessible at https://crm.orengen.io
- [ ] CRM admin account created
- [ ] Nexus accessible at https://nexus.orengen.io
- [ ] Nexus protected with authentication
- [ ] API key created in CRM
- [ ] Nexus connected to CRM API
- [ ] Test lead submission from marketing site
- [ ] Verify contact appears in CRM
- [ ] Check Nexus control room syncs data

---

## 🐛 Troubleshooting

### CRM won't start
```bash
# Check logs in Coolify
# Look for database connection errors
# Verify all environment variables are set
# Check if PostgreSQL container is healthy
```

### Nexus build fails
```bash
# Check build logs in Coolify
# Common issue: npm install failures
# Solution: Redeploy or check nexus/package.json
```

### Can't access domains
- Wait 5-10 minutes for DNS propagation
- Verify DNS points to server IP: 15.204.243.95
- Check Coolify proxy (Traefik) is running
- Verify SSL certificates generated

### Authentication not working
- Check Coolify auth settings
- Verify Cloudflare Zero Trust rules
- Test incognito/private browser window

---

## 🎉 SUCCESS CRITERIA

**You're done when:**
1. ✅ CRM login page loads at crm.orengen.io
2. ✅ You can create contacts in CRM
3. ✅ Nexus control center loads at nexus.orengen.io
4. ✅ Marketing site form → n8n → CRM flow works
5. ✅ You can see all 3 layers working together

**Total deployment time: ~30 minutes**

**Next Phase:** Build white-label client portal (app.orengen.io)
