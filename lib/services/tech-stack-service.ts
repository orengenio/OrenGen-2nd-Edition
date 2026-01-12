// Tech Stack Detection Service
// Uses Wappalyzer-style fingerprinting to detect technologies

import { TechStack } from '@/crm/types';

interface TechPattern {
  name: string;
  category: 'cms' | 'framework' | 'analytics' | 'marketing' | 'ecommerce' | 'hosting' | 'cdn' | 'feature';
  patterns: {
    headers?: Record<string, RegExp>;
    html?: RegExp[];
    scripts?: RegExp[];
    meta?: Record<string, RegExp>;
    cookies?: RegExp[];
  };
}

const TECH_PATTERNS: TechPattern[] = [
  // CMS
  {
    name: 'WordPress',
    category: 'cms',
    patterns: {
      html: [/wp-content/, /wp-includes/, /<meta name="generator" content="WordPress/i],
      scripts: [/wp-content\/plugins/, /wp-includes\/js/],
      headers: { 'x-powered-by': /wordpress/i },
    },
  },
  {
    name: 'Shopify',
    category: 'ecommerce',
    patterns: {
      html: [/cdn\.shopify\.com/, /Shopify\.theme/, /shopify-section/],
      scripts: [/cdn\.shopify\.com\/s\/files/],
      headers: { 'x-shopify-stage': /.+/ },
    },
  },
  {
    name: 'Wix',
    category: 'cms',
    patterns: {
      html: [/wix\.com/, /_wix_browser_sess/],
      scripts: [/static\.parastorage\.com/, /static\.wixstatic\.com/],
    },
  },
  {
    name: 'Squarespace',
    category: 'cms',
    patterns: {
      html: [/squarespace\.com/, /static1\.squarespace\.com/],
      scripts: [/static\.squarespace\.com/],
    },
  },
  {
    name: 'Webflow',
    category: 'cms',
    patterns: {
      html: [/webflow\.com/, /data-wf-page/, /data-wf-site/],
      scripts: [/assets\.website-files\.com/],
    },
  },
  {
    name: 'Drupal',
    category: 'cms',
    patterns: {
      html: [/Drupal/, /sites\/default\/files/],
      headers: { 'x-drupal-cache': /.+/, 'x-generator': /drupal/i },
    },
  },
  {
    name: 'Joomla',
    category: 'cms',
    patterns: {
      html: [/<meta name="generator" content="Joomla/i],
      scripts: [/\/media\/jui\/js/],
    },
  },
  {
    name: 'Ghost',
    category: 'cms',
    patterns: {
      html: [/<meta name="generator" content="Ghost/i],
      headers: { 'x-ghost-cache-status': /.+/ },
    },
  },

  // Frameworks
  {
    name: 'React',
    category: 'framework',
    patterns: {
      html: [/react-root/, /__NEXT_DATA__/, /data-reactroot/],
      scripts: [/react\.production\.min\.js/, /react-dom/],
    },
  },
  {
    name: 'Next.js',
    category: 'framework',
    patterns: {
      html: [/__NEXT_DATA__/, /_next\/static/],
      scripts: [/_next\/static\/chunks/],
      headers: { 'x-powered-by': /next\.js/i },
    },
  },
  {
    name: 'Vue.js',
    category: 'framework',
    patterns: {
      html: [/v-cloak/, /data-v-/, /__vue__/],
      scripts: [/vue\.runtime/, /vue\.min\.js/],
    },
  },
  {
    name: 'Nuxt.js',
    category: 'framework',
    patterns: {
      html: [/__NUXT__/, /_nuxt\//],
      scripts: [/_nuxt\/.*\.js/],
    },
  },
  {
    name: 'Angular',
    category: 'framework',
    patterns: {
      html: [/ng-version/, /ng-app/, /<app-root/],
      scripts: [/angular\.min\.js/, /main\.[a-f0-9]+\.js/],
    },
  },
  {
    name: 'Laravel',
    category: 'framework',
    patterns: {
      html: [/laravel_session/],
      cookies: [/laravel_session/, /XSRF-TOKEN/],
    },
  },
  {
    name: 'Ruby on Rails',
    category: 'framework',
    patterns: {
      html: [/csrf-token/, /action-cable/],
      headers: { 'x-powered-by': /phusion passenger/i, 'x-runtime': /\d+\.\d+/ },
    },
  },

  // Analytics
  {
    name: 'Google Analytics',
    category: 'analytics',
    patterns: {
      html: [/google-analytics\.com\/analytics\.js/, /gtag\/js\?id=/, /UA-\d+-\d+/],
      scripts: [/googletagmanager\.com/, /google-analytics\.com/],
    },
  },
  {
    name: 'Google Tag Manager',
    category: 'analytics',
    patterns: {
      html: [/googletagmanager\.com\/gtm\.js/, /GTM-[A-Z0-9]+/],
      scripts: [/googletagmanager\.com/],
    },
  },
  {
    name: 'Plausible',
    category: 'analytics',
    patterns: {
      scripts: [/plausible\.io\/js/],
    },
  },
  {
    name: 'Hotjar',
    category: 'analytics',
    patterns: {
      scripts: [/static\.hotjar\.com/, /hotjar\.com\/c\/hotjar/],
    },
  },
  {
    name: 'Mixpanel',
    category: 'analytics',
    patterns: {
      scripts: [/cdn\.mxpnl\.com/, /mixpanel\.com/],
    },
  },
  {
    name: 'Segment',
    category: 'analytics',
    patterns: {
      scripts: [/cdn\.segment\.com/],
    },
  },

  // Marketing
  {
    name: 'HubSpot',
    category: 'marketing',
    patterns: {
      scripts: [/js\.hs-scripts\.com/, /hs-analytics\.net/, /hubspot\.com/],
      html: [/hbspt\.forms/, /hubspot-messages/],
    },
  },
  {
    name: 'Mailchimp',
    category: 'marketing',
    patterns: {
      html: [/mailchimp\.com/, /mc\.us\d+\.list-manage\.com/],
      scripts: [/chimpstatic\.com/],
    },
  },
  {
    name: 'Intercom',
    category: 'marketing',
    patterns: {
      scripts: [/widget\.intercom\.io/, /intercom\.com/],
      html: [/intercom-container/],
    },
  },
  {
    name: 'Drift',
    category: 'marketing',
    patterns: {
      scripts: [/js\.driftt\.com/, /drift\.com/],
    },
  },
  {
    name: 'Crisp',
    category: 'marketing',
    patterns: {
      scripts: [/client\.crisp\.chat/],
    },
  },
  {
    name: 'Zendesk',
    category: 'marketing',
    patterns: {
      scripts: [/static\.zdassets\.com/, /zopim\.com/],
    },
  },

  // Ecommerce
  {
    name: 'WooCommerce',
    category: 'ecommerce',
    patterns: {
      html: [/woocommerce/, /wc-block/, /wc-cart-fragments/],
      scripts: [/woocommerce/],
    },
  },
  {
    name: 'Magento',
    category: 'ecommerce',
    patterns: {
      html: [/Magento/, /mage\/cookies/],
      scripts: [/mage\/requirejs/, /static\/version/],
      cookies: [/PHPSESSID/, /frontend/],
    },
  },
  {
    name: 'BigCommerce',
    category: 'ecommerce',
    patterns: {
      scripts: [/bigcommerce\.com/, /cdn\.bcapp\.dev/],
    },
  },
  {
    name: 'PrestaShop',
    category: 'ecommerce',
    patterns: {
      html: [/prestashop/i, /prestashop-page/],
      meta: { generator: /prestashop/i },
    },
  },

  // CDN
  {
    name: 'Cloudflare',
    category: 'cdn',
    patterns: {
      headers: { server: /cloudflare/i, 'cf-ray': /.+/ },
    },
  },
  {
    name: 'Fastly',
    category: 'cdn',
    patterns: {
      headers: { 'x-served-by': /cache-/, 'x-fastly-request-id': /.+/ },
    },
  },
  {
    name: 'AWS CloudFront',
    category: 'cdn',
    patterns: {
      headers: { 'x-amz-cf-id': /.+/, via: /cloudfront/i },
    },
  },
  {
    name: 'Akamai',
    category: 'cdn',
    patterns: {
      headers: { 'x-akamai-transformed': /.+/, server: /akamai/i },
    },
  },

  // Hosting
  {
    name: 'Vercel',
    category: 'hosting',
    patterns: {
      headers: { 'x-vercel-id': /.+/, server: /vercel/i },
    },
  },
  {
    name: 'Netlify',
    category: 'hosting',
    patterns: {
      headers: { 'x-nf-request-id': /.+/, server: /netlify/i },
    },
  },
  {
    name: 'Heroku',
    category: 'hosting',
    patterns: {
      headers: { via: /vegur/i },
    },
  },
  {
    name: 'AWS',
    category: 'hosting',
    patterns: {
      headers: { 'x-amzn-requestid': /.+/, server: /amazon/i },
    },
  },

  // Features
  {
    name: 'Contact Form',
    category: 'feature',
    patterns: {
      html: [/<form[^>]*(?:contact|inquiry|message|feedback)[^>]*>/i, /type="email"[^>]*required/i, /<textarea[^>]*(?:message|comments)[^>]*>/i],
    },
  },
  {
    name: 'Live Chat',
    category: 'feature',
    patterns: {
      html: [/chat-widget/, /live-chat/, /chat-container/],
      scripts: [/livechat/, /tawk\.to/, /crisp\.chat/, /intercom/, /drift/],
    },
  },
];

export class TechStackService {
  private timeout: number;

  constructor(timeout: number = 10000) {
    this.timeout = timeout;
  }

  async detectTechStack(domain: string): Promise<TechStack | null> {
    try {
      const url = domain.startsWith('http') ? domain : `https://${domain}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });

      return this.analyzePage(html, headers);
    } catch (error) {
      console.error(`Tech stack detection failed for ${domain}:`, error);
      return null;
    }
  }

  private analyzePage(html: string, headers: Record<string, string>): TechStack {
    const detectedTech: Set<string> = new Set();
    const categories: Record<string, string[]> = {
      cms: [],
      frameworks: [],
      analytics: [],
      marketing: [],
      ecommerce: [],
      hosting: [],
      cdn: [],
      features: [],
    };

    for (const tech of TECH_PATTERNS) {
      if (this.matchesPattern(tech, html, headers)) {
        detectedTech.add(tech.name);

        switch (tech.category) {
          case 'cms':
            if (!categories.cms.includes(tech.name)) {
              categories.cms.push(tech.name);
            }
            break;
          case 'framework':
            if (!categories.frameworks.includes(tech.name)) {
              categories.frameworks.push(tech.name);
            }
            break;
          case 'analytics':
            if (!categories.analytics.includes(tech.name)) {
              categories.analytics.push(tech.name);
            }
            break;
          case 'marketing':
            if (!categories.marketing.includes(tech.name)) {
              categories.marketing.push(tech.name);
            }
            break;
          case 'ecommerce':
            if (!categories.ecommerce.includes(tech.name)) {
              categories.ecommerce.push(tech.name);
            }
            break;
          case 'hosting':
            if (!categories.hosting.includes(tech.name)) {
              categories.hosting.push(tech.name);
            }
            break;
          case 'cdn':
            if (!categories.cdn.includes(tech.name)) {
              categories.cdn.push(tech.name);
            }
            break;
          case 'feature':
            if (!categories.features.includes(tech.name)) {
              categories.features.push(tech.name);
            }
            break;
        }
      }
    }

    return {
      cms: categories.cms[0] || categories.ecommerce[0],
      frameworks: categories.frameworks,
      analytics: categories.analytics,
      marketing: categories.marketing,
      ecommerce: categories.ecommerce[0],
      hosting: categories.hosting[0],
      cdn: categories.cdn[0],
      hasContactForm: categories.features.includes('Contact Form'),
      hasLiveChat: categories.features.includes('Live Chat'),
      detectedAt: new Date().toISOString(),
    };
  }

  private matchesPattern(tech: TechPattern, html: string, headers: Record<string, string>): boolean {
    const { patterns } = tech;

    // Check HTML patterns
    if (patterns.html) {
      for (const pattern of patterns.html) {
        if (pattern.test(html)) {
          return true;
        }
      }
    }

    // Check script patterns
    if (patterns.scripts) {
      for (const pattern of patterns.scripts) {
        if (pattern.test(html)) {
          return true;
        }
      }
    }

    // Check header patterns
    if (patterns.headers) {
      for (const [headerName, pattern] of Object.entries(patterns.headers)) {
        const headerValue = headers[headerName.toLowerCase()];
        if (headerValue && pattern.test(headerValue)) {
          return true;
        }
      }
    }

    // Check meta patterns
    if (patterns.meta) {
      for (const [metaName, pattern] of Object.entries(patterns.meta)) {
        const metaRegex = new RegExp(`<meta[^>]*name=["']${metaName}["'][^>]*content=["']([^"']+)["']`, 'i');
        const match = html.match(metaRegex);
        if (match && pattern.test(match[1])) {
          return true;
        }
      }
    }

    return false;
  }
}

export const techStackService = new TechStackService();
