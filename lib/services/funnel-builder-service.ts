// Funnel Builder Service (GoHighLevel / ClickFunnels competitor)
// Visual funnel builder with AI optimization, A/B testing, analytics

export interface Funnel {
  id: string;
  name: string;
  type: FunnelType;
  domain: string;
  pages: FunnelPage[];
  settings: FunnelSettings;
  tracking: TrackingConfig;
  automations: FunnelAutomation[];
  analytics?: FunnelAnalytics;
  status: 'draft' | 'published' | 'paused';
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export type FunnelType = 'lead_magnet' | 'webinar' | 'sales' | 'product_launch' | 'tripwire' | 'membership' | 'application' | 'survey' | 'custom';

export interface FunnelPage {
  id: string;
  name: string;
  slug: string;
  type: PageType;
  order: number;
  sections: PageSection[];
  seo: SEOConfig;
  settings: PageSettings;
  variants?: PageVariant[];
  analytics?: PageAnalytics;
}

export type PageType = 'landing' | 'optin' | 'thank_you' | 'sales' | 'checkout' | 'upsell' | 'downsell' | 'confirmation' | 'webinar_registration' | 'webinar_replay' | 'application' | 'survey' | 'members';

export interface PageSection {
  id: string;
  type: SectionType;
  order: number;
  settings: SectionSettings;
  elements: PageElement[];
  style: StyleConfig;
  visibility: VisibilityRule[];
}

export type SectionType = 'hero' | 'features' | 'benefits' | 'testimonials' | 'pricing' | 'faq' | 'cta' | 'video' | 'form' | 'countdown' | 'social_proof' | 'comparison' | 'gallery' | 'custom';

export interface SectionSettings {
  padding: { top: number; bottom: number; left: number; right: number };
  background: BackgroundConfig;
  container_width: 'full' | 'wide' | 'medium' | 'narrow';
  animation?: AnimationConfig;
}

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image' | 'video';
  value: string;
  overlay?: { color: string; opacity: number };
}

export interface AnimationConfig {
  type: 'fade' | 'slide' | 'zoom' | 'bounce';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration: number;
  delay: number;
  trigger: 'load' | 'scroll';
}

export interface PageElement {
  id: string;
  type: ElementType;
  content: any;
  style: StyleConfig;
  responsive: ResponsiveConfig;
  interactions: ElementInteraction[];
}

export type ElementType = 'heading' | 'text' | 'button' | 'image' | 'video' | 'form' | 'countdown' | 'testimonial' | 'pricing_table' | 'faq_accordion' | 'icon' | 'divider' | 'spacer' | 'columns' | 'html' | 'checkout' | 'progress_bar' | 'popup' | 'exit_intent';

export interface StyleConfig {
  margin?: { top: number; bottom: number; left: number; right: number };
  padding?: { top: number; bottom: number; left: number; right: number };
  background?: BackgroundConfig;
  border?: { width: number; style: string; color: string; radius: number };
  shadow?: { x: number; y: number; blur: number; color: string };
  typography?: TypographyConfig;
  custom_css?: string;
}

export interface TypographyConfig {
  font_family: string;
  font_size: number;
  font_weight: string;
  line_height: number;
  letter_spacing: number;
  text_align: 'left' | 'center' | 'right' | 'justify';
  color: string;
}

export interface ResponsiveConfig {
  desktop: Partial<StyleConfig>;
  tablet: Partial<StyleConfig>;
  mobile: Partial<StyleConfig>;
}

export interface ElementInteraction {
  trigger: 'click' | 'hover' | 'scroll_into_view';
  action: 'open_popup' | 'scroll_to' | 'submit_form' | 'play_video' | 'track_event' | 'redirect';
  config: any;
}

export interface VisibilityRule {
  condition: 'device' | 'time' | 'referrer' | 'cookie' | 'query_param';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
  show: boolean;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  og_image: string;
  canonical_url?: string;
  no_index: boolean;
}

export interface PageSettings {
  favicon?: string;
  custom_head?: string;
  custom_body?: string;
  exit_intent_popup?: string;
  scroll_popup?: { element_id: string; scroll_percentage: number };
  timer_popup?: { element_id: string; delay_seconds: number };
}

export interface PageVariant {
  id: string;
  name: string;
  changes: { element_id: string; property: string; value: any }[];
  traffic_split: number;
  analytics?: PageAnalytics;
  is_winner?: boolean;
}

