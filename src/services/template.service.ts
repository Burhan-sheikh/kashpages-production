// Template Service - Firebase operations for template management
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Template, TemplateFilter, TemplateCategory } from '@/types';

export class TemplateService {
  /**
   * Get template by ID
   */
  static async getTemplateById(templateId: string): Promise<Template | null> {
    const templateRef = doc(db, COLLECTIONS.TEMPLATES, templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return null;
    }

    return { id: templateSnap.id, ...templateSnap.data() } as Template;
  }

  /**
   * Get all templates with optional filtering
   */
  static async getTemplates(
    filter?: TemplateFilter
  ): Promise<Template[]> {
    const templatesRef = collection(db, COLLECTIONS.TEMPLATES);
    
    let q = query(
      templatesRef,
      where('isActive', '==', true),
      orderBy('featured', 'desc'),
      orderBy('usageCount', 'desc')
    );

    if (filter?.category) {
      q = query(q, where('category', '==', filter.category));
    }

    if (filter?.plan) {
      q = query(q, where('plan', '==', filter.plan));
    }

    if (filter?.featured !== undefined) {
      q = query(q, where('featured', '==', filter.featured));
    }

    const querySnapshot = await getDocs(q);
    let templates = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Template)
    );

    // Client-side search filter
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    return templates;
  }

  /**
   * Get templates by category
   */
  static async getTemplatesByCategory(
    category: TemplateCategory
  ): Promise<Template[]> {
    return this.getTemplates({ category });
  }

  /**
   * Get featured templates
   */
  static async getFeaturedTemplates(
    limitCount: number = 6
  ): Promise<Template[]> {
    const templatesRef = collection(db, COLLECTIONS.TEMPLATES);
    
    const q = query(
      templatesRef,
      where('featured', '==', true),
      where('isActive', '==', true),
      orderBy('usageCount', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Template)
    );
  }

  /**
   * Increment template usage count
   */
  static async incrementUsageCount(templateId: string): Promise<void> {
    const templateRef = doc(db, COLLECTIONS.TEMPLATES, templateId);
    await updateDoc(templateRef, {
      usageCount: increment(1),
    });
  }

  /**
   * Get template categories with counts
   */
  static async getCategoryCounts(): Promise<
    Record<TemplateCategory, number>
  > {
    const templates = await this.getTemplates();
    
    const counts: Partial<Record<TemplateCategory, number>> = {};
    
    templates.forEach((template) => {
      counts[template.category] = (counts[template.category] || 0) + 1;
    });

    return counts as Record<TemplateCategory, number>;
  }
}
