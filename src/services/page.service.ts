// Page Service - Firebase operations for page management
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  serverTimestamp,
  increment,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import {
  Page,
  PageCreateInput,
  PageUpdateInput,
  PagePublishInput,
  PageRevision,
  PaginationParams,
  PaginationResponse,
} from '@/types';
import { sanitizeSlug, generateUniqueSlug } from '@/lib/utils/slug';

export class PageService {
  /**
   * Create a new page
   */
  static async createPage(
    userId: string,
    userEmail: string,
    userName: string,
    input: PageCreateInput
  ): Promise<string> {
    const pagesRef = collection(db, COLLECTIONS.PAGES);
    const newPageRef = doc(pagesRef);

    // Generate unique slug
    const slug = input.slug
      ? await generateUniqueSlug(sanitizeSlug(input.slug))
      : await generateUniqueSlug(sanitizeSlug(input.title));

    const pageData: Omit<Page, 'id'> = {
      ownerId: userId,
      ownerEmail: userEmail,
      ownerName: userName,
      title: input.title,
      slug,
      status: 'draft',
      templateId: input.templateId,
      templateName: '', // Will be filled from template
      seo: {
        title: input.title,
        description: '',
        keywords: [],
      },
      contentSchema: {
        version: '1.0',
        sections: [],
        globalStyles: {
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            accent: '#28a745',
            text: '#212529',
            background: '#ffffff',
          },
          typography: {
            fontFamily: 'Inter, sans-serif',
            baseFontSize: '16px',
          },
          spacing: {
            base: '1rem',
          },
          borderRadius: '8px',
        },
        metadata: {
          lastEditedAt: Date.now(),
          lastEditedBy: userId,
        },
      },
      analytics: {
        views: 0,
        uniqueVisitors: 0,
      },
      version: 1,
      isPublic: false,
      removeBranding: false,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };

    await setDoc(newPageRef, pageData);
    return newPageRef.id;
  }

  /**
   * Get page by ID
   */
  static async getPageById(pageId: string): Promise<Page | null> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    const pageSnap = await getDoc(pageRef);

    if (!pageSnap.exists()) {
      return null;
    }

    return { id: pageSnap.id, ...pageSnap.data() } as Page;
  }

  /**
   * Get page by slug
   */
  static async getPageBySlug(slug: string): Promise<Page | null> {
    const pagesRef = collection(db, COLLECTIONS.PAGES);
    const q = query(
      pagesRef,
      where('slug', '==', slug),
      where('status', '==', 'published')
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Page;
  }

  /**
   * Get pages by owner with pagination
   */
  static async getPagesByOwner(
    ownerId: string,
    params: PaginationParams,
    lastDoc?: DocumentSnapshot
  ): Promise<PaginationResponse<Page>> {
    const pagesRef = collection(db, COLLECTIONS.PAGES);
    
    let q = query(
      pagesRef,
      where('ownerId', '==', ownerId),
      orderBy(params.orderBy || 'updatedAt', params.order || 'desc'),
      limit(params.limit)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const pages = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Page)
    );

    return {
      data: pages,
      total: pages.length, // Would need separate count query for true total
      page: params.page,
      limit: params.limit,
      hasMore: pages.length === params.limit,
    };
  }

  /**
   * Update page
   */
  static async updatePage(
    pageId: string,
    update: PageUpdateInput
  ): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    const page = await this.getPageById(pageId);
    
    if (!page) throw new Error('Page not found');

    await updateDoc(pageRef, {
      ...update,
      version: increment(1),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Publish page
   */
  static async publishPage(
    pageId: string,
    publishData: PagePublishInput
  ): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    
    await updateDoc(pageRef, {
      slug: sanitizeSlug(publishData.slug),
      seo: publishData.seo,
      status: 'pending', // Requires admin approval
      isPublic: true,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Approve page (admin only)
   */
  static async approvePage(pageId: string): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    
    await updateDoc(pageRef, {
      status: 'published',
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Reject page (admin only)
   */
  static async rejectPage(
    pageId: string,
    reason: string
  ): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    
    await updateDoc(pageRef, {
      status: 'rejected',
      rejectionReason: reason,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Unpublish page
   */
  static async unpublishPage(pageId: string): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    
    await updateDoc(pageRef, {
      status: 'draft',
      isPublic: false,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Delete page
   */
  static async deletePage(pageId: string): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    await deleteDoc(pageRef);
  }

  /**
   * Create revision
   */
  static async createRevision(
    pageId: string,
    userId: string,
    page: Page,
    description?: string
  ): Promise<string> {
    const revisionsRef = collection(db, COLLECTIONS.REVISIONS);
    const newRevisionRef = doc(revisionsRef);

    const revisionData: Omit<PageRevision, 'id'> = {
      pageId,
      contentSchema: page.contentSchema,
      seo: page.seo,
      timestamp: serverTimestamp() as any,
      createdBy: userId,
      version: page.version,
      changeDescription: description,
    };

    await setDoc(newRevisionRef, revisionData);
    return newRevisionRef.id;
  }

  /**
   * Increment view count
   */
  static async incrementViews(pageId: string): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    
    await updateDoc(pageRef, {
      'analytics.views': increment(1),
      'analytics.lastViewedAt': serverTimestamp(),
    });
  }
}
