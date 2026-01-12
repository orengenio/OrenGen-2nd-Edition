// Lead Scoring Algorithm
// Calculates a 0-100 score based on multiple factors

import { DomainLead, WhoisData, TechStack, EnrichmentData, LeadFilter } from '@/crm/types';

export interface ScoreBreakdown {
  domainAge: number;
  whoisQuality: number;
  techStack: number;
  contactInfo: number;
  targetMatch: number;
  engagement: number;
  total: number;
  factors: string[];
}

export interface ScoringConfig {
  // Domain age scoring
  domainAge: {
    under7Days: number;      // Very fresh domain
    under30Days: number;     // Fresh domain
    under90Days: number;     // Recent domain
    under1Year: number;      // Relatively new
    older: number;           // Established
  };
  // WHOIS data quality
  whois: {
    hasRegistrar: number;
    hasOrgName: number;
    hasEmail: number;
    hasCountry: number;
    targetCountries: string[];  // Bonus for these countries
    targetCountryBonus: number;
  };
  // Tech stack scoring
  techStack: {
    valuableCMS: string[];      // WordPress, Shopify, etc.
    valuableCMSScore: number;
    hasFramework: number;
    hasAnalytics: number;
    hasMarketing: number;
    hasContactForm: number;
    hasLiveChat: number;
    noTechStack: number;        // Penalty for no detectable stack
  };
  // Contact information
  contact: {
    hasEmails: number;
    multipleEmails: number;
    hasPhone: number;
    hasSocialMedia: number;
    hasLinkedIn: number;
  };
  // Penalties
  penalties: {
    disposableEmail: number;
    genericEmail: number;
    privacyProtected: number;
    spamIndicators: string[];
    spamPenalty: number;
  };
}

const DEFAULT_CONFIG: ScoringConfig = {
  domainAge: {
    under7Days: 25,
    under30Days: 20,
    under90Days: 15,
    under1Year: 10,
    older: 5,
  },
  whois: {
    hasRegistrar: 5,
    hasOrgName: 10,
    hasEmail: 8,
    hasCountry: 5,
    targetCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL'],
    targetCountryBonus: 10,
  },
  techStack: {
    valuableCMS: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'WordPress'],
    valuableCMSScore: 15,
    hasFramework: 5,
    hasAnalytics: 5,
    hasMarketing: 8,
    hasContactForm: 10,
    hasLiveChat: 5,
    noTechStack: -10,
  },
  contact: {
    hasEmails: 15,
    multipleEmails: 5,
    hasPhone: 5,
    hasSocialMedia: 5,
    hasLinkedIn: 8,
  },
  penalties: {
    disposableEmail: -15,
    genericEmail: -5,
    privacyProtected: -10,
    spamIndicators: ['gambling', 'casino', 'adult', 'xxx', 'porn', 'crypto-scam', 'fake'],
    spamPenalty: -50,
  },
};

export class LeadScoringService {
  private config: ScoringConfig;

