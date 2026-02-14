// API Route: /api/pages
// Handle page CRUD operations

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { PageService } from '@/services/page.service';
import { UserService } from '@/services/user.service';
import { PageCreateInput } from '@/types';
import { initAdmin } from '@/lib/firebase/admin';

initAdmin();

/**
 * GET /api/pages
 * List user's pages with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await PageService.getPagesByOwner(decodedToken.uid, {
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pages
 * Create a new page
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const user = await UserService.getUserById(decodedToken.uid);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body: PageCreateInput = await request.json();

    // Validate input
    if (!body.title || !body.templateId) {
      return NextResponse.json(
        { error: 'Title and templateId are required' },
        { status: 400 }
      );
    }

    // Check plan limits
    // TODO: Implement plan-based page limits

    const pageId = await PageService.createPage(
      user.uid,
      user.email,
      user.displayName,
      body
    );

    // Increment user's page count
    await UserService.incrementPageCount(user.uid, false);

    return NextResponse.json(
      { success: true, pageId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create page' },
      { status: 500 }
    );
  }
}
