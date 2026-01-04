# OrenGen.io - AI Automation Platform

> **Complete AI-Powered Automation Platform**  
> Last Updated: January 4, 2026  
> Version: 3.0 - Production Infrastructure

---

## 🎯 PROJECT STATUS

### ✅ COMPLETED
- [x] Marketing website deployed (orengen.io)
- [x] Clean navbar with demo bar, theme toggle, translation
- [x] All images migrated from GoHighLevel to local storage
- [x] Custom nginx configuration for clean URLs
- [x] Docker containerization for marketing site
- [x] SSL/HTTPS via Coolify
- [x] Mobile responsive design
- [x] Payment methods branding updated
- [x] Badge text updated to "HUB Certified Minority Business"
- [x] Twenty CRM deployment files created
- [x] Complete system architecture documented
- [x] Memory optimization (16GB RAM upgrade in progress)
- [x] Database backup strategy defined
- [x] n8n workflow automation deployed

### ⏳ IN PROGRESS
- [ ] **SERVER UPGRADE** - Waiting for 16GB RAM configuration (2 hours)
- [ ] **CRM DEPLOYMENT** - Deploy Twenty CRM after server upgrade

### 📋 NEXT UP (This Week)
- [ ] Generate security secrets with `./setup.sh`
- [ ] Deploy Twenty CRM to Coolify (crm.orengen.io)
- [ ] Configure SSL for CRM domain
- [ ] White-label Twenty CRM branding
- [ ] Create admin account in CRM
- [ ] Build n8n workflows for lead capture
- [ ] Connect marketing form to n8n webhook
- [ ] Test end-to-end: Form → n8n → CRM

### 🚀 FUTURE PHASES
- [ ] Client dashboard (app.orengen.io) - Next.js/React
- [ ] Admin portal (admin.orengen.io)
- [ ] Custom API gateway for business logic
- [ ] Twilio integration for AI voice calls
- [ ] OpenAI integration for automation
- [ ] Stripe payment processing
- [ ] Multi-tenant white-label system
- [ ] Automated client onboarding
- [ ] Analytics dashboard

---

## 📁 Repository Structure

```
/workspaces/home/
├── marketing/              # ✅ LIVE - Marketing Site (orengen.io)
│   ├── index.html         # Homepage with navbar, demo bar, theme toggle
│   ├── services.html      # Services page
│   ├── pricing.html       # Pricing page
│   ├── case-studies.html  # Case studies
│   ├── about.html         # About page
│   ├── contact.html       # Contact page
│   ├── assets/
│   │   └── images/        # Local image storage (11MB, 9 images)
│   ├── nginx.conf         # Custom nginx config
│   └── Dockerfile         # Container image
│
├── crm/                   # ⏳ READY - Twenty CRM (crm.orengen.io)
│   ├── docker-compose.yml # CRM stack (PostgreSQL + Redis + Twenty)
│   ├── .env.example       # Configuration template
│   ├── README.md          # CRM setup guide
│   └── .gitignore         # Git ignore rules
│
├── ARCHITECTURE.md        # ✅ Complete system documentation
├── setup.sh              # ✅ Automated secret generation script
├── Dockerfile            # ✅ Marketing site Docker image
└── README.md             # This file

```

---

## 🖥️ Infrastructure

### Server Configuration
- **Provider**: VPS Elite
- **Specs**: 8 vCores, 16GB RAM, 160GB Storage
- **Cost**: $49.50/month
- **IP**: 15.204.243.95
- **Platform**: Coolify (self-hosted PaaS)

### Services & Domains
| Domain              | Service        | Status | SSL | Memory  |
|---------------------|----------------|--------|-----|---------|
| orengen.io          | Marketing      | ✅ Live | ✅  | 512MB   |
| crm.orengen.io      | Twenty CRM     | ⏳ Setup| ⏳  | 4.5GB   |
| n8n.orengen.io      | Workflows      | ✅ Live | ✅  | 2GB     |
| app.orengen.io      | Client Portal  | 📋 Plan | -   | TBD     |
| admin.orengen.io    | Admin Panel    | 📋 Plan | -   | TBD     |