export interface PageAnalytics {
  views: number;
  unique_visitors: number;
  conversions: number;
  conversion_rate: number;
  avg_time_on_page: number;
  bounce_rate: number;
  scroll_depth: { '25%': number; '50%': number; '75%': number; '100%': number };
}

export interface FunnelSettings {
  global_styles: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    background_color: string;
    text_color: string;
    heading_font: string;
    body_font: string;
  };
  favicon: string;
  custom_domain?: string;
  ssl_enabled: boolean;
  cookie_consent: boolean;
  gdpr_compliant: boolean;
}

export interface TrackingConfig {
  google_analytics?: string;
  facebook_pixel?: string;
  google_tag_manager?: string;
  tiktok_pixel?: string;
  custom_scripts?: string[];
  conversion_api?: {
    facebook?: { access_token: string; pixel_id: string };
  };
}

export interface FunnelAutomation {
  id: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  conditions?: AutomationCondition[];
  enabled: boolean;
}

export interface AutomationTrigger {
  type: 'form_submit' | 'page_view' | 'purchase' | 'tag_added' | 'time_delay' | 'exit_intent';
  config: any;
}

export interface AutomationAction {
  type: 'send_email' | 'send_sms' | 'add_tag' | 'remove_tag' | 'add_to_list' | 'create_deal' | 'webhook' | 'slack_notify' | 'assign_to';
  config: any;
  delay?: { value: number; unit: 'minutes' | 'hours' | 'days' };
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
}

export interface FunnelAnalytics {
  total_visitors: number;
  total_leads: number;
  total_sales: number;
  total_revenue: number;
  conversion_rate: number;
  avg_order_value: number;
  page_performance: { page_id: string; views: number; conversions: number; drop_off_rate: number }[];
  traffic_sources: { source: string; visitors: number; conversions: number }[];
  device_breakdown: { device: string; visitors: number; percentage: number }[];
}

export interface FunnelTemplate {
  id: string;
  name: string;
  type: FunnelType;
  description: string;
  preview_url: string;
  pages: Omit<FunnelPage, 'id' | 'analytics'>[];
  category: string;
  tags: string[];
  conversions: number;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  type: 'one_time' | 'subscription' | 'payment_plan';
  subscription_interval?: 'weekly' | 'monthly' | 'yearly';
  trial_days?: number;
  payment_plan_installments?: number;
  image_url: string;
  delivery: ProductDelivery;
  upsells?: string[];
  downsells?: string[];
  order_bumps?: OrderBump[];
}

export interface ProductDelivery {
  type: 'digital' | 'physical' | 'service' | 'membership';
  access_url?: string;
  membership_level?: string;
  shipping_required: boolean;
}

export interface OrderBump {
  product_id: string;
  headline: string;
  description: string;
  display_price: number;
}

