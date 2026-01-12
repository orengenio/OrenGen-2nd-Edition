import { NextRequest, NextResponse } from 'next/server';
import {
  createFederalOpportunitiesService,
  getSAMApiKey,
} from '@/lib/services/federal-opportunities-service';

// GET /api/federal/opportunities - Search federal opportunities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const service = createFederalOpportunitiesService(
      getSAMApiKey(),
      'default-tenant' // In production, get from auth context
    );

    const filters = {
      keywords: searchParams.get('keywords') || undefined,
      naics_codes: searchParams.get('naics')?.split(',') || undefined,
      psc_codes: searchParams.get('psc')?.split(',') || undefined,
      agencies: searchParams.get('agencies')?.split(',') || undefined,
      set_asides: searchParams.get('set_asides')?.split(',') || undefined,
      posted_from: searchParams.get('posted_from') || undefined,
      posted_to: searchParams.get('posted_to') || undefined,
      response_deadline_from: searchParams.get('deadline_from') || undefined,
      state: searchParams.get('state') || undefined,
      limit: parseInt(searchParams.get('limit') || '25'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    const results = await service.searchOpportunities(filters);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Federal opportunities search error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/federal/opportunities - Track an opportunity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { opportunityId, status, notes } = body;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID required' },
        { status: 400 }
      );
    }

    const service = createFederalOpportunitiesService(
      getSAMApiKey(),
      'default-tenant'
    );

    await service.trackOpportunity(opportunityId, status || 'watching');

    return NextResponse.json({
      success: true,
      message: 'Opportunity tracked successfully',
    });
  } catch (error: any) {
    console.error('Track opportunity error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
