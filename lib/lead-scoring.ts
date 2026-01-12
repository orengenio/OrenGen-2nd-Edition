import { DomainLead } from '@/crm/types';

export interface ScoringCriteria {
  hasWhoisData: boolean;
  hasEnrichmentData: boolean;
  hasEmails: boolean;
  domainAge?: number;
  techStack?: string[];
  estimatedTraffic?: number;
  companySize?: string;
  industry?: string;
}

// Advanced lead scoring algorithm
export function calculateLeadScore(lead: DomainLead, criteria?: ScoringCriteria): number {
  let totalScore = 0;

  // Base score for having a valid domain
  totalScore += 10;

  // WHOIS data contributes up to 20 points
  if (lead.whoisData) {
    totalScore += 20;

    // Domain age bonus - older domains are more established
    if (lead.whoisData.registrationDate) {
      const domainAgeInYears = getDomainAgeInYears(lead.whoisData.registrationDate);
      if (domainAgeInYears > 5) totalScore += 10; // Well-established domain
      else if (domainAgeInYears > 2) totalScore += 5; // Moderately established
    }

    // Has registered organization
    if (lead.whoisData.registrantOrg) totalScore += 5;
  }

  // Enrichment data contributes up to 30 points
  if (lead.enrichmentData) {
    totalScore += 10;

    // Email addresses found - indicates reachability
    if (lead.enrichmentData.emails && lead.enrichmentData.emails.length > 0) {
      totalScore += 15; // At least one email
      if (lead.enrichmentData.emails.length >= 3) totalScore += 5; // Multiple contact points
    }

    // Social media presence - indicates active business
    if (lead.enrichmentData.socialMedia) {
      const socialMediaCount = Object.keys(lead.enrichmentData.socialMedia).length;
      totalScore += Math.min(socialMediaCount * 2, 10);
    }

    // Company size - larger companies typically have bigger budgets
    if (lead.enrichmentData.companySize) {
      const companySizeScore = getCompanySizeScore(lead.enrichmentData.companySize);
      totalScore += companySizeScore;
    }

    // Traffic estimation - higher traffic indicates established business
    if (lead.enrichmentData.estimatedTraffic) {
      if (lead.enrichmentData.estimatedTraffic > 100000) totalScore += 10; // High traffic
      else if (lead.enrichmentData.estimatedTraffic > 10000) totalScore += 5; // Moderate traffic
    }
  }

  // Tech stack contributes up to 20 points
  if (lead.techStack) {
    totalScore += 5;

    // Popular CMS/frameworks indicate active development and technical capability
    const valuableTechnologies = [
      'WordPress',
      'Shopify',
      'WooCommerce',
      'React',
      'Next.js',
      'Vue',
    ];
    const usesValuableTechnology = lead.techStack.frameworks?.some((technology) =>
      valuableTechnologies.some((valuableTech) =>
        technology.toLowerCase().includes(valuableTech.toLowerCase())
      )
    );
    if (usesValuableTechnology) totalScore += 10;

    // Analytics tools indicate data-driven business
    if (lead.techStack.analytics && lead.techStack.analytics.length > 0) {
      totalScore += 5;
    }
  }

  // Industry-specific bonuses contribute up to 10 points
  if (lead.enrichmentData?.industry) {
    const highValueIndustries = [
      'technology',
      'finance',
      'healthcare',
      'saas',
      'e-commerce',
    ];
    const isHighValueIndustry = highValueIndustries.some((highValueIndustry) =>
      lead.enrichmentData?.industry?.toLowerCase().includes(highValueIndustry)
    );
    if (isHighValueIndustry) {
      totalScore += 10;
    }
  }

  // Future: Engagement bonuses could be added based on user behavior tracking
  // (website visits, email opens, content downloads, etc.)

  // Cap maximum score at 100
  return Math.min(totalScore, 100);
}

// Machine learning-based scoring (placeholder for future ML model)
export async function mlLeadScore(lead: DomainLead): Promise<number> {
  // This would call a trained ML model
  // For now, use rule-based scoring
  return calculateLeadScore(lead);
}

// Predictive conversion probability
export function predictConversionProbability(
  leadScore: number,
  historicalData?: {
    avgConversionRate: number;
    avgScoreOfConverted: number;
  }
): number {
  // Simple prediction based on score
  // Could be enhanced with ML
  if (leadScore >= 90) return 0.8;
  if (leadScore >= 80) return 0.65;
  if (leadScore >= 70) return 0.5;
  if (leadScore >= 60) return 0.35;
  if (leadScore >= 50) return 0.2;
  return 0.1;
}

// Helper functions
function getDomainAgeInYears(registrationDate: string): number {
  const regDate = new Date(registrationDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - regDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
  return diffYears;
}

function getCompanySizeScore(size: string): number {
  const sizeMap: Record<string, number> = {
    enterprise: 15,
    large: 12,
    medium: 10,
    small: 7,
    startup: 5,
  };

  return (
    sizeMap[size.toLowerCase()] ||
    Object.entries(sizeMap).find(([key]) =>
      size.toLowerCase().includes(key)
    )?.[1] ||
    0
  );
}

// Lead quality tiers
export function getLeadTier(score: number): {
  tier: 'hot' | 'warm' | 'cold';
  priority: 'high' | 'medium' | 'low';
  sla: number; // Response time SLA in minutes
} {
  if (score >= 80) {
    return { tier: 'hot', priority: 'high', sla: 5 }; // 5 min SLA
  }
  if (score >= 60) {
    return { tier: 'warm', priority: 'medium', sla: 30 }; // 30 min SLA
  }
  return { tier: 'cold', priority: 'low', sla: 120 }; // 2 hour SLA
}

// Scoring decay (leads get stale over time)
export function applyTimeDecay(score: number, daysSinceCreated: number): number {
  if (daysSinceCreated <= 1) return score; // No decay for fresh leads
  if (daysSinceCreated <= 7) return score * 0.95; // 5% decay after 1 week
  if (daysSinceCreated <= 30) return score * 0.85; // 15% decay after 1 month
  return score * 0.7; // 30% decay after 30 days
}

// Re-score all leads (batch operation)
export async function rescoreAllLeads(leads: DomainLead[]): Promise<{ id: string; newScore: number }[]> {
  return leads.map((lead) => ({
    id: lead.id,
    newScore: calculateLeadScore(lead),
  }));
}
