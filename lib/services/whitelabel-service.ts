/**
 * White-Label Tenant Customization Service
 * Enables full branding customization for multi-tenant deployments
 */

// Types
export interface TenantBranding {
  tenantId: string;
  name: string;
  domain?: string;
  customDomain?: string;

  // Logo & Favicon
  logo: {
    light: string;
    dark: string;
    icon: string;
    favicon: string;
  };

  // Colors
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };

  // Typography
  typography: {
    fontFamily: string;
    headingFont?: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };

  // Layout
  layout: {
    sidebarWidth: string;
    borderRadius: string;
    headerHeight: string;
    containerMaxWidth: string;
  };

  // Features
  features: {
    showPoweredBy: boolean;
    customLoginPage: boolean;
    customEmailTemplates: boolean;
    customDashboard: boolean;
    hideNexusLogo: boolean;
  };

  // Content
  content: {
    companyName: string;
    supportEmail: string;
    supportPhone?: string;
    termsUrl?: string;
    privacyUrl?: string;
    helpUrl?: string;
    loginTitle?: string;
    loginSubtitle?: string;
    welcomeMessage?: string;
  };

  // Email Branding
  email: {
    fromName: string;
    fromEmail: string;
    replyTo?: string;
    headerHtml?: string;
    footerHtml?: string;
    signature?: string;
  };

  // Social Links
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };

  // Custom CSS
  customCss?: string;

  // Custom Scripts
  customScripts?: {
    head?: string;
    bodyStart?: string;
    bodyEnd?: string;
  };

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// Default OrenGen branding
export const DEFAULT_BRANDING: TenantBranding = {
  tenantId: 'default',
  name: 'OrenGen',

  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
    icon: '/icon.svg',
    favicon: '/favicon.ico',
  },

  colors: {
    primary: '#f97316',
    primaryHover: '#ea580c',
    secondary: '#1e293b',
    accent: '#f97316',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },

  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFont: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
  },

  layout: {
    sidebarWidth: '280px',
    borderRadius: '0.75rem',
    headerHeight: '64px',
    containerMaxWidth: '1400px',
  },

  features: {
    showPoweredBy: true,
    customLoginPage: false,
    customEmailTemplates: false,
    customDashboard: false,
    hideNexusLogo: false,
  },

  content: {
    companyName: 'OrenGen',
    supportEmail: 'support@orengen.com',
    loginTitle: 'Welcome back',
    loginSubtitle: 'Sign in to your account',
    welcomeMessage: 'Welcome to OrenGen CRM',
  },

  email: {
    fromName: 'OrenGen',
    fromEmail: 'noreply@orengen.com',
  },

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Branding presets for quick setup
export const BRANDING_PRESETS: Record<string, Partial<TenantBranding>> = {
  corporate: {
    colors: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      secondary: '#1e293b',
      accent: '#2563eb',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    layout: {
      sidebarWidth: '260px',
      borderRadius: '0.5rem',
      headerHeight: '60px',
      containerMaxWidth: '1200px',
    },
  },
  modern: {
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#0f172a',
      accent: '#8b5cf6',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    layout: {
      sidebarWidth: '300px',
      borderRadius: '1rem',
      headerHeight: '72px',
      containerMaxWidth: '1600px',
    },
  },
  minimal: {
    colors: {
      primary: '#18181b',
      primaryHover: '#27272a',
      secondary: '#fafafa',
      accent: '#18181b',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#18181b',
      textMuted: '#71717a',
      border: '#e4e4e7',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
    },
    layout: {
      sidebarWidth: '240px',
      borderRadius: '0.375rem',
      headerHeight: '56px',
      containerMaxWidth: '1280px',
    },
  },
  vibrant: {
    colors: {
      primary: '#ec4899',
      primaryHover: '#db2777',
      secondary: '#1e1b4b',
      accent: '#06b6d4',
      background: '#fdf4ff',
      surface: '#ffffff',
      text: '#1e1b4b',
      textMuted: '#6b7280',
      border: '#f3e8ff',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    layout: {
      sidebarWidth: '280px',
      borderRadius: '1.5rem',
      headerHeight: '68px',
      containerMaxWidth: '1400px',
    },
  },
};

// White-label Service
export class WhiteLabelService {
  private branding: Map<string, TenantBranding> = new Map();
  private currentTenantId: string = 'default';

  constructor() {
    this.branding.set('default', DEFAULT_BRANDING);
  }

  // Get branding for tenant
  getBranding(tenantId?: string): TenantBranding {
    const id = tenantId || this.currentTenantId;
    return this.branding.get(id) || DEFAULT_BRANDING;
  }

  // Set current tenant
  setCurrentTenant(tenantId: string): void {
    this.currentTenantId = tenantId;
  }

  // Update branding
  updateBranding(tenantId: string, updates: Partial<TenantBranding>): TenantBranding {
    const current = this.getBranding(tenantId);
    const updated: TenantBranding = {
      ...current,
      ...updates,
      colors: { ...current.colors, ...updates.colors },
      typography: { ...current.typography, ...updates.typography },
      layout: { ...current.layout, ...updates.layout },
      features: { ...current.features, ...updates.features },
      content: { ...current.content, ...updates.content },
      email: { ...current.email, ...updates.email },
      logo: { ...current.logo, ...updates.logo },
      updatedAt: new Date().toISOString(),
    };

    this.branding.set(tenantId, updated);
    return updated;
  }

  // Apply preset
  applyPreset(tenantId: string, presetName: keyof typeof BRANDING_PRESETS): TenantBranding {
    const preset = BRANDING_PRESETS[presetName];
    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}`);
    }
    return this.updateBranding(tenantId, preset);
  }

  // Generate CSS variables
  generateCssVariables(branding: TenantBranding): string {
    return `
:root {
  --color-primary: ${branding.colors.primary};
  --color-primary-hover: ${branding.colors.primaryHover};
  --color-secondary: ${branding.colors.secondary};
  --color-accent: ${branding.colors.accent};
  --color-background: ${branding.colors.background};
  --color-surface: ${branding.colors.surface};
  --color-text: ${branding.colors.text};
  --color-text-muted: ${branding.colors.textMuted};
  --color-border: ${branding.colors.border};
  --color-success: ${branding.colors.success};
  --color-warning: ${branding.colors.warning};
  --color-error: ${branding.colors.error};

  --font-family: ${branding.typography.fontFamily};
  --font-family-heading: ${branding.typography.headingFont || branding.typography.fontFamily};
  --font-size-xs: ${branding.typography.fontSize.xs};
  --font-size-sm: ${branding.typography.fontSize.sm};
  --font-size-base: ${branding.typography.fontSize.base};
  --font-size-lg: ${branding.typography.fontSize.lg};
  --font-size-xl: ${branding.typography.fontSize.xl};
  --font-size-2xl: ${branding.typography.fontSize['2xl']};
  --font-size-3xl: ${branding.typography.fontSize['3xl']};

  --sidebar-width: ${branding.layout.sidebarWidth};
  --border-radius: ${branding.layout.borderRadius};
  --header-height: ${branding.layout.headerHeight};
  --container-max-width: ${branding.layout.containerMaxWidth};
}
    `.trim();
  }

  // Generate Tailwind config override
  generateTailwindConfig(branding: TenantBranding): object {
    return {
      theme: {
        extend: {
          colors: {
            brand: {
              primary: branding.colors.primary,
              'primary-hover': branding.colors.primaryHover,
              secondary: branding.colors.secondary,
              accent: branding.colors.accent,
            },
          },
          fontFamily: {
            sans: [branding.typography.fontFamily],
            heading: [branding.typography.headingFont || branding.typography.fontFamily],
          },
          borderRadius: {
            DEFAULT: branding.layout.borderRadius,
          },
        },
      },
    };
  }

  // Validate branding configuration
  validateBranding(branding: Partial<TenantBranding>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate colors
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (branding.colors) {
      Object.entries(branding.colors).forEach(([key, value]) => {
        if (!hexColorRegex.test(value)) {
          errors.push(`Invalid color format for ${key}: ${value}`);
        }
      });
    }

    // Validate URLs
    if (branding.logo) {
      Object.entries(branding.logo).forEach(([key, value]) => {
        if (value && !value.startsWith('/') && !value.startsWith('http')) {
          errors.push(`Invalid URL format for logo.${key}`);
        }
      });
    }

    // Validate email
    if (branding.email?.fromEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(branding.email.fromEmail)) {
        errors.push(`Invalid email format: ${branding.email.fromEmail}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // Export branding as JSON
  exportBranding(tenantId: string): string {
    const branding = this.getBranding(tenantId);
    return JSON.stringify(branding, null, 2);
  }

  // Import branding from JSON
  importBranding(tenantId: string, json: string): TenantBranding {
    try {
      const branding = JSON.parse(json) as Partial<TenantBranding>;
      const validation = this.validateBranding(branding);

      if (!validation.valid) {
        throw new Error(`Invalid branding: ${validation.errors.join(', ')}`);
      }

      return this.updateBranding(tenantId, branding);
    } catch (error: any) {
      throw new Error(`Failed to import branding: ${error.message}`);
    }
  }

  // Generate email template with branding
  generateEmailTemplate(
    tenantId: string,
    content: { subject: string; body: string }
  ): string {
    const branding = this.getBranding(tenantId);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.subject}</title>
  <style>
    body { font-family: ${branding.typography.fontFamily}; margin: 0; padding: 0; background: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${branding.colors.primary}; padding: 24px; text-align: center; }
    .header img { max-height: 40px; }
    .content { background: #ffffff; padding: 32px; }
    .footer { padding: 24px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; padding: 12px 24px; background: ${branding.colors.primary}; color: #ffffff; text-decoration: none; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${branding.logo.light}" alt="${branding.content.companyName}">
    </div>
    <div class="content">
      ${content.body}
    </div>
    <div class="footer">
      ${branding.email.footerHtml || `
        <p>&copy; ${new Date().getFullYear()} ${branding.content.companyName}. All rights reserved.</p>
        <p>${branding.content.supportEmail}</p>
      `}
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}

// Factory function
export function createWhiteLabelService(): WhiteLabelService {
  return new WhiteLabelService();
}

// React hook for accessing branding
export function useBranding(tenantId?: string) {
  const service = createWhiteLabelService();
  return service.getBranding(tenantId);
}

// Utility to inject branding styles
export function injectBrandingStyles(branding: TenantBranding): void {
  const service = createWhiteLabelService();
  const css = service.generateCssVariables(branding);

  let styleElement = document.getElementById('tenant-branding-styles');
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'tenant-branding-styles';
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = css;

  // Add custom CSS if provided
  if (branding.customCss) {
    let customStyleElement = document.getElementById('tenant-custom-styles');
    if (!customStyleElement) {
      customStyleElement = document.createElement('style');
      customStyleElement.id = 'tenant-custom-styles';
      document.head.appendChild(customStyleElement);
    }
    customStyleElement.textContent = branding.customCss;
  }
}
