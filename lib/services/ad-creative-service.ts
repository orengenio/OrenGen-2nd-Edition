// Ad Creative Studio Service (Zeely.ai / Fluency competitor)
// AI-powered ad creation, A/B testing, multi-platform optimization

export interface AdCreative {
  id: string;
  name: string;
  type: 'image' | 'video' | 'carousel' | 'story' | 'text';
  platform: AdPlatform;
  format: AdFormat;
  content: AdContent;
  variants: AdVariant[];
  performance?: AdPerformance;
  status: 'draft' | 'generating' | 'ready' | 'active' | 'paused';
  campaign_id?: string;
  created_at: Date;
  updated_at: Date;
}

export type AdPlatform = 'facebook' | 'instagram' | 'google' | 'tiktok' | 'linkedin' | 'twitter' | 'youtube';

export interface AdFormat {
  width: number;
  height: number;
  aspect_ratio: string;
  name: string;
  platform_specific: string;
}

export interface AdContent {
  headline: string;
  primary_text: string;
  description?: string;
  cta: string;
  cta_url: string;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url?: string;
  brand_logo?: string;
  brand_colors: string[];
}

export interface AdVariant {
  id: string;
  name: string;
  changes: {
    field: string;
    value: string;
  }[];
  preview_url: string;
  performance?: AdPerformance;
  is_winner: boolean;
}

export interface AdPerformance {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversion_rate: number;
  spend: number;
  cpc: number;
  cpm: number;
  roas: number;
  engagement_rate: number;
}

export interface AdCampaign {
  id: string;
  name: string;
  objective: CampaignObjective;
  platforms: AdPlatform[];
  budget: BudgetConfig;
  targeting: TargetingConfig;
  creatives: string[];
  schedule: ScheduleConfig;
  status: 'draft' | 'active' | 'paused' | 'completed';
  performance?: CampaignPerformance;
  created_at: Date;
}

export type CampaignObjective = 'awareness' | 'traffic' | 'engagement' | 'leads' | 'sales' | 'app_installs';

export interface BudgetConfig {
  type: 'daily' | 'lifetime';
  amount: number;
  currency: string;
  bid_strategy: 'lowest_cost' | 'target_cost' | 'manual';
  bid_amount?: number;
}

export interface TargetingConfig {
  locations: string[];
  age_min: number;
  age_max: number;
  genders: ('male' | 'female' | 'all')[];
  interests: string[];
  behaviors: string[];
  custom_audiences: string[];
  lookalike_audiences: string[];
  exclusions: string[];
  placements: string[];
}

export interface ScheduleConfig {
  start_date: Date;
  end_date?: Date;
  dayparting?: {
    day: string;
    hours: number[];
  }[];
}

export interface CampaignPerformance {
  total_spend: number;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  avg_ctr: number;
  avg_cpc: number;
  avg_cpm: number;
  roas: number;
  best_performing_creative: string;
  best_performing_audience: string;
}

export interface AdTemplate {
  id: string;
  name: string;
  category: 'product' | 'service' | 'event' | 'sale' | 'testimonial' | 'ugc' | 'comparison';
  platforms: AdPlatform[];
  formats: AdFormat[];
  preview_url: string;
  elements: TemplateElement[];
  copy_templates: CopyTemplate[];
}

export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'logo' | 'cta' | 'background' | 'shape';
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: Record<string, string>;
  editable: boolean;
  placeholder?: string;
}

export interface CopyTemplate {
  id: string;
  type: 'headline' | 'primary_text' | 'description' | 'cta';
  templates: string[];
  variables: string[];
}

export interface BrandKit {
  id: string;
  name: string;
  logo_url: string;
  logo_dark_url?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  tone: 'professional' | 'casual' | 'playful' | 'luxury' | 'bold';
  guidelines: string;
}

export interface GenerationRequest {
  product_name: string;
  product_description: string;
  target_audience: string;
  key_benefits: string[];
  platforms: AdPlatform[];
  formats: string[];
  brand_kit_id?: string;
  tone?: string;
  style_references?: string[];
  num_variants: number;
}