**Total Allocated**: ~7GB  
**Available for Growth**: ~9GB

---

## 🚀 Quick Start

### Deploy CRM (After Server Upgrade)

1. **Generate Secrets**:
   ```bash
   ./setup.sh
   ```

2. **In Coolify Dashboard**:
   - Create new "Docker Compose" service
   - Repository: `orengenio/OrenGen-2nd-Edition`
   - Base directory: `crm`
   - Add environment variables from setup.sh output
   - Domain: `crm.orengen.io`
   - Enable SSL
   - Deploy!

3. **First Login**:
   - Visit https://crm.orengen.io
   - Create admin account
   - Configure workspace branding

### Local Development

```bash
# Marketing site
cd marketing
python3 -m http.server 8000
# Visit http://localhost:8000

# CRM (local testing)
cd crm
docker-compose up -d
# Visit http://localhost:3000
```

---

## 📁 Project Overview

This is the official OrenGen.io website built with vanilla HTML, CSS, and JavaScript. The design follows a Fortune 100 enterprise aesthetic with AI-powered features, multilingual support, and dark/light theme functionality.

### Live Demo
- **Local Server**: `http://localhost:8000`
- **Production**: `https://orengen.io`

### Tech Stack
- **HTML5** - Semantic markup with SEO optimization
- **CSS3** - Custom properties (CSS variables) for theming
- **JavaScript (Vanilla)** - No frameworks, lightweight and fast
- **UnicornStudio** - Motion parallax background
- **Google Translate API** - 25+ language support

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--orange: #C85A3D;           /* Primary brand color */
--orange-light: #E67E5F;     /* Hover states */
--orange-dark: #A34832;      /* Active states */
--blue: #1A4D7A;             /* Secondary brand color */

/* Dark Theme */
--bg-dark: #0d0d0d;          /* Main background */
--bg-sidebar: #111111;       /* Sidebar/cards background */
--bg-card: rgba(255, 255, 255, 0.03); /* Card backgrounds */
--bg-card-hover: rgba(255, 255, 255, 0.06); /* Card hover */
--border: rgba(255, 255, 255, 0.08); /* Borders */
--border-orange: rgba(204, 85, 0, 0.4); /* Orange borders */
--text: #ffffff;             /* Primary text */
--text-secondary: rgba(255, 255, 255, 0.6); /* Secondary text */
--text-muted: rgba(255, 255, 255, 0.4); /* Muted text */

/* Light Theme (auto-switches via data-theme="light") */
--bg-dark: #fafafa;
--bg-sidebar: #ffffff;
--bg-card: rgba(0, 0, 0, 0.03);
--text: #0d0d0d;
/* ... (see HTML for full light theme) */
```

### Typography

```css
/* Font Families */
font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; /* Body text */
font-family: 'Playfair Display', Georgia, serif; /* Hero headlines */
font-family: 'Outfit', sans-serif; /* Section headings, stats */

/* Font Sizes */
Hero H1: clamp(56px, 7vw, 84px)
Section H2: 32-42px
Card H3: 24px
Body Text: 14-16px
Small Text: 12-13px
```

### Spacing

```css
/* Section Padding */
padding: 60px 40px;  /* Standard sections */
padding: 80px 40px;  /* Hero/featured sections */

/* Card Padding */
padding: 24px;       /* Small cards */
padding: 32px;       /* Medium cards */

/* Gaps */
gap: 12px;           /* Tight spacing */
gap: 16px;           /* Standard spacing */
gap: 24px;           /* Loose spacing */
gap: 40px;           /* Section spacing */
```

---

## 🧩 Component Library

### 1. **Glowbutton CTA**

```html
<button class="glowbutton">Talk to Sales</button>
```

**CSS:**
```css
.glowbutton {
    --glow-color: rgb(176, 252, 255);
    --btn-color: rgb(61, 127, 136);
    border: 0.25em solid var(--glow-color);
    padding: 1em 3em;
    color: var(--glow-color);
    font-size: 15px;
    font-weight: bold;
    background-color: var(--btn-color);
    border-radius: 1em;
    box-shadow: 0 0 1em 0.25em var(--glow-color),
        0 0 4em 1em var(--glow-spread-color),
        inset 0 0 0.75em 0.25em var(--glow-color);
    cursor: pointer;
    transition: all 0.3s;
}
```

---

### 2. **Feature Card**

```html
<div class="feature-item">
    <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <!-- Icon SVG path -->
        </svg>
    </div>
    <div>
        <h4>Feature Title</h4>
        <p>Feature description text</p>
    </div>
