# WordPress Integration Guide for OrenGen.io Website

## 📋 Quick Start Checklist

- [ ] Upload CSS to WordPress
- [ ] Upload JavaScript to WordPress  
- [ ] Add Google Fonts
- [ ] Add Google Translate script
- [ ] Create pages and add HTML content
- [ ] Test all pages

---

## 🎨 Step 1: Add CSS Stylesheet

### Option A: Using Customizer (Easiest)
1. Go to **WordPress Dashboard → Appearance → Customize**
2. Click **Additional CSS**
3. Copy the entire contents of `wordpress/style.css`
4. Paste into the Additional CSS box
5. Click **Publish**

### Option B: Using Child Theme (Recommended for Production)
1. Create a child theme folder: `wp-content/themes/orengen-child/`
2. Upload `style.css` to the child theme folder
3. Create `functions.php` in child theme:
```php
<?php
function orengen_enqueue_styles() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('orengen-style', get_stylesheet_directory_uri() . '/style.css', array('parent-style'));
}
add_action('wp_enqueue_scripts', 'orengen_enqueue_styles');
?>
```

---

## ⚡ Step 2: Add JavaScript

### Option A: Using Plugin (Easiest)
1. Install plugin: **Insert Headers and Footers** or **Code Snippets**
2. Go to **Settings → Insert Headers and Footers**
3. In the **Footer** section, add:
```html
<script src="<?php echo get_stylesheet_directory_uri(); ?>/scripts.js"></script>
```

### Option B: Using functions.php
Add to your theme's `functions.php`:
```php
function orengen_enqueue_scripts() {
    wp_enqueue_script('orengen-scripts', get_stylesheet_directory_uri() . '/scripts.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'orengen_enqueue_scripts');
```

---

## 🔤 Step 3: Add Google Fonts

Add to **Appearance → Customize → Additional CSS** (at the top):
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&family=Outfit:wght@300;400;600&display=swap');
```

OR add to your theme's header via **Insert Headers and Footers** plugin:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
```

---

## 🌐 Step 4: Add Google Translate

Using **Insert Headers and Footers** plugin, add to **Footer**:
```html
<script type="text/javascript">
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,it,pt,ru,zh-CN,ja,ko,ar,hi,bn,pa,te,mr,ta,ur,gu,kn,ml,th,vi,id,ms,fil',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');
    }
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

---

## 📄 Step 5: Create WordPress Pages

### For Each Page:

1. **Go to Pages → Add New**
2. **Enter page title** (e.g., "Home", "About Us", "Services", etc.)
3. **Switch to Code Editor** (Three dots → Code editor) or use Gutenberg's HTML block
4. **Paste the HTML content** from the corresponding section below

### Page URLs to Create:
- Home (set as homepage in Settings → Reading)
- About Us
- Services  
- Pricing
- Contact
- Case Studies
- Privacy Policy
- Terms of Service

---

## 🏠 Homepage HTML

For the homepage, use the content from `orengen-homepage-v3.html`:

**What to copy:**
- Everything INSIDE the `<body>` tags
- Start from `<!-- Sidebar Controls -->` 
- End at the closing `</footer>` tag
- Do NOT include `<html>`, `<head>`, or `<body>` tags

**WordPress Gutenberg:**
1. Create new page called "Home"
2. Add **Custom HTML** block
3. Paste the body content
4. Publish
5. Go to **Settings → Reading → Homepage** and select "Home"

---

## 👥 About Us Page HTML

Copy content from `about.html` - same process:
1. Copy everything between `<body>` and `</body>`
2. Create page "About Us"
3. Add Custom HTML block
4. Paste content
5. Publish

**Direct link structure:**
- Your permalink: `yoursite.com/about-us`
- Update navigation links accordingly

---

## 🛠️ Services Page HTML

Copy from `services.html`:
1. All content between body tags
2. Create page "Services"
3. Custom HTML block
4. Publish

---

## 💰 Pricing Page HTML

Copy from `pricing.html`:
1. Body content only
2. Create page "Pricing"  
3. Custom HTML block
4. Publish

---

## 📞 Contact Page HTML

Copy from `contact.html`:
1. Body content
2. Create page "Contact"
3. Custom HTML block

**⚠️ IMPORTANT - Contact Form Setup:**
The contact form uses Formspree. Update this line in the HTML:
```html
<form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**To get YOUR_FORM_ID:**
1. Go to https://formspree.io
2. Sign up (free)
3. Create new form
4. Copy your form ID (e.g., `mbjqepdq`)
5. Replace `YOUR_FORM_ID` in the contact form

**Alternative:** Use Contact Form 7 or WPForms plugin instead.

---

## 📊 Case Studies Page HTML

Copy from `case-studies.html`:
1. Body content
2. Create page "Case Studies"
3. Custom HTML block
4. Publish

---

## 🔒 Privacy Policy & Terms

Copy from `privacy.html` and `terms.html`:
1. Create pages "Privacy Policy" and "Terms of Service"
2. Add Custom HTML blocks
3. Paste respective content

**TIP:** WordPress has built-in Privacy Policy page setting.
Go to **Settings → Privacy** and select your Privacy Policy page.

---

## 🧭 Step 6: Create Navigation Menu

1. Go to **Appearance → Menus**
2. Create new menu called "Main Menu"
3. Add your pages:
   - Home
   - About Us
   - Services
   - Pricing
   - Contact
4. Save menu
5. Assign to **Primary Menu** location (depends on your theme)

---

## 🎨 Step 7: Customize Navigation (Optional)

If you want to use the custom topbar navigation from the HTML:

**Option A:** Hide theme header and use custom HTML topbar
```css
/* Add to Additional CSS */
#masthead, .site-header {
    display: none !important;
}
```

