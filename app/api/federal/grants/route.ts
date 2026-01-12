import { NextRequest, NextResponse } from 'next/server';
import {
  createFederalOpportunitiesService,
  getSAMApiKey,
} from '@/lib/services/federal-opportunities-service';

// GET /api/federal/grants - Search grants
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get('keywords') || '';
    const limit = parseInt(searchParams.get('limit') || '25');

    const service = createFederalOpportunitiesService(
      getSAMApiKey(),
      'default-tenant'
    );

    const grants = await service.searchGrants(keywords, limit);

    return NextResponse.json({
      success: true,
      data: grants,
      total: grants.length,
    });
  } catch (error: any) {
    console.error('Grants search error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