</div>
```

**CSS Pattern:**
```css
.feature-item {
    display: flex;
    gap: 16px;
    padding: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.2s;
}

.feature-item:hover {
    border-color: var(--border-orange);
    background: var(--bg-card-hover);
}
```

---

### 3. **Solution Card (Hover Effect)**

```html
<div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; transition: all 0.3s; cursor: pointer;" 
     onmouseover="this.style.borderColor='var(--border-orange)'; this.style.transform='translateY(-4px)'" 
     onmouseout="this.style.borderColor='var(--border)'; this.style.transform='translateY(0)'">
    <svg viewBox="0 0 24 24" style="width: 48px; height: 48px; color: var(--orange); margin-bottom: 20px;">
        <!-- Icon -->
    </svg>
    <h3 style="font-size: 24px; margin-bottom: 12px;">Card Title</h3>
    <p style="color: var(--text-secondary); margin-bottom: 20px;">Description</p>
    <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="font-size: 14px; color: var(--text-muted);">• Feature 1</div>
        <div style="font-size: 14px; color: var(--text-muted);">• Feature 2</div>
    </div>
</div>
```

---

### 4. **Stats Display**

```html
<div class="stat-item">
    <div class="stat-value">1.2M<span>+</span></div>
    <div class="stat-label">Calls Handled</div>
    <div class="stat-growth" style="color: #4ade80; font-size: 12px; margin-top: 8px;">↑ 127% YoY</div>
</div>
```

**CSS:**
```css
.stat-value {
    font-family: 'Outfit', sans-serif;
    font-size: 48px;
    font-weight: 700;
    color: var(--orange);
    line-height: 1;
}

.stat-value span {
    color: var(--text);
}
```

---

### 5. **Testimonial Card**

```html
<div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px;">
    <div style="color: var(--orange); font-size: 32px; margin-bottom: 16px;">"</div>
    <p style="color: var(--text); font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
        "Quote text goes here..."
    </p>
    <div style="display: flex; align-items: center; gap: 16px; padding-top: 20px; border-top: 1px solid var(--border);">
        <img src="avatar.jpg" alt="Name" style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid var(--border);">
        <div>
            <div style="font-weight: 600; margin-bottom: 4px;">John Doe</div>
            <div style="color: var(--text-secondary); font-size: 14px;">CEO, Company Name</div>
        </div>
    </div>
</div>
```

---

### 6. **Agent Card (Gradient Border)**

```html
<div class="agent-card">
    <div class="agent-card-inner">
        <img src="agent-photo.jpg" alt="Agent Name">
        <div class="agent-info">
            <div class="agent-name">Sarah B.</div>
            <div class="agent-role">Outbound Sales</div>
        </div>
    </div>
</div>
```

**CSS:**
```css
.agent-card {
    width: 190px;
    height: 254px;
    background-image: linear-gradient(163deg, var(--orange) 0%, var(--blue) 100%);
    border-radius: 20px;
    padding: 3px;
    transition: all 0.3s;
}

.agent-card:hover {
    box-shadow: 0px 0px 30px 1px rgba(204, 85, 0, 0.30);
}
```

---

## 🔧 JavaScript Features

### Theme Toggle

```javascript
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
```

---

### Language Switcher with Typing Animation

```javascript
const translations = {
    en: { user: "Message", agent: "Response" },
    es: { user: "Mensaje", agent: "Respuesta" }
};

