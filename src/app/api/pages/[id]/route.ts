// API Route: /api/pages/[id]
// Handle single page operations

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { PageService } from '@/services/page.service';
import { PageUpdateInput } from '@/types';
import { initAdmin } from '@/lib/firebase/admin';

initAdmin();

/**
 * GET /api/pages/[id]
 * Get single page by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const page = await PageService.getPageById(params.id);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check ownership or admin
    if (page.ownerId !== decodedToken.uid) {
      // TODO: Check if user is admin
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(page);
  } catch (error: any) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/pages/[id]
 * Update page
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const page = await PageService.getPageById(params.id);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check ownership
    if (page.ownerId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const update: PageUpdateInput = await request.json();
    await PageService.updatePage(params.id, update);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update page' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pages/[id]
 * Delete page
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const page = await PageService.getPageById(params.id);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check ownership
    if (page.ownerId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await PageService.deletePage(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete page' },
      { status: 500 }
    );
  }
}