  constructor(config: Partial<ScoringConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  calculateScore(lead: Partial<DomainLead>): ScoreBreakdown {
    const factors: string[] = [];
    let domainAgeScore = 0;
    let whoisScore = 0;
    let techStackScore = 0;
    let contactScore = 0;
    let targetMatchScore = 0;
    let engagementScore = 0;

    // Domain age scoring
    if (lead.registeredDate) {
      const daysSinceRegistration = this.daysSince(lead.registeredDate);

      if (daysSinceRegistration < 7) {
        domainAgeScore = this.config.domainAge.under7Days;
        factors.push('Very fresh domain (< 7 days)');
      } else if (daysSinceRegistration < 30) {
        domainAgeScore = this.config.domainAge.under30Days;
        factors.push('Fresh domain (< 30 days)');
      } else if (daysSinceRegistration < 90) {
        domainAgeScore = this.config.domainAge.under90Days;
        factors.push('Recent domain (< 90 days)');
      } else if (daysSinceRegistration < 365) {
        domainAgeScore = this.config.domainAge.under1Year;
        factors.push('Relatively new domain (< 1 year)');
      } else {
        domainAgeScore = this.config.domainAge.older;
        factors.push('Established domain');
      }
    }

    // WHOIS data scoring
    if (lead.whoisData) {
      const whois = lead.whoisData;

      if (whois.registrar) {
        whoisScore += this.config.whois.hasRegistrar;
      }

      if (whois.registrantOrg) {
        whoisScore += this.config.whois.hasOrgName;
        factors.push(`Organization: ${whois.registrantOrg}`);
      }

      if (whois.registrantEmail) {
        whoisScore += this.config.whois.hasEmail;
        factors.push('Has registrant email');

        // Check for privacy-protected email
        if (this.isPrivacyProtected(whois.registrantEmail)) {
          whoisScore += this.config.penalties.privacyProtected;
          factors.push('Privacy-protected WHOIS');
        }
      }

      if (whois.registrantCountry) {
        whoisScore += this.config.whois.hasCountry;

        if (this.config.whois.targetCountries.includes(whois.registrantCountry)) {
          targetMatchScore += this.config.whois.targetCountryBonus;
          factors.push(`Target country: ${whois.registrantCountry}`);
        }
      }
    }

    // Tech stack scoring
    if (lead.techStack) {
      const tech = lead.techStack;

      if (tech.cms) {
        if (this.config.techStack.valuableCMS.includes(tech.cms)) {
          techStackScore += this.config.techStack.valuableCMSScore;
          factors.push(`Valuable CMS: ${tech.cms}`);
        } else {
          techStackScore += 5; // Still has a CMS
          factors.push(`CMS: ${tech.cms}`);
        }
      }

      if (tech.ecommerce) {
        techStackScore += this.config.techStack.valuableCMSScore;
        factors.push(`E-commerce: ${tech.ecommerce}`);
      }

      if (tech.frameworks && tech.frameworks.length > 0) {
        techStackScore += this.config.techStack.hasFramework;
        factors.push(`Frameworks: ${tech.frameworks.join(', ')}`);
      }

      if (tech.analytics && tech.analytics.length > 0) {
        techStackScore += this.config.techStack.hasAnalytics;
        factors.push('Has analytics');
      }

      if (tech.marketing && tech.marketing.length > 0) {
        techStackScore += this.config.techStack.hasMarketing;
        factors.push(`Marketing tools: ${tech.marketing.join(', ')}`);
      }

      if (tech.hasContactForm) {
        techStackScore += this.config.techStack.hasContactForm;
        factors.push('Has contact form');
      }

      if (tech.hasLiveChat) {
        techStackScore += this.config.techStack.hasLiveChat;
        factors.push('Has live chat');
      }
    } else {
      // No tech stack detected - might be offline or error
      techStackScore += this.config.techStack.noTechStack;
    }

    // Contact information scoring
    if (lead.enrichmentData) {
      const enrichment = lead.enrichmentData;

      if (enrichment.emails && enrichment.emails.length > 0) {
        contactScore += this.config.contact.hasEmails;
        factors.push(`Has ${enrichment.emails.length} email(s)`);

        if (enrichment.emails.length > 1) {
          contactScore += this.config.contact.multipleEmails;
        }

        // Check for generic emails
        const hasGeneric = enrichment.emails.some(e => this.isGenericEmail(e));
        if (hasGeneric) {
          contactScore += this.config.penalties.genericEmail;
          factors.push('Has generic email (info@, contact@, etc.)');
        }
      }

      if (enrichment.phones && enrichment.phones.length > 0) {
        contactScore += this.config.contact.hasPhone;
        factors.push('Has phone number');
      }

      if (enrichment.socialMedia) {
        if (enrichment.socialMedia.linkedin) {
          contactScore += this.config.contact.hasLinkedIn;
          factors.push('Has LinkedIn');
        }

        const socialCount = Object.values(enrichment.socialMedia).filter(Boolean).length;
        if (socialCount > 0) {
          contactScore += this.config.contact.hasSocialMedia;
          factors.push(`Has ${socialCount} social profile(s)`);
        }
      }
    }

    // Spam detection
    if (lead.domain) {
      const isSpammy = this.config.penalties.spamIndicators.some(indicator =>
        lead.domain!.toLowerCase().includes(indicator)
      );
      if (isSpammy) {
        engagementScore += this.config.penalties.spamPenalty;
        factors.push('Spam indicator detected');
      }
    }

    // Calculate total (capped at 0-100)
    const rawTotal = domainAgeScore + whoisScore + techStackScore + contactScore + targetMatchScore + engagementScore;
    const total = Math.max(0, Math.min(100, rawTotal));

    return {
      domainAge: domainAgeScore,
      whoisQuality: whoisScore,
      techStack: techStackScore,
      contactInfo: contactScore,
      targetMatch: targetMatchScore,
      engagement: engagementScore,
      total,
      factors,
    };
  }

  matchesFilter(lead: Partial<DomainLead>, filter: LeadFilter): boolean {
    // TLD filter
    if (filter.tlds && filter.tlds.length > 0) {
      const domain = lead.domain || '';
      const tld = '.' + domain.split('.').pop();
      if (!filter.tlds.includes(tld)) {
        return false;
      }
    }

    // Technology filter
    if (filter.technologies && filter.technologies.length > 0 && lead.techStack) {
      const techList = [
        lead.techStack.cms,
        lead.techStack.ecommerce,
        ...(lead.techStack.frameworks || []),
        ...(lead.techStack.marketing || []),
      ].filter(Boolean);

      const hasMatch = filter.technologies.some(t =>
        techList.some(tech => tech?.toLowerCase().includes(t.toLowerCase()))
      );

      if (!hasMatch) {
        return false;
      }
    }

    // Exclude technologies
    if (filter.excludeTechnologies && filter.excludeTechnologies.length > 0 && lead.techStack) {
      const techList = [
        lead.techStack.cms,
        lead.techStack.ecommerce,
        ...(lead.techStack.frameworks || []),
      ].filter(Boolean);

      const hasExcluded = filter.excludeTechnologies.some(t =>
        techList.some(tech => tech?.toLowerCase().includes(t.toLowerCase()))
      );

      if (hasExcluded) {
        return false;
      }
    }

    // Contact form filter
    if (filter.hasContactForm !== undefined && lead.techStack) {
      if (lead.techStack.hasContactForm !== filter.hasContactForm) {
        return false;
      }
    }

    // Live chat filter
    if (filter.hasLiveChat !== undefined && lead.techStack) {
      if (lead.techStack.hasLiveChat !== filter.hasLiveChat) {
        return false;
      }
    }

    // Registration date filters
    if (filter.registeredAfter && lead.registeredDate) {
      if (new Date(lead.registeredDate) < new Date(filter.registeredAfter)) {
        return false;
      }
    }

    if (filter.registeredBefore && lead.registeredDate) {
      if (new Date(lead.registeredDate) > new Date(filter.registeredBefore)) {
        return false;
      }
    }

    // Country filter
    if (filter.countries && filter.countries.length > 0 && lead.whoisData) {
      if (!lead.whoisData.registrantCountry ||
          !filter.countries.includes(lead.whoisData.registrantCountry)) {
        return false;
      }
    }

    // Minimum score filter
    if (filter.minLeadScore !== undefined) {
      const score = lead.leadScore ?? this.calculateScore(lead).total;
      if (score < filter.minLeadScore) {
        return false;
      }
    }

    // Keyword filter
    if (filter.keywords && filter.keywords.length > 0 && lead.domain) {
      const hasKeyword = filter.keywords.some(keyword =>
        lead.domain!.toLowerCase().includes(keyword.toLowerCase())
      );
      if (!hasKeyword) {
        return false;
      }
    }

    return true;
  }

  private daysSince(dateStr: string): number {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private isPrivacyProtected(email: string): boolean {
    const privacyDomains = [
      'whoisguard',
      'privacyprotect',
      'whoisproxy',
      'domainsbyproxy',
      'privacy',
      'protected',
      'redacted',
      'withheld',
    ];
    return privacyDomains.some(domain => email.toLowerCase().includes(domain));
  }

  private isGenericEmail(email: string): boolean {
    const genericPrefixes = [
      'info@', 'contact@', 'hello@', 'support@', 'sales@',
      'admin@', 'office@', 'mail@', 'team@', 'help@',
    ];
    return genericPrefixes.some(prefix => email.toLowerCase().startsWith(prefix));
  }
}

export const leadScoringService = new LeadScoringService();