class FunnelBuilderService {
  private funnels: Map<string, Funnel> = new Map();
  private templates: Map<string, FunnelTemplate> = new Map();
  private products: Map<string, Product> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const templates: FunnelTemplate[] = [
      {
        id: 'tmpl_lead_magnet',
        name: 'Lead Magnet Funnel',
        type: 'lead_magnet',
        description: 'Capture leads with a free resource download',
        preview_url: '/templates/lead_magnet_funnel.png',
        category: 'lead_generation',
        tags: ['ebook', 'guide', 'checklist', 'free'],
        conversions: 15420,
        rating: 4.8,
        pages: [
          {
            name: 'Opt-in Page',
            slug: '',
            type: 'optin',
            order: 0,
            sections: this.createOptinSections(),
            seo: { title: 'Get Your Free Guide', description: 'Download your free guide now', keywords: [], og_image: '', no_index: false },
            settings: {}
          },
          {
            name: 'Thank You Page',
            slug: 'thank-you',
            type: 'thank_you',
            order: 1,
            sections: this.createThankYouSections(),
            seo: { title: 'Thank You', description: 'Your download is ready', keywords: [], og_image: '', no_index: true },
            settings: {}
          }
        ]
      },
      {
        id: 'tmpl_webinar',
        name: 'Webinar Registration Funnel',
        type: 'webinar',
        description: 'Register attendees for your webinar',
        preview_url: '/templates/webinar_funnel.png',
        category: 'webinar',
        tags: ['webinar', 'training', 'live', 'registration'],
        conversions: 8930,
        rating: 4.7,
        pages: [
          {
            name: 'Registration Page',
            slug: '',
            type: 'webinar_registration',
            order: 0,
            sections: this.createWebinarRegSections(),
            seo: { title: 'Free Webinar Registration', description: 'Register for our free training', keywords: [], og_image: '', no_index: false },
            settings: {}
          },
          {
            name: 'Confirmation Page',
            slug: 'confirmed',
            type: 'confirmation',
            order: 1,
            sections: [],
            seo: { title: 'You\'re Registered!', description: '', keywords: [], og_image: '', no_index: true },
            settings: {}
          },
          {
            name: 'Replay Page',
            slug: 'replay',
            type: 'webinar_replay',
            order: 2,
            sections: [],
            seo: { title: 'Webinar Replay', description: '', keywords: [], og_image: '', no_index: true },
            settings: {}
          }
        ]
      },
      {
        id: 'tmpl_tripwire',
        name: 'Tripwire Funnel',
        type: 'tripwire',
        description: 'Convert leads with a low-ticket offer',
        preview_url: '/templates/tripwire_funnel.png',
        category: 'sales',
        tags: ['tripwire', 'low-ticket', 'conversion', 'offer'],
        conversions: 12100,
        rating: 4.9,
        pages: [
          {
            name: 'Sales Page',
            slug: '',
            type: 'sales',
            order: 0,
            sections: this.createSalesPageSections(),
            seo: { title: 'Special Offer', description: 'Limited time offer', keywords: [], og_image: '', no_index: false },
            settings: {}
          },
          {
            name: 'Checkout',
            slug: 'checkout',
            type: 'checkout',
            order: 1,
            sections: [],
            seo: { title: 'Complete Your Order', description: '', keywords: [], og_image: '', no_index: true },
            settings: {}
          },
          {
            name: 'Upsell',
            slug: 'special',
            type: 'upsell',
            order: 2,
            sections: [],
            seo: { title: 'Wait! Special Offer', description: '', keywords: [], og_image: '', no_index: true },
            settings: {}
          },
          {
            name: 'Thank You',
            slug: 'thank-you',
            type: 'thank_you',
            order: 3,
            sections: [],
            seo: { title: 'Thank You For Your Purchase', description: '', keywords: [], og_image: '', no_index: true },
            settings: {}
          }
        ]
      },
      {
        id: 'tmpl_application',
        name: 'Application Funnel',
        type: 'application',
        description: 'Qualify leads with an application process',
        preview_url: '/templates/application_funnel.png',
        category: 'high_ticket',
        tags: ['application', 'qualify', 'high-ticket', 'coaching'],
        conversions: 5670,
        rating: 4.6,
        pages: [
          {
            name: 'Landing Page',
            slug: '',
            type: 'landing',
            order: 0,
            sections: [],
            seo: { title: 'Apply Now', description: 'Apply for our program', keywords: [], og_image: '', no_index: false },
            settings: {}
          },
          {
            name: 'Application Form',
            slug: 'apply',
            type: 'application',
            order: 1,
            sections: [],
            seo: { title: 'Application', description: '', keywords: [], og_image: '', no_index: true },
            settings: {}
          },
          {
            name: 'Schedule Call',
            slug: 'schedule',
            type: 'confirmation',
            order: 2,
            sections: [],
            seo: { title: 'Schedule Your Call', description: '', keywords: [], og_image: '', no_index: true },
            settings: {}
          }
        ]
      }
    ];

