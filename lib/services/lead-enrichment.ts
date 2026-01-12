// Main Lead Enrichment Service
// Orchestrates all enrichment services

import { DomainLead, WhoisData, TechStack, EnrichmentData } from '@/crm/types';
import { whoisService } from './whois-service';
import { hunterService } from './hunter-service';
import { snovService } from './snov-service';
import { techStackService } from './tech-stack-service';
import { leadScoringService, ScoreBreakdown } from './lead-scoring';

export interface EnrichmentResult {
  whoisData: WhoisData | null;
  techStack: TechStack | null;
  enrichmentData: EnrichmentData | null;
  score: ScoreBreakdown;
  errors: string[];
}

export interface EnrichmentOptions {
  skipWhois?: boolean;
  skipTechStack?: boolean;
  skipEmailFinder?: boolean;
  preferredEmailSource?: 'hunter' | 'snov' | 'both';
  maxEmails?: number;
}

export class LeadEnrichmentService {
  async enrichDomain(
    domain: string,
    options: EnrichmentOptions = {}
  ): Promise<EnrichmentResult> {
    const errors: string[] = [];
    let whoisData: WhoisData | null = null;
    let techStack: TechStack | null = null;
    let enrichmentData: EnrichmentData | null = null;

    // Clean domain
    const cleanDomain = this.cleanDomain(domain);

    // Run enrichment tasks in parallel where possible
    const tasks: Promise<void>[] = [];

    // WHOIS lookup
    if (!options.skipWhois) {
      tasks.push(
        (async () => {
          try {
            whoisData = await whoisService.lookupDomain(cleanDomain);
            if (!whoisData) {
              errors.push('WHOIS lookup returned no data');
            }
          } catch (error: any) {
            errors.push(`WHOIS error: ${error.message}`);
          }
        })()
      );
    }

    // Tech stack detection
    if (!options.skipTechStack) {
      tasks.push(
        (async () => {
          try {
            techStack = await techStackService.detectTechStack(cleanDomain);
            if (!techStack) {
              errors.push('Tech stack detection failed (site may be offline)');
            }
          } catch (error: any) {
            errors.push(`Tech stack error: ${error.message}`);
          }
        })()
      );
    }

    // Wait for parallel tasks
    await Promise.all(tasks);

    // Email finding (runs after other data is collected for better results)
    if (!options.skipEmailFinder) {
      try {
        enrichmentData = await this.findEmails(
          cleanDomain,
          options.preferredEmailSource || 'both',
          options.maxEmails || 5
        );
      } catch (error: any) {
        errors.push(`Email finder error: ${error.message}`);
      }
    }

    // Calculate score
    const score = leadScoringService.calculateScore({
      domain: cleanDomain,
      whoisData: whoisData || undefined,
      techStack: techStack || undefined,
      enrichmentData: enrichmentData || undefined,
      registeredDate: whoisData?.registrationDate,
    });

    return {
      whoisData,
      techStack,
      enrichmentData,
      score,
      errors,
    };
  }

  async findEmails(
    domain: string,
    source: 'hunter' | 'snov' | 'both',
    maxEmails: number = 5
  ): Promise<EnrichmentData | null> {
    const emails: string[] = [];
    const phones: string[] = [];
    const socialMedia: EnrichmentData['socialMedia'] = {};
    let industry: string | undefined;
    let companySize: string | undefined;
    let enrichSource: 'hunter' | 'snov' | 'manual' | 'whoxy' = 'hunter';

    // Try Hunter.io first
    if (source === 'hunter' || source === 'both') {
      if (hunterService.isConfigured()) {
        const hunterResult = await hunterService.searchDomain(domain, maxEmails);

        if (hunterResult) {
          emails.push(...hunterService.extractEmails(hunterResult).slice(0, maxEmails));
          enrichSource = 'hunter';

          // Extract additional company info
          if (hunterResult.organization) {
            companySize = this.estimateCompanySize(hunterResult.emails.length);
          }
          if (hunterResult.industry) {
            industry = hunterResult.industry;
          }
          if (hunterResult.linkedin) {
            socialMedia.linkedin = hunterResult.linkedin;
          }
          if (hunterResult.twitter) {
            socialMedia.twitter = hunterResult.twitter;
          }
          if (hunterResult.facebook) {
            socialMedia.facebook = hunterResult.facebook;
          }
          if (hunterResult.instagram) {
            socialMedia.instagram = hunterResult.instagram;
          }
        }
      }
    }

    // Try Snov.io if Hunter didn't find enough or we're using both
    if ((source === 'snov' || source === 'both') && emails.length < maxEmails) {
      if (snovService.isConfigured()) {
        const snovResult = await snovService.searchDomain(domain, maxEmails - emails.length);

        if (snovResult) {
          const snovEmails = snovService.extractEmails(snovResult);

          // Add unique emails
          for (const email of snovEmails) {
            if (!emails.includes(email) && emails.length < maxEmails) {
              emails.push(email);
              if (source === 'snov') {
                enrichSource = 'snov';
              }
            }
          }

          if (snovResult.companyName && !companySize) {
            companySize = this.estimateCompanySize(snovResult.emails.length);
          }
        }
      }
    }

    if (emails.length === 0) {
      return null;
    }

    return {
      emails,
      phones,
      socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
      industry,
      companySize,
      enrichedAt: new Date().toISOString(),
      source: enrichSource,
    };
  }

  async verifyEmail(email: string): Promise<{
    valid: boolean;
    score?: number;
    source: string;
  }> {
    // Try Hunter first
    if (hunterService.isConfigured()) {
      const result = await hunterService.verifyEmail(email);
      if (result) {
        return {
          valid: result.status === 'valid',
          score: result.score,
          source: 'hunter',
        };
      }
    }

    // Try Snov
    if (snovService.isConfigured()) {
      const result = await snovService.verifyEmail(email);
      if (result) {
        return {
          valid: result.result === 'valid',
          source: 'snov',
        };
      }
    }

    return {
      valid: false,
      source: 'none',
    };
  }

  async getServiceStatus(): Promise<{
    whois: { configured: boolean; balance?: number };
    hunter: { configured: boolean; requestsAvailable?: number };
    snov: { configured: boolean; balance?: number };
    techStack: { configured: boolean };
  }> {
    const [whoxyBalance, hunterInfo, snovCredits] = await Promise.all([
      whoisService.isConfigured() ? whoisService.getAccountBalance() : null,
      hunterService.isConfigured() ? hunterService.getAccountInfo() : null,
      snovService.isConfigured() ? snovService.getCreditsInfo() : null,
    ]);

    return {
      whois: {
        configured: whoisService.isConfigured(),
        balance: whoxyBalance ?? undefined,
      },
      hunter: {
        configured: hunterService.isConfigured(),
        requestsAvailable: hunterInfo?.requests_available,
      },
      snov: {
        configured: snovService.isConfigured(),
        balance: snovCredits?.balance,
      },
      techStack: {
        configured: true, // Always available (uses scraping)
      },
    };
  }

  private cleanDomain(domain: string): string {
    return domain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '')
      .trim();
  }

  private estimateCompanySize(emailCount: number): string {
    if (emailCount >= 50) return '200+ employees';
    if (emailCount >= 20) return '50-200 employees';
    if (emailCount >= 10) return '10-50 employees';
    if (emailCount >= 5) return '5-10 employees';
    return '1-5 employees';
  }
}

export const leadEnrichmentService = new LeadEnrichmentService();
