import { NextRequest } from 'next/server';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';
import { leadEnrichmentService } from '@/lib/services/lead-enrichment';

// GET /api/leads/enrichment-status - Get enrichment service status and API credits
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'read')) {
      return forbiddenResponse();
    }

    const serviceStatus = await leadEnrichmentService.getServiceStatus();

    // Add recommendations based on status
    const recommendations: string[] = [];

    if (!serviceStatus.whois.configured) {
      recommendations.push('Configure WHOXY_API_KEY for WHOIS enrichment');
    } else if (serviceStatus.whois.balance !== undefined && serviceStatus.whois.balance < 100) {
      recommendations.push(`Low WHOIS credits: ${serviceStatus.whois.balance} remaining`);
    }

    if (!serviceStatus.hunter.configured) {
      recommendations.push('Configure HUNTER_API_KEY for email discovery');
    } else if (serviceStatus.hunter.requestsAvailable !== undefined && serviceStatus.hunter.requestsAvailable < 50) {
      recommendations.push(`Low Hunter.io credits: ${serviceStatus.hunter.requestsAvailable} remaining`);
    }

    if (!serviceStatus.snov.configured) {
      recommendations.push('Configure SNOV_CLIENT_ID and SNOV_CLIENT_SECRET for additional email discovery');
    } else if (serviceStatus.snov.balance !== undefined && serviceStatus.snov.balance < 50) {
      recommendations.push(`Low Snov.io credits: ${serviceStatus.snov.balance} remaining`);
    }

    // Calculate overall health
    const configuredCount = [
      serviceStatus.whois.configured,
      serviceStatus.hunter.configured,
      serviceStatus.snov.configured,
      serviceStatus.techStack.configured,
    ].filter(Boolean).length;

    let health: 'excellent' | 'good' | 'fair' | 'poor';
    if (configuredCount >= 4) {
      health = 'excellent';
    } else if (configuredCount >= 3) {
      health = 'good';
    } else if (configuredCount >= 2) {
      health = 'fair';
    } else {
      health = 'poor';
    }

    return successResponse({
      services: serviceStatus,
      health,
      configuredCount,
      totalServices: 4,
      recommendations,
      envVarsNeeded: {
        whois: 'WHOXY_API_KEY',
        hunter: 'HUNTER_API_KEY',
        snov: ['SNOV_CLIENT_ID', 'SNOV_CLIENT_SECRET'],
      },
    });
  } catch (error: any) {
    console.error('Get enrichment status error:', error);
    return errorResponse(error.message || 'Failed to get enrichment status', 500);
  }
}
