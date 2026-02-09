import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Page, PageFormData, PageStatus } from '@/features/page-builder/types';
import slugify from 'slugify';

// Create new page
export const createPage = async (
  ownerId: string,
  data: PageFormData
): Promise<string> => {
  try {
    const slug = slugify(data.title, { lower: true, strict: true });

    const pageData = {
      ...data,
      slug,
      ownerId,
      status: 'draft' as PageStatus,
      planType: 'free',
      views: 0,
      sections: [],
      design: {
        primaryColor: '#22c55e',
        secondaryColor: '#78716c',
        fontPair: 'Inter',
        borderRadius: '8px',
        shadows: true,
        containerWidth: '1200px',
        theme: 'light',
      },
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'pages'), pageData);
    return docRef.id;
  } catch (error: any) {
    console.error('Create page error:', error);
    throw new Error(error.message || 'Failed to create page');
  }
};

// Get page by ID
export const getPageById = async (pageId: string): Promise<Page | null> => {
  try {
    const pageDoc = await getDoc(doc(db, 'pages', pageId));

    if (!pageDoc.exists()) {
      return null;
    }

    const data = pageDoc.data();
    return {
      id: pageDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate(),
    } as Page;
  } catch (error: any) {
    console.error('Get page error:', error);
    return null;
  }
};

// Get page by slug
export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  try {
    const q = query(
      collection(db, 'pages'),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const pageDoc = snapshot.docs[0];
    const data = pageDoc.data();

    return {
      id: pageDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      publishedAt: data.publishedAt?.toDate(),
    } as Page;
  } catch (error: any) {
    console.error('Get page by slug error:', error);
    return null;
  }
};

// Update page
export const updatePage = async (
  pageId: string,
  data: Partial<Page>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'pages', pageId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Update page error:', error);
    throw new Error(error.message || 'Failed to update page');
  }
};

// Delete page
export const deletePage = async (pageId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'pages', pageId));
  } catch (error: any) {
    console.error('Delete page error:', error);
    throw new Error(error.message || 'Failed to delete page');
  }
};

// Submit page for review
export const submitPageForReview = async (pageId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'pages', pageId), {
      status: 'submitted',
      submittedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Submit page error:', error);
    throw new Error(error.message || 'Failed to submit page');
  }
};

// Publish page (admin only)
export const publishPage = async (pageId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'pages', pageId), {
      status: 'published',
      publishedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Publish page error:', error);
    throw new Error(error.message || 'Failed to publish page');
  }
};

// Reject page (admin only)
export const rejectPage = async (
  pageId: string,
  reason: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'pages', pageId), {
      status: 'rejected',
      rejectedAt: serverTimestamp(),
      rejectionReason: reason,
    });
  } catch (error: any) {
    console.error('Reject page error:', error);
    throw new Error(error.message || 'Failed to reject page');
  }
};

// Unpublish page
export const unpublishPage = async (pageId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'pages', pageId), {
      status: 'unpublished',
      unpublishedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Unpublish page error:', error);
    throw new Error(error.message || 'Failed to unpublish page');
  }
};

// Increment page views
export const incrementPageViews = async (pageId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'pages', pageId), {
      views: increment(1),
    });
  } catch (error: any) {
    console.error('Increment views error:', error);
    // Don't throw error for analytics failures
  }
};

// Get user's pages
export const getUserPages = async (userId: string): Promise<Page[]> => {
  try {
    const q = query(
      collection(db, 'pages'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate(),
      } as Page;
    });
  } catch (error: any) {
    console.error('Get user pages error:', error);
    return [];
  }
};

// Get published pages
export const getPublishedPages = async (limitCount = 20): Promise<Page[]> => {
  try {
    const q = query(
      collection(db, 'pages'),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate(),
      } as Page;
    });
  } catch (error: any) {
    console.error('Get published pages error:', error);
    return [];
  }
};

// Get pages by category
export const getPagesByCategory = async (
  category: string,
  limitCount = 20
): Promise<Page[]> => {
  try {
    const q = query(
      collection(db, 'pages'),
      where('status', '==', 'published'),
      where('category', '==', category),
      orderBy('views', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate(),
      } as Page;
    });
  } catch (error: any) {
    console.error('Get pages by category error:', error);
    return [];
  }
};