**Option B:** Integrate with theme menu
- Most themes allow custom HTML in navigation
- Or use a menu plugin like **Max Mega Menu**

---

## 🔧 Step 8: WordPress-Specific Adjustments

### Fix Theme Conflicts
Some WordPress themes add extra padding/margins. Add to Additional CSS:
```css
/* Remove theme default spacing */
.entry-content {
    padding: 0 !important;
    margin: 0 !important;
}

/* Ensure full width */
.container {
    max-width: 1400px;
}

/* Remove theme max-width restrictions */
article, main {
    max-width: 100% !important;
}
```

### Remove WordPress Admin Bar Offset
```css
html {
    margin-top: 0 !important;
}
```

---

## 🎯 Step 9: Replace Placeholder Links

### Update Navigation Links
Search and replace in each page's HTML:

**From:**
```html
<a href="index.html">Home</a>
<a href="about.html">About</a>
<a href="services.html">Services</a>
```

**To:**
```html
<a href="/">Home</a>
<a href="/about-us">About</a>
<a href="/services">Services</a>
```

**OR** use WordPress menu system (recommended).

### Update Form Action
Contact form:
```html
action="https://formspree.io/f/YOUR_FORM_ID"
```

---

## 📱 Step 10: Test Everything

### Checklist:
- [ ] All pages load correctly
- [ ] Theme toggle works (light/dark)
- [ ] Google Translate appears when clicking globe icon
- [ ] Navigation links work
- [ ] Contact form submits
- [ ] Pricing toggle works (monthly/annual)
- [ ] Language demo types correctly on homepage
- [ ] All images load (logo, icons, etc.)
- [ ] Mobile responsive (test on phone)
- [ ] SEO titles and descriptions (use Yoast SEO plugin)

---

## 🚀 Performance Optimization

### 1. Install Performance Plugins
- **WP Rocket** or **W3 Total Cache** - Caching
- **Smush** - Image optimization
- **Autoptimize** - Minify CSS/JS

### 2. Enable Lazy Loading
Most themes have this built-in, or use plugin: **Lazy Load by WP Rocket**

### 3. Use CDN
- Cloudflare (free tier available)
- Or use plugin: **Jetpack** (includes CDN)

---

## 🔍 SEO Setup

### Install Yoast SEO or Rank Math
1. Go to **Plugins → Add New**
2. Search "Yoast SEO"
3. Install and activate

### For Each Page:
1. Edit page
2. Scroll to Yoast SEO section
3. Set:
   - **Focus Keyword** (e.g., "AI Solutions" for homepage)
   - **SEO Title** (use titles from HTML meta tags)
   - **Meta Description** (use descriptions from HTML)
   - **Social Preview** (upload og-image)

---

## 🎨 Alternative: Page Builder Approach

### Using Elementor (Popular Page Builder)

1. **Install Elementor:**
   - Plugins → Add New → Search "Elementor"
   - Install Elementor Page Builder

2. **For Each Page:**
   - Edit with Elementor
   - Add **HTML Widget**
   - Paste section HTML into widget
   - Repeat for each section

3. **Benefits:**
   - Visual editing
   - Easier to update
   - Mobile responsive controls

---

## 🐛 Troubleshooting

### CSS Not Loading
- Clear WordPress cache
- Check if CSS is in Additional CSS or theme file
- Try adding `!important` to styles

### JavaScript Not Working
- Check browser console for errors (F12)
- Ensure script is loaded in footer
- Check jQuery conflicts (WordPress loads jQuery in compatibility mode)

### Theme Conflicts
- Try Twenty Twenty-Four theme (default WordPress theme)
- Or use blank theme: **GeneratePress** or **Astra**

### Contact Form Not Sending
- Verify Formspree ID is correct
- Check spam folder
- Try Contact Form 7 plugin instead

---

## 📚 Additional Resources

### Recommended Plugins
- **Insert Headers and Footers** - Add scripts easily
- **Custom CSS & JavaScript** - Alternative to Customizer
- **WPCode** - Code snippets management
- **Contact Form 7** - Alternative contact form
- **Really Simple SSL** - Enable HTTPS
- **UpdraftPlus** - Backups

### WordPress-Friendly Themes
These work well with custom HTML:
- **GeneratePress** (free, lightweight)
- **Astra** (free, highly customizable)
- **Kadence** (free, modern)
- **OceanWP** (free, flexible)

---

## ✅ Final Checklist

Before going live:
- [ ] All 8 pages created and published
- [ ] CSS added (Additional CSS or theme file)
- [ ] JavaScript added (footer)
- [ ] Google Fonts loaded
- [ ] Google Translate working
- [ ] Navigation menu created
- [ ] Contact form connected (Formspree or CF7)
- [ ] All links updated from .html to WordPress URLs
- [ ] Logo uploaded (Media Library)
- [ ] Favicon set (Customizer → Site Identity)
- [ ] Homepage set (Settings → Reading)
- [ ] Privacy Policy page assigned (Settings → Privacy)
- [ ] SSL enabled (HTTPS)
- [ ] Mobile tested
- [ ] SEO plugin installed and configured
- [ ] Performance plugin installed
- [ ] Backup created

---

## 🆘 Need Help?

If you encounter issues:

1. **Check browser console** (F12 → Console tab)
2. **Test in different browser** (Chrome, Firefox)
3. **Disable plugins temporarily** to find conflicts
4. **Switch to default theme** to isolate issue
5. **Check WordPress debug mode** (wp-config.php)

---

## 📧 Support Resources

- WordPress Codex: https://codex.wordpress.org/
- WordPress Forums: https://wordpress.org/support/
- Formspree Docs: https://help.formspree.io/

---

**🎉 You're all set! Your OrenGen.io website is now WordPress-ready!**

Remember: Always keep a backup before making changes to your live site.
