export const ASSETS = {
  LOGO_DARK: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/6951c29bee10473d7513710a.png',
  LOGO_LIGHT: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/6951c29be889d3ce55c4549d.png',
  FAVICON: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/6954fa6e9e7c132193396d37.png',
  ORENGEN_ICON: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/690a621f2b2c75f886569ecf.png',
  PROVIDERS: {
    GMAIL: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/69529d1ce889d3a184dd7a5b.png',
    MICROSOFT: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/69529d1c73a5e04cc29700a1.png',
    OUTLOOK: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/69529d1cee10476c152cb08a.png',
    YAHOO: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/69529d1cee1047635a2cb089.png',
    PROTON: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/69529d1c2bb72cb2c43bc2f3.png',
    FASTMAIL: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/69529d1cee104765f42cb088.png',
    APPLE: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/69529d1c2bb72c46c63bc2f2.png',
  }
};

export const REVIEW_LINKS = {
  GOOGLE: 'https://g.page/r/CcTOiNDyo03PEBM/review',
  BBB: 'https://www.bbb.org/us/tx/mansfield/profile/computer-software/orengen-worldwide-0825-1000236185/customer-reviews',
  BBB_BADGE: 'https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/693a7572b263273f3dbb324c.svg',
  FACEBOOK: 'https://www.facebook.com/orengenio/reviews',
  TRUSTPILOT: 'https://www.trustpilot.com/review/orengen.io',
  SITEJABBER: 'https://www.sitejabber.com/reviews/orengen.io',
  CLUTCH: 'https://clutch.co/profile/orengen-worldwide?_gl=1%2A12urcmm%2A_gcl_au%2AMTc5Mzg3NzE1NS4xNzY3MTY1NzU1%2AFPAU%2AMTc5Mzg3NzE1NS4xNzY3MTY1NzU1%2A_ga%2ANTEyNTEwMjYzLjE3NjcxNjU3NTU.%2A_ga_D0WFGX8X3V%2AczE3NjcxNjU3NTQkbzEkZzEkdDE3NjcxNjU4NzMkajI1JGwwJGgzMzgzNTg5NzY.%2A_fplc%2AQ09XaXRGSTJVJTJGVHdRZHp6ODh5ZjFhYkhmeFgyRG9ZVG1YMFh6c0JucVNxWWdTMld1eUZVblIlMkJ4SkJ4R2s4cTRDMEVmUjFIYllRakZ2ZHZpOXFybU5EaEs4VU1CcEdXNHlVVE93RUlzTW1yTTE2dzVwVCUyQjZqckNxJTJCRnN6UWclM0QlM0Q.',
  G2: '#',
  CAPTERRA: '#',
  PRODUCT_HUNT: '#'
};

export const PRICING_PLANS = [
  {
    name: 'Nube Package',
    price: '$9.99',
    period: '/ one-time',
    description: 'Perfect for a single brand setup and quick conversion.',
    features: ['1 BIMI Conversion', 'Unlimited SVG Downloads'],
    cta: 'Buy Now',
    highlight: false,
  },
  {
    name: 'Starter Package',
    price: '$19.99',
    period: '/ one-time',
    description: 'Perfect for small agencies or rebranding projects.',
    features: ['3 BIMI Conversions', 'Unlimited SVG Downloads'],
    cta: 'Buy Now',
    highlight: false,
  },
  {
    name: 'Pro Package',
    price: '$49.99',
    period: '/ month',
    description: 'Power for professional marketers.',
    features: ['10 BIMI Conversions', 'Unlimited SVG Downloads', 'Save & Export History'],
    cta: 'Subscribe',
    highlight: true,
    badge: 'BEST VALUE'
  },
  {
    name: 'Premium Package',
    price: '$79.99',
    period: '/ month',
    description: 'Complete enterprise hosting & assistance.',
    features: ['15 BIMI Conversions', 'Unlimited SVG Downloads', 'Save & Export History', 'BIMI Hosting', 'Premium Support'],
    cta: 'Subscribe',
    highlight: false,
  },
];

export const COMPARISON_DATA = [
  { tool: 'EasyDMARC', function: 'SVG optimization', input: 'SVG only', output: 'SVG Tiny P/S', price: '$20-$40 / mo', type: 'Paired', limit: 'Cannot ingest raster', verdict: 'BIMI Forge Wins' },
  { tool: 'PowerDMARC', function: 'SVG Tiny conversion', input: 'SVG only', output: 'SVG Tiny 1.2', price: '$25-$60 / mo', type: 'Paired', limit: 'SVG prerequisite', verdict: 'BIMI Forge Wins' },
  { tool: 'BIMI Group', function: 'SVG validation', input: 'SVG only', output: 'SVG Tiny P/S', price: '~$500+ / year', type: 'Paired', limit: 'Enterprise-gated', verdict: 'BIMI Forge Wins' },
  { tool: 'image2svg', function: 'Basic vectorization', input: 'PNG, JPG', output: 'SVG', price: 'Free', type: 'Stand-Alone', limit: 'Low fidelity, unsafe', verdict: 'BIMI Forge Wins' },
  { tool: 'Vectorizer.AI', function: 'AI vectorization', input: 'PNG, JPG', output: 'SVG', price: '$9.99 / mo', type: 'Stand-Alone', limit: 'Not BIMI-aware', verdict: 'BIMI Forge Wins' },
  { tool: 'BIMI Forge', function: 'End-to-end BIMI', input: 'ANY format', output: 'SVG Tiny 1.2', price: 'Fixed/Sub', type: 'True Stand-Alone', limit: 'None', verdict: 'Category Leader', isWinner: true },
];