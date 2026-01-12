import { NextRequest, NextResponse } from 'next/server';
import {
  createFederalOpportunitiesService,
  getSAMApiKey,
} from '@/lib/services/federal-opportunities-service';

// GET /api/federal/spending - Get agency spending data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fiscalYear = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    const service = createFederalOpportunitiesService(
      getSAMApiKey(),
      'default-tenant'
    );

    const spending = await service.getAgencySpending(fiscalYear);

    return NextResponse.json({
      success: true,
      data: spending,
    });
  } catch (error: any) {
    console.error('Agency spending error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
