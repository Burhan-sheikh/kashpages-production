// Pages Service - Handle all page operations

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { PageDocument, PageStatus, PlanType } from '@/types/platform';

export class PagesService {
  // Create new page
  static async createPage(userId: string, data: Partial<PageDocument>): Promise<string> {
    const pageRef = doc(collection(db, COLLECTIONS.PAGES));
    
    const newPage: PageDocument = {
      id: pageRef.id,
      ownerId: userId,
      ownerName: data.ownerName || '',
      title: data.title || 'Untitled Page',
      slug: data.slug || '',
      description: data.description || '',
      thumbnail: null,
      category: data.category || 'general',
      subCategory: null,
      tags: [],
      address: data.address || {
        addressLine1: '',
        addressLine2: null,
        city: '',
        district: '',
        state: 'Jammu and Kashmir',
        postalCode: null,
        country: 'India',
      },
      contact: data.contact || {
        phone: null,
        whatsapp: null,
        email: null,
        website: null,
        socialLinks: {
          facebook: null,
          instagram: null,
          youtube: null,
          twitter: null,
          linkedin: null,
        },
      },
      workingHours: null,
      sections: data.sections || [],
      design: data.design || {
        theme: 'light',
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#f59e0b',
          background: '#ffffff',
          text: '#1e293b',
        },
        typography: {
          headingFont: 'Inter',
          bodyFont: 'Inter',
          fontSize: 'medium',
        },
        layout: {
          containerWidth: 'medium',
          borderRadius: 'medium',
          spacing: 'normal',
        },
        effects: {
          shadows: true,
          animations: true,
          gradients: false,
        },
      },
      status: PageStatus.DRAFT,
      planType: PlanType.FREE,
      rejectionReason: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      publishedAt: null,
      submittedAt: null,
      views: 0,
      clicks: 0,
      calls: 0,
      isFeatured: false,
      isVerified: false,
      isTrending: false,
      seo: {
        title: data.title || 'Untitled Page',
        description: data.description || '',
        keywords: [],
        ogImage: null,
      },
    };
    
    await setDoc(pageRef, newPage);
    return pageRef.id;
  }
  
  // Get page by ID
  static async getPage(pageId: string): Promise<PageDocument | null> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    const pageSnap = await getDoc(pageRef);
    
    if (!pageSnap.exists()) return null;
    return pageSnap.data() as PageDocument;
  }
  
  // Get pages by user
  static async getUserPages(userId: string): Promise<PageDocument[]> {
    const q = query(
      collection(db, COLLECTIONS.PAGES),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as PageDocument);
  }
  
  // Update page
  static async updatePage(pageId: string, data: Partial<PageDocument>): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    await updateDoc(pageRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }
  
  // Submit page for review
  static async submitPage(pageId: string): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    await updateDoc(pageRef, {
      status: PageStatus.SUBMITTED,
      submittedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
  
  // Publish page (admin)
  static async publishPage(pageId: string): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    await updateDoc(pageRef, {
      status: PageStatus.PUBLISHED,
      publishedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
  
  // Reject page (admin)
  static async rejectPage(pageId: string, reason: string): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    await updateDoc(pageRef, {
      status: PageStatus.REJECTED,
      rejectionReason: reason,
      updatedAt: Timestamp.now(),
    });
  }
  
  // Delete page
  static async deletePage(pageId: string): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    await deleteDoc(pageRef);
  }
  
  // Increment page view
  static async incrementViews(pageId: string): Promise<void> {
    const pageRef = doc(db, COLLECTIONS.PAGES, pageId);
    await updateDoc(pageRef, {
      views: increment(1),
    });
  }
  
  // Get published pages
  static async getPublishedPages(limitCount = 20): Promise<PageDocument[]> {
    const q = query(
      collection(db, COLLECTIONS.PAGES),
      where('status', '==', PageStatus.PUBLISHED),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as PageDocument);
  }
  
  // Get featured pages
  static async getFeaturedPages(limitCount = 10): Promise<PageDocument[]> {
    const q = query(
      collection(db, COLLECTIONS.PAGES),
      where('status', '==', PageStatus.PUBLISHED),
      where('isFeatured', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as PageDocument);
  }
  
  // Search pages
  static async searchPages(searchTerm: string): Promise<PageDocument[]> {
    // This is a basic implementation
    // For production, use Algolia or similar
    const q = query(
      collection(db, COLLECTIONS.PAGES),
      where('status', '==', PageStatus.PUBLISHED)
    );
    
    const snapshot = await getDocs(q);
    const pages = snapshot.docs.map(doc => doc.data() as PageDocument);
    
    return pages.filter(page => 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
}
