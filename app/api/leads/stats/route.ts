import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api-response';

// GET /api/leads/stats - Get lead generation statistics
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    if (!hasPermission(user.role, 'leads', 'read')) {
      return forbiddenResponse();
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Overall stats
    const overallStats = await query(`
      SELECT
        COUNT(*) as total_leads,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
        COUNT(CASE WHEN status = 'enriched' THEN 1 END) as enriched_leads,
        COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_leads,
        AVG(lead_score) as avg_score,
        COUNT(CASE WHEN lead_score >= 70 THEN 1 END) as high_value_leads
      FROM domain_leads
    `);

    // Daily stats for chart
    const dailyStats = await query(`
      SELECT
        DATE(scraped_date) as date,
        COUNT(*) as total,
        COUNT(CASE WHEN lead_score >= 70 THEN 1 END) as high_value,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
        AVG(lead_score) as avg_score
      FROM domain_leads
      WHERE scraped_date >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(scraped_date)
      ORDER BY date DESC
    `);

    // Top tech stacks
    const techStacks = await query(`
      SELECT
        tech_stack->>'cms' as cms,
        COUNT(*) as count,
        AVG(lead_score) as avg_score
      FROM domain_leads
      WHERE tech_stack IS NOT NULL AND tech_stack->>'cms' IS NOT NULL
      GROUP BY tech_stack->>'cms'
      ORDER BY count DESC
      LIMIT 10
    `);

    // Top countries
    const countries = await query(`
      SELECT
        whois_data->>'registrantCountry' as country,
        COUNT(*) as count,
        AVG(lead_score) as avg_score
      FROM domain_leads
      WHERE whois_data IS NOT NULL AND whois_data->>'registrantCountry' IS NOT NULL
      GROUP BY whois_data->>'registrantCountry'
      ORDER BY count DESC
      LIMIT 10
    `);

    // Score distribution
    const scoreDistribution = await query(`
      SELECT
        CASE
          WHEN lead_score >= 80 THEN 'excellent'
          WHEN lead_score >= 60 THEN 'good'
          WHEN lead_score >= 40 THEN 'fair'
          WHEN lead_score >= 20 THEN 'low'
          ELSE 'very_low'
        END as tier,
        COUNT(*) as count
      FROM domain_leads
      GROUP BY tier
      ORDER BY
        CASE tier
          WHEN 'excellent' THEN 1
          WHEN 'good' THEN 2
          WHEN 'fair' THEN 3
          WHEN 'low' THEN 4
          ELSE 5
        END
    `);

    // Active campaigns
    const activeCampaigns = await query(`
      SELECT
        c.id,
        c.name,
        c.status,
        COUNT(dl.id) as lead_count,
        AVG(dl.lead_score) as avg_score
      FROM lead_gen_campaigns c
      LEFT JOIN domain_leads dl ON dl.campaign_id = c.id
      WHERE c.status IN ('active', 'draft')
      GROUP BY c.id, c.name, c.status
      ORDER BY lead_count DESC
      LIMIT 5
    `);

    // Conversion funnel
    const stats = overallStats[0];
    const conversionFunnel = {
      total: parseInt(stats.total_leads) || 0,
      enriched: parseInt(stats.enriched_leads) || 0,
      qualified: parseInt(stats.qualified_leads) || 0,
      contacted: parseInt(stats.contacted_leads) || 0,
      converted: parseInt(stats.converted_leads) || 0,
      rates: {
        enrichment: stats.total_leads > 0 ?
          ((parseInt(stats.enriched_leads) / parseInt(stats.total_leads)) * 100).toFixed(1) : 0,
        qualification: stats.enriched_leads > 0 ?
          ((parseInt(stats.qualified_leads) / parseInt(stats.enriched_leads)) * 100).toFixed(1) : 0,
        contact: stats.qualified_leads > 0 ?
          ((parseInt(stats.contacted_leads) / parseInt(stats.qualified_leads)) * 100).toFixed(1) : 0,
        conversion: stats.contacted_leads > 0 ?
          ((parseInt(stats.converted_leads) / parseInt(stats.contacted_leads)) * 100).toFixed(1) : 0,
      },
    };

    return successResponse({
      overview: {
        totalLeads: parseInt(stats.total_leads) || 0,
        newLeads: parseInt(stats.new_leads) || 0,
        enrichedLeads: parseInt(stats.enriched_leads) || 0,
        qualifiedLeads: parseInt(stats.qualified_leads) || 0,
        contactedLeads: parseInt(stats.contacted_leads) || 0,
        convertedLeads: parseInt(stats.converted_leads) || 0,
        rejectedLeads: parseInt(stats.rejected_leads) || 0,
        avgScore: parseFloat(stats.avg_score) || 0,
        highValueLeads: parseInt(stats.high_value_leads) || 0,
      },
      dailyStats,
      techStacks,
      countries,
      scoreDistribution,
      activeCampaigns,
      conversionFunnel,
    });
  } catch (error: any) {
    console.error('Get lead stats error:', error);
    return errorResponse(error.message || 'Failed to get lead stats', 500);
  }
}