// Standard ad formats by platform
export const AD_FORMATS: Record<AdPlatform, AdFormat[]> = {
  facebook: [
    { width: 1200, height: 628, aspect_ratio: '1.91:1', name: 'Feed', platform_specific: 'feed' },
    { width: 1080, height: 1080, aspect_ratio: '1:1', name: 'Square', platform_specific: 'feed_square' },
    { width: 1080, height: 1920, aspect_ratio: '9:16', name: 'Story', platform_specific: 'story' }
  ],
  instagram: [
    { width: 1080, height: 1080, aspect_ratio: '1:1', name: 'Feed Square', platform_specific: 'feed' },
    { width: 1080, height: 1350, aspect_ratio: '4:5', name: 'Feed Portrait', platform_specific: 'feed_portrait' },
    { width: 1080, height: 1920, aspect_ratio: '9:16', name: 'Story/Reel', platform_specific: 'story' }
  ],
  google: [
    { width: 300, height: 250, aspect_ratio: '6:5', name: 'Medium Rectangle', platform_specific: 'display' },
    { width: 728, height: 90, aspect_ratio: '8:1', name: 'Leaderboard', platform_specific: 'display' },
    { width: 336, height: 280, aspect_ratio: '6:5', name: 'Large Rectangle', platform_specific: 'display' },
    { width: 1200, height: 628, aspect_ratio: '1.91:1', name: 'Responsive', platform_specific: 'responsive' }
  ],
  tiktok: [
    { width: 1080, height: 1920, aspect_ratio: '9:16', name: 'In-Feed', platform_specific: 'in_feed' }
  ],
  linkedin: [
    { width: 1200, height: 628, aspect_ratio: '1.91:1', name: 'Sponsored Content', platform_specific: 'sponsored' },
    { width: 1080, height: 1080, aspect_ratio: '1:1', name: 'Square', platform_specific: 'square' }
  ],
  twitter: [
    { width: 1200, height: 675, aspect_ratio: '16:9', name: 'Image', platform_specific: 'image' },
    { width: 1080, height: 1080, aspect_ratio: '1:1', name: 'Square', platform_specific: 'square' }
  ],
  youtube: [
    { width: 1920, height: 1080, aspect_ratio: '16:9', name: 'Video', platform_specific: 'video' },
    { width: 300, height: 250, aspect_ratio: '6:5', name: 'Display', platform_specific: 'display' }
  ]
};

