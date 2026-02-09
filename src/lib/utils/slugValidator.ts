import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Check if a slug is available for use
 * @param slug The slug to check
 * @returns {Promise<{available: boolean, message: string}>}
 */
export async function checkSlugAvailability(slug: string): Promise<{
  available: boolean;
  message: string;
}> {
  // Validate slug format
  if (!slug || slug.trim().length === 0) {
    return {
      available: false,
      message: 'Slug cannot be empty',
    };
  }

  // Check slug format (lowercase, alphanumeric, hyphens only)
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    return {
      available: false,
      message: 'Slug must be lowercase letters, numbers, and hyphens only',
    };
  }

  // Check min/max length
  if (slug.length < 3) {
    return {
      available: false,
      message: 'Slug must be at least 3 characters',
    };
  }

  if (slug.length > 50) {
    return {
      available: false,
      message: 'Slug must be less than 50 characters',
    };
  }

  // Reserved slugs (system routes)
  const reservedSlugs = [
    'admin',
    'dashboard',
    'auth',
    'api',
    'explore',
    'templates',
    'category',
    'location',
    'pricing',
    'about',
    'contact',
    'help',
    'support',
    'terms',
    'privacy',
    'settings',
    'signin',
    'signup',
    'login',
    'logout',
    'register',
  ];

  if (reservedSlugs.includes(slug)) {
    return {
      available: false,
      message: 'This slug is reserved by the system. Please choose another.',
    };
  }

  try {
    // Check if slug already exists in database
    const pagesRef = collection(db, 'pages');
    const q = query(pagesRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        available: false,
        message: 'This slug is already taken. Please try a different one.',
      };
    }

    return {
      available: true,
      message: 'Slug is available!',
    };
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return {
      available: false,
      message: 'Error checking availability. Please try again.',
    };
  }
}

/**
 * Generate a slug from a title
 * @param title The title to convert to slug
 * @returns {string} The generated slug
 */
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Suggest alternative slugs if the original is taken
 * @param baseSlug The base slug to generate alternatives from
 * @returns {Promise<string[]>} Array of alternative slug suggestions
 */
export async function suggestAlternativeSlugs(
  baseSlug: string
): Promise<string[]> {
  const suggestions: string[] = [];
  const timestamp = Date.now().toString().slice(-6);

  // Generate 3 alternatives
  suggestions.push(`${baseSlug}-${timestamp}`);
  suggestions.push(`${baseSlug}-${Math.floor(Math.random() * 999)}`);
  suggestions.push(`${baseSlug}-page`);

  // Check availability of suggestions
  const availableSuggestions: string[] = [];

  for (const suggestion of suggestions) {
    const result = await checkSlugAvailability(suggestion);
    if (result.available) {
      availableSuggestions.push(suggestion);
    }
  }

  return availableSuggestions;
}
