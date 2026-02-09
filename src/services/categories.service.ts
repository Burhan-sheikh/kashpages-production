// Categories Service

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Category } from '@/types/platform';

export class CategoriesService {
  // Get all active categories
  static async getCategories(): Promise<Category[]> {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Category);
  }
  
  // Get category by slug
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where('slug', '==', slug),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    
    return snapshot.docs[0].data() as Category;
  }
}