class AdCreativeService {
  private creatives: Map<string, AdCreative> = new Map();
  private campaigns: Map<string, AdCampaign> = new Map();
  private templates: Map<string, AdTemplate> = new Map();
  private brandKits: Map<string, BrandKit> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const templates: AdTemplate[] = [
      {
        id: 'tmpl_product_showcase',
        name: 'Product Showcase',
        category: 'product',
        platforms: ['facebook', 'instagram', 'google'],
        formats: AD_FORMATS.facebook,
        preview_url: '/templates/product_showcase.png',
        elements: [
          { id: 'bg', type: 'background', position: { x: 0, y: 0 }, size: { width: 100, height: 100 }, style: { background: 'gradient' }, editable: true },
          { id: 'product', type: 'image', position: { x: 50, y: 50 }, size: { width: 60, height: 60 }, style: {}, editable: true, placeholder: 'Product Image' },
          { id: 'headline', type: 'text', position: { x: 50, y: 15 }, size: { width: 80, height: 10 }, style: { fontSize: '32px', fontWeight: 'bold' }, editable: true, placeholder: 'Headline' },
          { id: 'cta', type: 'cta', position: { x: 50, y: 85 }, size: { width: 30, height: 8 }, style: { background: '#f97316' }, editable: true, placeholder: 'Shop Now' }
        ],
        copy_templates: [
          { id: 'headline', type: 'headline', templates: ['Introducing {product}', 'Meet the new {product}', '{benefit} with {product}'], variables: ['product', 'benefit'] },
          { id: 'primary', type: 'primary_text', templates: ['{product} helps you {benefit}. Try it today!', 'Looking for {benefit}? {product} has you covered.'], variables: ['product', 'benefit'] }
        ]
      },
      {
        id: 'tmpl_sale_promo',
        name: 'Sale Promotion',
        category: 'sale',
        platforms: ['facebook', 'instagram'],
        formats: AD_FORMATS.instagram,
        preview_url: '/templates/sale_promo.png',
        elements: [
          { id: 'bg', type: 'background', position: { x: 0, y: 0 }, size: { width: 100, height: 100 }, style: { background: '#ff0000' }, editable: true },
          { id: 'discount', type: 'text', position: { x: 50, y: 30 }, size: { width: 80, height: 30 }, style: { fontSize: '72px', fontWeight: 'bold', color: '#fff' }, editable: true, placeholder: '50% OFF' },
          { id: 'details', type: 'text', position: { x: 50, y: 60 }, size: { width: 80, height: 15 }, style: { fontSize: '24px', color: '#fff' }, editable: true, placeholder: 'Limited Time Only' }
        ],
        copy_templates: [
          { id: 'headline', type: 'headline', templates: ['{discount}% OFF Everything!', 'FLASH SALE: {discount}% Off', 'Save {discount}% Today Only'], variables: ['discount'] },
          { id: 'primary', type: 'primary_text', templates: ['Don\'t miss out! Get {discount}% off your entire purchase. Code: {code}', 'Our biggest sale of the year! {discount}% off ends {end_date}'], variables: ['discount', 'code', 'end_date'] }
        ]
      },
      {
        id: 'tmpl_testimonial',
        name: 'Testimonial',
        category: 'testimonial',
        platforms: ['facebook', 'instagram', 'linkedin'],
        formats: AD_FORMATS.facebook,
        preview_url: '/templates/testimonial.png',
        elements: [
          { id: 'bg', type: 'background', position: { x: 0, y: 0 }, size: { width: 100, height: 100 }, style: { background: '#1a1a2e' }, editable: true },
          { id: 'quote', type: 'text', position: { x: 50, y: 40 }, size: { width: 80, height: 30 }, style: { fontSize: '24px', fontStyle: 'italic', color: '#fff' }, editable: true, placeholder: '"Quote"' },
          { id: 'avatar', type: 'image', position: { x: 20, y: 75 }, size: { width: 15, height: 15 }, style: { borderRadius: '50%' }, editable: true, placeholder: 'Customer Photo' },
          { id: 'name', type: 'text', position: { x: 50, y: 75 }, size: { width: 50, height: 8 }, style: { fontSize: '18px', color: '#fff' }, editable: true, placeholder: 'Customer Name' }
        ],
        copy_templates: [
          { id: 'headline', type: 'headline', templates: ['See why customers love {product}', 'Real results from real people', '{rating} stars from {num_reviews}+ reviews'], variables: ['product', 'rating', 'num_reviews'] }
        ]
      },
      {
        id: 'tmpl_ugc_style',
        name: 'UGC Style',
        category: 'ugc',
        platforms: ['tiktok', 'instagram'],
        formats: AD_FORMATS.tiktok,
        preview_url: '/templates/ugc_style.png',
        elements: [
          { id: 'video', type: 'image', position: { x: 0, y: 0 }, size: { width: 100, height: 100 }, style: {}, editable: true, placeholder: 'UGC Video' },
          { id: 'caption', type: 'text', position: { x: 10, y: 85 }, size: { width: 80, height: 10 }, style: { fontSize: '18px', color: '#fff', textShadow: '2px 2px #000' }, editable: true, placeholder: 'Caption overlay' }
        ],
        copy_templates: [
          { id: 'headline', type: 'headline', templates: ['POV: You just discovered {product}', 'Wait for it... {hook}', 'This {product} changed everything'], variables: ['product', 'hook'] }
        ]
      }
    ];