    templates.forEach(t => this.templates.set(t.id, t));
  }

  private createOptinSections(): PageSection[] {
    return [
      {
        id: 'hero_section',
        type: 'hero',
        order: 0,
        settings: {
          padding: { top: 80, bottom: 80, left: 20, right: 20 },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          container_width: 'medium'
        },
        elements: [
          {
            id: 'headline',
            type: 'heading',
            content: { text: 'Download Your Free Guide', level: 'h1' },
            style: { typography: { font_size: 48, font_weight: 'bold', color: '#ffffff', text_align: 'center', font_family: 'Inter', line_height: 1.2, letter_spacing: 0 } },
            responsive: { desktop: {}, tablet: { typography: { font_size: 36 } }, mobile: { typography: { font_size: 28 } } },
            interactions: []
          },
          {
            id: 'subheadline',
            type: 'text',
            content: { text: 'Learn the exact strategies that helped us 10x our growth in just 90 days.' },
            style: { typography: { font_size: 20, color: '#ffffff', text_align: 'center', font_family: 'Inter', font_weight: 'normal', line_height: 1.6, letter_spacing: 0 } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          },
          {
            id: 'optin_form',
            type: 'form',
            content: {
              fields: [
                { name: 'name', type: 'text', placeholder: 'Your Name', required: true },
                { name: 'email', type: 'email', placeholder: 'Your Email', required: true }
              ],
              button: { text: 'Get Instant Access', color: '#f97316' },
              redirect: '/thank-you'
            },
            style: { background: { type: 'color', value: '#ffffff' }, border: { radius: 12, width: 0, style: 'solid', color: '' } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          }
        ],
        style: {},
        visibility: []
      }
    ];
  }

  private createThankYouSections(): PageSection[] {
    return [
      {
        id: 'thank_you_section',
        type: 'hero',
        order: 0,
        settings: {
          padding: { top: 100, bottom: 100, left: 20, right: 20 },
          background: { type: 'color', value: '#0a0a0a' },
          container_width: 'narrow'
        },
        elements: [
          {
            id: 'check_icon',
            type: 'icon',
            content: { icon: 'check-circle', size: 80, color: '#22c55e' },
            style: {},
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          },
          {
            id: 'thank_you_headline',
            type: 'heading',
            content: { text: 'You\'re In!', level: 'h1' },
            style: { typography: { font_size: 48, font_weight: 'bold', color: '#ffffff', text_align: 'center', font_family: 'Inter', line_height: 1.2, letter_spacing: 0 } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          },
          {
            id: 'download_button',
            type: 'button',
            content: { text: 'Download Your Guide', url: '/download/guide.pdf' },
            style: { background: { type: 'color', value: '#f97316' }, typography: { font_size: 18, color: '#ffffff', text_align: 'center', font_family: 'Inter', font_weight: 'bold', line_height: 1, letter_spacing: 0 } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          }
        ],
        style: {},
        visibility: []
      }
    ];
  }

  private createWebinarRegSections(): PageSection[] {
    return [
      {
        id: 'webinar_hero',
        type: 'hero',
        order: 0,
        settings: {
          padding: { top: 60, bottom: 60, left: 20, right: 20 },
          background: { type: 'image', value: '/backgrounds/webinar.jpg', overlay: { color: '#000000', opacity: 0.7 } },
          container_width: 'wide'
        },
        elements: [
          {
            id: 'live_badge',
            type: 'text',
            content: { text: '🔴 LIVE TRAINING' },
            style: { typography: { font_size: 14, color: '#ff0000', text_align: 'center', font_family: 'Inter', font_weight: 'bold', line_height: 1, letter_spacing: 2 } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          },
          {
            id: 'webinar_title',
            type: 'heading',
            content: { text: 'How to [Achieve Result] in [Timeframe] Without [Pain Point]', level: 'h1' },
            style: { typography: { font_size: 42, font_weight: 'bold', color: '#ffffff', text_align: 'center', font_family: 'Inter', line_height: 1.2, letter_spacing: 0 } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          },
          {
            id: 'countdown',
            type: 'countdown',
            content: { target_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), labels: { days: 'Days', hours: 'Hours', minutes: 'Min', seconds: 'Sec' } },
            style: {},
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          },
          {
            id: 'reg_form',
            type: 'form',
            content: {
              fields: [
                { name: 'name', type: 'text', placeholder: 'Your Name', required: true },
                { name: 'email', type: 'email', placeholder: 'Your Best Email', required: true }
              ],
              button: { text: 'Reserve My Seat', color: '#22c55e' },
              redirect: '/confirmed'
            },
            style: {},
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          }
        ],
        style: {},
        visibility: []
      }
    ];
  }

  private createSalesPageSections(): PageSection[] {
    return [
      {
        id: 'sales_hero',
        type: 'hero',
        order: 0,
        settings: {
          padding: { top: 80, bottom: 40, left: 20, right: 20 },
          background: { type: 'color', value: '#0a0a0a' },
          container_width: 'medium'
        },
        elements: [
          {
            id: 'urgency_bar',
            type: 'text',
            content: { text: '⚡ LIMITED TIME OFFER - 70% OFF ⚡' },
            style: { background: { type: 'color', value: '#dc2626' }, typography: { font_size: 14, color: '#ffffff', text_align: 'center', font_family: 'Inter', font_weight: 'bold', line_height: 1, letter_spacing: 1 } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          },
          {
            id: 'sales_headline',
            type: 'heading',
            content: { text: 'Finally! A Proven System to [Achieve Result]', level: 'h1' },
            style: { typography: { font_size: 48, font_weight: 'bold', color: '#ffffff', text_align: 'center', font_family: 'Inter', line_height: 1.2, letter_spacing: 0 } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          },
          {
            id: 'vsl_video',
            type: 'video',
            content: { url: 'https://www.youtube.com/watch?v=example', autoplay: false, controls: true },
            style: { border: { radius: 12, width: 0, style: 'solid', color: '' } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          },
          {
            id: 'buy_button',
            type: 'button',
            content: { text: 'Yes! I Want This for Only $47', url: '/checkout' },
            style: { background: { type: 'color', value: '#22c55e' }, typography: { font_size: 20, color: '#ffffff', text_align: 'center', font_family: 'Inter', font_weight: 'bold', line_height: 1, letter_spacing: 0 } },
            responsive: { desktop: {}, tablet: {}, mobile: {} },
            interactions: []
          }
        ],
        style: {},
        visibility: []
      }
    ];
  }

  // Funnel CRUD
  async createFunnel(config: {
    name: string;
    type: FunnelType;
    template_id?: string;
    domain?: string;
  }): Promise<Funnel> {
    const template = config.template_id ? this.templates.get(config.template_id) : null;

    const funnel: Funnel = {
      id: `funnel_${Date.now()}`,
      name: config.name,
      type: config.type,
      domain: config.domain || `${config.name.toLowerCase().replace(/\s+/g, '-')}.orengen.io`,
      pages: template?.pages.map((p, i) => ({
        ...p,
        id: `page_${Date.now()}_${i}`
      })) || [],
      settings: {
        global_styles: {
          primary_color: '#f97316',
          secondary_color: '#3b82f6',
          accent_color: '#22c55e',
          background_color: '#0a0a0a',
          text_color: '#ffffff',
          heading_font: 'Inter',
          body_font: 'Inter'
        },
        favicon: '/favicon.ico',
        ssl_enabled: true,
        cookie_consent: true,
        gdpr_compliant: true
      },
      tracking: {},
      automations: [],
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date()
    };

    this.funnels.set(funnel.id, funnel);
    return funnel;
  }

  async updateFunnel(funnel_id: string, updates: Partial<Funnel>): Promise<Funnel> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    Object.assign(funnel, updates, { updated_at: new Date() });
    return funnel;
  }

  async publishFunnel(funnel_id: string): Promise<{ url: string }> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    funnel.status = 'published';
    funnel.published_at = new Date();
    funnel.updated_at = new Date();

    return { url: `https://${funnel.domain}` };
  }

  async unpublishFunnel(funnel_id: string): Promise<void> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    funnel.status = 'paused';
    funnel.updated_at = new Date();
  }

  // Page Management
  async addPage(funnel_id: string, config: {
    name: string;
    type: PageType;
    template_sections?: PageSection[];
  }): Promise<FunnelPage> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    const page: FunnelPage = {
      id: `page_${Date.now()}`,
      name: config.name,
      slug: config.name.toLowerCase().replace(/\s+/g, '-'),
      type: config.type,
      order: funnel.pages.length,
      sections: config.template_sections || [],
      seo: {
        title: config.name,
        description: '',
        keywords: [],
        og_image: '',
        no_index: false
      },
      settings: {}
    };

    funnel.pages.push(page);
    funnel.updated_at = new Date();

    return page;
  }

  async updatePage(funnel_id: string, page_id: string, updates: Partial<FunnelPage>): Promise<FunnelPage> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    const page = funnel.pages.find(p => p.id === page_id);
    if (!page) throw new Error('Page not found');

    Object.assign(page, updates);
    funnel.updated_at = new Date();

    return page;
  }

  async deletePage(funnel_id: string, page_id: string): Promise<void> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    funnel.pages = funnel.pages.filter(p => p.id !== page_id);
    funnel.updated_at = new Date();
  }

  // A/B Testing
  async createPageVariant(funnel_id: string, page_id: string, config: {
    name: string;
    changes: { element_id: string; property: string; value: any }[];
    traffic_split: number;
  }): Promise<PageVariant> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    const page = funnel.pages.find(p => p.id === page_id);
    if (!page) throw new Error('Page not found');

    const variant: PageVariant = {
      id: `variant_${Date.now()}`,
      name: config.name,
      changes: config.changes,
      traffic_split: config.traffic_split
    };

    page.variants = page.variants || [];
    page.variants.push(variant);

    return variant;
  }

  async endABTest(funnel_id: string, page_id: string, winner_id?: string): Promise<void> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    const page = funnel.pages.find(p => p.id === page_id);
    if (!page || !page.variants) throw new Error('Page or variants not found');

    if (winner_id) {
      const winner = page.variants.find(v => v.id === winner_id);
      if (winner) {
        winner.is_winner = true;
        // Apply winner changes to page
        winner.changes.forEach(change => {
          const element = page.sections
            .flatMap(s => s.elements)
            .find(e => e.id === change.element_id);
          if (element) {
            (element as any)[change.property] = change.value;
          }
        });
      }
    }

    page.variants = [];
  }

  // Product Management
  async createProduct(config: Omit<Product, 'id'>): Promise<Product> {
    const product: Product = {
      id: `prod_${Date.now()}`,
      ...config
    };

    this.products.set(product.id, product);
    return product;
  }

  // Automation
  async addAutomation(funnel_id: string, config: Omit<FunnelAutomation, 'id'>): Promise<FunnelAutomation> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    const automation: FunnelAutomation = {
      id: `auto_${Date.now()}`,
      ...config
    };

    funnel.automations.push(automation);
    return automation;
  }

  // Analytics
  async getFunnelAnalytics(funnel_id: string): Promise<FunnelAnalytics> {
    const funnel = this.funnels.get(funnel_id);
    if (!funnel) throw new Error('Funnel not found');

    // Generate mock analytics
    const pagePerformance = funnel.pages.map((page, index) => ({
      page_id: page.id,
      views: Math.floor(10000 / (index + 1)),
      conversions: Math.floor(10000 / (index + 1) * 0.3),
      drop_off_rate: index * 15
    }));

    return {
      total_visitors: 10000,
      total_leads: 3500,
      total_sales: 420,
      total_revenue: 19740,
      conversion_rate: 4.2,
      avg_order_value: 47,
      page_performance: pagePerformance,
      traffic_sources: [
        { source: 'Facebook Ads', visitors: 4500, conversions: 180 },
        { source: 'Google Ads', visitors: 2800, conversions: 140 },
        { source: 'Organic', visitors: 1500, conversions: 60 },
        { source: 'Direct', visitors: 1200, conversions: 40 }
      ],
      device_breakdown: [
        { device: 'Mobile', visitors: 6500, percentage: 65 },
        { device: 'Desktop', visitors: 3000, percentage: 30 },
        { device: 'Tablet', visitors: 500, percentage: 5 }
      ]
    };
  }

  // AI Generation
  async generateFunnelWithAI(config: {
    business_type: string;
    target_audience: string;
    offer: string;
    goal: 'leads' | 'sales' | 'webinar_registrations' | 'applications';
    tone: 'professional' | 'casual' | 'urgent' | 'friendly';
  }): Promise<Funnel> {
    // AI would generate optimized funnel based on inputs
    const funnelType: FunnelType = config.goal === 'leads' ? 'lead_magnet' :
      config.goal === 'webinar_registrations' ? 'webinar' :
      config.goal === 'applications' ? 'application' : 'tripwire';

    const templateId = `tmpl_${funnelType === 'lead_magnet' ? 'lead_magnet' : funnelType}`;

    return this.createFunnel({
      name: `${config.offer} Funnel`,
      type: funnelType,
      template_id: templateId
    });
  }

  // Getters
  async getFunnels(): Promise<Funnel[]> {
    return Array.from(this.funnels.values());
  }

  async getFunnel(id: string): Promise<Funnel | undefined> {
    return this.funnels.get(id);
  }

  async getTemplates(type?: FunnelType): Promise<FunnelTemplate[]> {
    let templates = Array.from(this.templates.values());
    if (type) templates = templates.filter(t => t.type === type);
    return templates;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }
}

export const funnelBuilderService = new FunnelBuilderService();