function typeText(element, text, speed = 30) {
    element.textContent = '';
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, speed);
}
```

---

## 📊 SEO Best Practices

### Meta Tags (Required for Every Page)

```html
<!-- Primary Meta Tags -->
<title>Page Title | OrenGen.io</title>
<meta name="description" content="Page description (150-160 characters)">
<meta name="keywords" content="keyword1, keyword2, keyword3">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://orengen.io/page-url">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="image-url.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://orengen.io/page-url">
<meta property="twitter:title" content="Page Title">
<meta property="twitter:description" content="Page description">
<meta property="twitter:image" content="image-url.jpg">

<!-- Canonical URL -->
<link rel="canonical" href="https://orengen.io/page-url">
```

---

### Structured Data (JSON-LD)

Every page should include appropriate schema markup:

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Name",
    "description": "Page description",
    "url": "https://orengen.io/page-url"
}
</script>
```

---

### Image Alt Tags

**Always include descriptive alt text:**

```html
<img src="logo.png" alt="OrenGen.io - AI Business Automation Platform">
<img src="agent-sarah.jpg" alt="Sarah B. - AI Outbound Sales Agent">
```

---

### Heading Hierarchy

```html
<h1>Page Title (Only ONE per page)</h1>
  <h2>Section Heading</h2>
    <h3>Subsection Heading</h3>
      <h4>Card/Item Heading</h4>
```

---

## 📄 Creating New Pages

### Step 1: Copy Template Structure

Start with this basic structure:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <!-- Copy all meta tags from homepage -->
    <!-- Update title, description, og:url, twitter:url, canonical -->
    <!-- Update structured data for page type -->
</head>
<body>
    <!-- Motion Background (optional) -->
    
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
        <!-- Copy from homepage -->
    </aside>
    
    <!-- Main Content -->
    <main class="main">
        <header class="topbar">
            <!-- Copy from homepage -->
        </header>
        
        <div class="content">
            <!-- Your page content here -->
        </div>
        
        <!-- Footer -->
        <footer class="footer">
            <!-- Copy from homepage -->
        </footer>
    </main>
    
    <!-- Scripts -->
    <!-- Copy theme toggle and language scripts -->
</body>
</html>
```

---

### Step 2: Page-Specific Content

**Example: Services Page**

```html
<div class="content">
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-badge">Services</div>
        <h1>
            AI-Powered Solutions
            <span class="line2">For Every Business Need</span>
        </h1>
        <p>Explore our comprehensive suite of AI automation services</p>
    </section>
    
    <!-- Services Grid -->
    <section style="padding: 60px 40px;">
        <div class="section-header">
            <h2>Our Services</h2>
            <p>Choose the perfect solution for your business</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            <!-- Service cards -->
        </div>
    </section>
</div>
```

---

### Step 3: Update Navigation

Add the new page to sidebar navigation:

```html
<a href="/services.html" class="nav-item">
    <svg viewBox="0 0 24 24"><!-- icon --></svg>
    Services
</a>
```

---

## 🚀 Performance Optimization

### Image Optimization
- Use WebP format when possible
- Compress images (use TinyPNG or similar)
- Lazy load images below the fold: `loading="lazy"`
- Use appropriate sizes with `srcset`

### CSS
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded async
- Minimize use of external stylesheets

### JavaScript
- Defer non-critical scripts: `<script defer>`
- Minimize third-party scripts
- Use event delegation for repeated elements

---

## 📱 Responsive Breakpoints

```css
/* Desktop First */
@media (max-width: 1200px) {
    /* Tablet landscape */
}

@media (max-width: 1024px) {
    /* Tablet portrait */
    .sidebar { transform: translateX(-100%); }
    .main { margin-left: 0; }
}