    templates.forEach(t => this.templates.set(t.id, t));
  }

  // Brand Kit Management
  async createBrandKit(config: Omit<BrandKit, 'id'>): Promise<BrandKit> {
    const brandKit: BrandKit = {
      id: `brand_${Date.now()}`,
      ...config
    };

    this.brandKits.set(brandKit.id, brandKit);
    return brandKit;
  }

  // AI Generation
  async generateCreatives(request: GenerationRequest): Promise<AdCreative[]> {
    const creatives: AdCreative[] = [];
    const brandKit = request.brand_kit_id ? this.brandKits.get(request.brand_kit_id) : null;

    for (const platform of request.platforms) {
      const formats = AD_FORMATS[platform].filter(f =>
        request.formats.includes(f.name) || request.formats.includes('all')
      );

      for (const format of formats) {
        // Generate copy variations
        const headlines = this.generateHeadlines(request, request.num_variants);
        const primaryTexts = this.generatePrimaryTexts(request, request.num_variants);
        const ctas = this.selectCTAs(platform);

        const creative: AdCreative = {
          id: `creative_${Date.now()}_${platform}_${format.name.replace(/\s+/g, '_')}`,
          name: `${request.product_name} - ${platform} ${format.name}`,
          type: 'image',
          platform,
          format,
          content: {
            headline: headlines[0],
            primary_text: primaryTexts[0],
            cta: ctas[0],
            cta_url: '',
            media_url: `https://ai.orengen.io/generate/${Date.now()}.png`,
            media_type: 'image',
            brand_logo: brandKit?.logo_url,
            brand_colors: brandKit ? [brandKit.colors.primary, brandKit.colors.secondary, brandKit.colors.accent] : ['#f97316', '#0a0a0a', '#ffffff']
          },
          variants: headlines.slice(1).map((headline, i) => ({
            id: `var_${i}`,
            name: `Variant ${String.fromCharCode(66 + i)}`,
            changes: [
              { field: 'headline', value: headline },
              { field: 'primary_text', value: primaryTexts[i + 1] || primaryTexts[0] }
            ],
            preview_url: `https://ai.orengen.io/generate/${Date.now()}_${i}.png`,
            is_winner: false
          })),
          status: 'generating',
          created_at: new Date(),
          updated_at: new Date()
        };

        creatives.push(creative);
        this.creatives.set(creative.id, creative);
      }
    }

    // Simulate generation completion
    setTimeout(() => {
      creatives.forEach(c => {
        c.status = 'ready';
        c.updated_at = new Date();
      });
    }, 3000);

    return creatives;
  }

  private generateHeadlines(request: GenerationRequest, count: number): string[] {
    const templates = [
      `${request.product_name}: ${request.key_benefits[0]}`,
      `Discover ${request.product_name}`,
      `${request.key_benefits[0]} Made Easy`,
      `The ${request.product_name} You've Been Waiting For`,
      `Transform Your ${request.target_audience} Experience`,
      `Say Hello to ${request.product_name}`,
      `${request.key_benefits[0]} in Minutes`,
      `Why ${request.target_audience} Love ${request.product_name}`
    ];

    return templates.slice(0, count);
  }

  private generatePrimaryTexts(request: GenerationRequest, count: number): string[] {
    const benefits = request.key_benefits.join(', ');
    const templates = [
      `${request.product_description} Perfect for ${request.target_audience}. Get started today!`,
      `Looking for ${request.key_benefits[0]}? ${request.product_name} delivers ${benefits}. Try it free!`,
      `Join thousands of ${request.target_audience} who use ${request.product_name} daily. ${request.key_benefits[0]} guaranteed.`,
      `${request.product_name} helps you ${request.key_benefits[0].toLowerCase()}. ${request.product_description}`,
      `Stop struggling with ${request.key_benefits[0].toLowerCase()}. ${request.product_name} makes it effortless.`
    ];

    return templates.slice(0, count);
  }

  private selectCTAs(platform: AdPlatform): string[] {
    const ctasByPlatform: Record<AdPlatform, string[]> = {
      facebook: ['Shop Now', 'Learn More', 'Sign Up', 'Get Offer', 'Book Now'],
      instagram: ['Shop Now', 'Learn More', 'Sign Up', 'Watch More'],
      google: ['Shop Now', 'Learn More', 'Get Quote', 'Sign Up', 'Contact Us'],
      tiktok: ['Shop Now', 'Learn More', 'Download'],
      linkedin: ['Learn More', 'Sign Up', 'Apply Now', 'Download'],
      twitter: ['Learn More', 'Shop Now', 'Sign Up'],
      youtube: ['Learn More', 'Shop Now', 'Subscribe']
    };

    return ctasByPlatform[platform] || ['Learn More', 'Shop Now'];
  }

  // Campaign Management
  async createCampaign(config: Omit<AdCampaign, 'id' | 'status' | 'created_at'>): Promise<AdCampaign> {
    const campaign: AdCampaign = {
      id: `camp_${Date.now()}`,
      ...config,
      status: 'draft',
      created_at: new Date()
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async launchCampaign(campaign_id: string): Promise<void> {
    const campaign = this.campaigns.get(campaign_id);
    if (!campaign) throw new Error('Campaign not found');

    // In production, this would connect to ad platform APIs
    campaign.status = 'active';
  }

  async pauseCampaign(campaign_id: string): Promise<void> {
    const campaign = this.campaigns.get(campaign_id);
    if (!campaign) throw new Error('Campaign not found');

    campaign.status = 'paused';
  }

  // A/B Testing
  async runABTest(creative_id: string, duration_hours: number): Promise<{
    winner: string;
    results: { variant_id: string; performance: AdPerformance }[];
  }> {
    const creative = this.creatives.get(creative_id);
    if (!creative) throw new Error('Creative not found');

    // Simulate A/B test results
    const results = [
      { variant_id: 'original', performance: this.generateMockPerformance() },
      ...creative.variants.map(v => ({
        variant_id: v.id,
        performance: this.generateMockPerformance()
      }))
    ];

    // Determine winner by ROAS
    const winner = results.sort((a, b) => b.performance.roas - a.performance.roas)[0];

    // Mark winner
    if (winner.variant_id !== 'original') {
      const winningVariant = creative.variants.find(v => v.id === winner.variant_id);
      if (winningVariant) {
        winningVariant.is_winner = true;
        winningVariant.performance = winner.performance;
      }
    }

    return {
      winner: winner.variant_id,
      results
    };
  }

  private generateMockPerformance(): AdPerformance {
    const impressions = Math.floor(Math.random() * 10000) + 1000;
    const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.01));
    const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.02));
    const spend = Math.floor(impressions * 0.01);

    return {
      impressions,
      clicks,
      ctr: clicks / impressions,
      conversions,
      conversion_rate: conversions / clicks,
      spend,
      cpc: spend / clicks,
      cpm: (spend / impressions) * 1000,
      roas: (conversions * 50) / spend,
      engagement_rate: (clicks + conversions) / impressions
    };
  }

  // Analytics
  async getCreativeAnalytics(creative_id: string): Promise<AdPerformance> {
    const creative = this.creatives.get(creative_id);
    if (!creative) throw new Error('Creative not found');

    return creative.performance || this.generateMockPerformance();
  }

  async getCampaignAnalytics(campaign_id: string): Promise<CampaignPerformance> {
    const campaign = this.campaigns.get(campaign_id);
    if (!campaign) throw new Error('Campaign not found');

    const creativePerformances = await Promise.all(
      campaign.creatives.map(id => this.getCreativeAnalytics(id))
    );

    const totals = creativePerformances.reduce(
      (acc, p) => ({
        spend: acc.spend + p.spend,
        impressions: acc.impressions + p.impressions,
        clicks: acc.clicks + p.clicks,
        conversions: acc.conversions + p.conversions
      }),
      { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
    );

    const bestCreative = creativePerformances
      .map((p, i) => ({ id: campaign.creatives[i], roas: p.roas }))
      .sort((a, b) => b.roas - a.roas)[0];

    return {
      total_spend: totals.spend,
      total_impressions: totals.impressions,
      total_clicks: totals.clicks,
      total_conversions: totals.conversions,
      avg_ctr: totals.clicks / totals.impressions,
      avg_cpc: totals.spend / totals.clicks,
      avg_cpm: (totals.spend / totals.impressions) * 1000,
      roas: (totals.conversions * 50) / totals.spend,
      best_performing_creative: bestCreative?.id || '',
      best_performing_audience: 'Interest: Technology'
    };
  }

  // Getters
  async getTemplates(category?: string): Promise<AdTemplate[]> {
    let templates = Array.from(this.templates.values());
    if (category) templates = templates.filter(t => t.category === category);
    return templates;
  }

  async getCreatives(filters?: { platform?: AdPlatform; status?: string }): Promise<AdCreative[]> {
    let creatives = Array.from(this.creatives.values());
    if (filters?.platform) creatives = creatives.filter(c => c.platform === filters.platform);
    if (filters?.status) creatives = creatives.filter(c => c.status === filters.status);
    return creatives.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  async getCreative(id: string): Promise<AdCreative | undefined> {
    return this.creatives.get(id);
  }

  async getCampaigns(): Promise<AdCampaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: string): Promise<AdCampaign | undefined> {
    return this.campaigns.get(id);
  }

  async getBrandKits(): Promise<BrandKit[]> {
    return Array.from(this.brandKits.values());
  }

  getAdFormats(): typeof AD_FORMATS {
    return AD_FORMATS;
  }
}

export const adCreativeService = new AdCreativeService();
