import { NextRequest, NextResponse } from 'next/server';
import {
  createFederalOpportunitiesService,
  getSAMApiKey,
} from '@/lib/services/federal-opportunities-service';

// GET /api/federal/opportunities/[id] - Get single opportunity
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const service = createFederalOpportunitiesService(
      getSAMApiKey(),
      'default-tenant'
    );

    const opportunity = await service.getOpportunity(id);

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: opportunity,
    });
  } catch (error: any) {
    console.error('Get opportunity error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
