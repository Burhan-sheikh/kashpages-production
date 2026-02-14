// Slug utility functions
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';

/**
 * Sanitize a string to create a URL-friendly slug
 */
export function sanitizeSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if a slug is already in use
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const pagesRef = collection(db, COLLECTIONS.PAGES);
  const q = query(pagesRef, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

/**
 * Generate a unique slug by appending a number if necessary
 */
export async function generateUniqueSlug(
  baseSlug: string,
  maxAttempts: number = 100
): Promise<string> {
  let slug = baseSlug;
  let attempt = 1;

  while (attempt <= maxAttempts) {
    const available = await isSlugAvailable(slug);
    if (available) {
      return slug;
    }
    slug = `${baseSlug}-${attempt}`;
    attempt++;
  }

  // Fallback with timestamp if max attempts reached
  return `${baseSlug}-${Date.now()}`;
}

/**
 * Extract username from page slug
 */
export function extractUsername(fullSlug: string): string {
  // Format: username/pages/page-slug
  const parts = fullSlug.split('/');
  return parts[0] || '';
}

/**
 * Extract page slug from full path
 */
export function extractPageSlug(fullSlug: string): string {
  // Format: username/pages/page-slug
  const parts = fullSlug.split('/');
  return parts[2] || '';
}

/**
 * Build full page URL
 */
export function buildPageUrl(username: string, slug: string): string {
  return `/${username}/pages/${slug}`;
}
