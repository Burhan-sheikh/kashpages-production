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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/features/discovery/types';
import slugify from 'slugify';

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, 'categories'),
      orderBy('pageCount', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Category;
    });
  } catch (error: any) {
    console.error('Get categories error:', error);
    return [];
  }
};

// Get category by slug
export const getCategoryBySlug = async (
  slug: string
): Promise<Category | null> => {
  try {
    const q = query(
      collection(db, 'categories'),
      where('slug', '==', slug)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const categoryDoc = snapshot.docs[0];
    const data = categoryDoc.data();

    return {
      id: categoryDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Category;
  } catch (error: any) {
    console.error('Get category by slug error:', error);
    return null;
  }
};

// Create category (admin only)
export const createCategory = async (
  name: string,
  description: string,
  icon?: string
): Promise<string> => {
  try {
    const slug = slugify(name, { lower: true, strict: true });

    const categoryData = {
      name,
      slug,
      icon: icon || '📦',
      description,
      parentId: null,
      isHighlighted: false,
      pageCount: 0,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return docRef.id;
  } catch (error: any) {
    console.error('Create category error:', error);
    throw new Error(error.message || 'Failed to create category');
  }
};

// Update category (admin only)
export const updateCategory = async (
  categoryId: string,
  data: Partial<Category>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'categories', categoryId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    throw new Error(error.message || 'Failed to update category');
  }
};

// Delete category (admin only)
export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error: any) {
    console.error('Delete category error:', error);
    throw new Error(error.message || 'Failed to delete category');
  }
};

// Get highlighted categories
export const getHighlightedCategories = async (): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, 'categories'),
      where('isHighlighted', '==', true),
      orderBy('pageCount', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Category;
    });
  } catch (error: any) {
    console.error('Get highlighted categories error:', error);
    return [];
  }
};