@media (max-width: 768px) {
    /* Mobile */
    .hero { padding: 60px 24px; }
}
```

---

## ♿ Accessibility Checklist

- [ ] All images have alt text
- [ ] Buttons have aria-labels where needed
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Semantic HTML (header, nav, main, footer, section)
- [ ] Links are descriptive (avoid "click here")

---

## 🧪 Testing Checklist

### Before Launch
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS, Android)
- [ ] Validate HTML (W3C Validator)
- [ ] Test all links and buttons
- [ ] Test forms (if applicable)
- [ ] Check page speed (Google PageSpeed Insights)
- [ ] Test SEO (Google Search Console)
- [ ] Check accessibility (WAVE, axe DevTools)

---

## 📦 File Structure

```
/workspaces/home/
├── orengen-homepage-v3.html    # Homepage (current)
├── README.md                    # This file
├── /pages/
│   ├── about.html               # About page
│   ├── services.html            # Services page
│   ├── pricing.html             # Pricing page
│   ├── contact.html             # Contact page
│   └── blog.html                # Blog listing
├── /assets/
│   ├── /images/                 # Local images
│   ├── /icons/                  # SVG icons
│   └── /fonts/                  # Custom fonts (if any)
└── /scripts/
    └── main.js                  # Shared JavaScript
```

---

## 🎯 Brand Guidelines

### Voice & Tone
- **Professional** yet approachable
- **Confident** but not arrogant
- **Technical** when needed, but accessible
- **Action-oriented** (use strong CTAs)

### Messaging
- Focus on **results and ROI**
- Emphasize **24/7 availability**
- Highlight **multilingual capabilities**
- Showcase **enterprise-grade security**

### CTAs (Call-to-Actions)
- "Talk to Sales" (primary)
- "Book A Call"
- "Get Started"
- "Learn More"
- "See How It Works"

---

## 🔗 External Integrations

### UnicornStudio (Parallax Background)
```html
<div data-us-project="krvLrHX3sj3cg8BHywDj"></div>
<script src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js"></script>
```

### Google Translate
```javascript
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,it,pt,zh-CN,zh-TW,ja,ko,ar,hi,ru,nl,sv,no,da,fi,pl,tr,vi,th,id,ms,tl'
    }, 'google_translate_element');
}
```

---

## 📞 Support & Resources

### Internal
- **Design System**: Reference homepage HTML/CSS
- **Component Library**: See "Component Library" section above
- **Brand Assets**: `/assets/` folder

### External
- **Google Fonts**: https://fonts.google.com
- **SVG Icons**: https://feathericons.com
- **Schema Markup**: https://schema.org
- **SEO Tools**: Google Search Console, PageSpeed Insights

---

## 🔄 Version Control

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-page-name

# Make changes and commit
git add .
git commit -m "Add new page: Page Name"

# Push to repository
git push origin feature/new-page-name

# Create pull request for review
```

---

## 📝 Quick Reference

### Common CSS Variables
```css
var(--orange)          /* Primary brand color */
var(--bg-card)         /* Card background */
var(--border)          /* Standard border */
var(--text-secondary)  /* Secondary text */
```

### Common Inline Styles
```html
style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;"
style="padding: 32px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px;"
style="color: var(--orange); font-size: 24px; font-weight: 700;"
```

---

## 🎓 Learning Resources

- **CSS Grid**: https://css-tricks.com/snippets/css/complete-guide-grid/
- **CSS Flexbox**: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- **Semantic HTML**: https://developer.mozilla.org/en-US/docs/Glossary/Semantics
- **SEO Basics**: https://developers.google.com/search/docs/beginner/seo-starter-guide

---

## ✅ Page Creation Checklist

When creating a new page, ensure you:

1. [ ] Copy base HTML structure from homepage
2. [ ] Update all meta tags (title, description, OG, Twitter)
3. [ ] Update canonical URL
4. [ ] Add appropriate structured data (JSON-LD)
5. [ ] Include sidebar navigation
6. [ ] Include footer
7. [ ] Add page-specific content
8. [ ] Test all interactive elements
9. [ ] Validate HTML
10. [ ] Test responsive design
11. [ ] Check accessibility
12. [ ] Optimize images
13. [ ] Test SEO with tools
14. [ ] Add to sitemap.xml

---

## 📧 Contact

For questions or support:
- **Email**: info@orengen.io
- **Website**: https://orengen.io
- **GitHub**: https://github.com/orengenio

---

**Built with ❤️ by OrenGen Worldwide**  
*Empowering businesses through AI automation since 2024*
