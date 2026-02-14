// API Route: /api/templates
// Get templates with filtering

import { NextRequest, NextResponse } from 'next/server';
import { TemplateService } from '@/services/template.service';
import { TemplateFilter, TemplateCategory } from '@/types';

/**
 * GET /api/templates
 * List templates with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filter: TemplateFilter = {
      category: searchParams.get('category') as TemplateCategory | undefined,
      plan: searchParams.get('plan') as any,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      search: searchParams.get('search') || undefined,
    };

    // Remove undefined values
    Object.keys(filter).forEach(
      (key) => filter[key as keyof TemplateFilter] === undefined && delete filter[key as keyof TemplateFilter]
    );

    const templates = await TemplateService.getTemplates(
      Object.keys(filter).length > 0 ? filter : undefined
    );

    return NextResponse.json(templates);
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
