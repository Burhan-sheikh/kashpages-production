// Content sanitization utilities
// Prevent XSS and script injection in user-generated content

import { ContentElement, Section } from '@/types';

/**
 * Sanitize text content - strip HTML tags and dangerous characters
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframe tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

/**
 * Sanitize URL to prevent XSS
 */
export function sanitizeContentUrl(url: string): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  const dangerous = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lower = trimmed.toLowerCase();

  // Block dangerous protocols
  if (dangerous.some((protocol) => lower.startsWith(protocol))) {
    return null;
  }

  // Validate URL structure
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize element content based on type
 */
export function sanitizeElement(element: ContentElement): ContentElement {
  const sanitized = { ...element };

  switch (element.type) {
    case 'heading':
    case 'paragraph':
      sanitized.content.text = sanitizeText(element.content.text);
      break;

    case 'button':
      sanitized.content.text = sanitizeText(element.content.text);
      const buttonUrl = sanitizeContentUrl(element.content.link);
      sanitized.content.link = buttonUrl || '#';
      break;

    case 'image':
      sanitized.content.alt = sanitizeText(element.content.alt);
      const imageUrl = sanitizeContentUrl(element.content.src);
      sanitized.content.src = imageUrl || '';
      if (element.content.link) {
        const linkUrl = sanitizeContentUrl(element.content.link);
        sanitized.content.link = linkUrl || undefined;
      }
      break;

    case 'video':
      if (element.content.src) {
        const videoUrl = sanitizeContentUrl(element.content.src);
        sanitized.content.src = videoUrl || undefined;
      }
      break;

    case 'form':
      sanitized.content.submitText = sanitizeText(element.content.submitText);
      sanitized.content.successMessage = sanitizeText(element.content.successMessage);
      sanitized.content.fields = element.content.fields.map((field) => ({
        ...field,
        label: sanitizeText(field.label),
        placeholder: field.placeholder ? sanitizeText(field.placeholder) : undefined,
      }));
      break;

    case 'socialLinks':
      sanitized.content.links = element.content.links.map((link) => {
        const url = sanitizeContentUrl(link.url);
        return {
          ...link,
          url: url || '#',
        };
      });
      break;

    case 'list':
      sanitized.content.items = element.content.items.map(sanitizeText);
      break;
  }

  return sanitized;
}

/**
 * Sanitize entire section
 */
export function sanitizeSection(section: Section): Section {
  return {
    ...section,
    name: sanitizeText(section.name),
    elements: section.elements.map(sanitizeElement),
  };
}

/**
 * Validate and sanitize content schema
 */
export function sanitizeContentSchema(sections: Section[]): Section[] {
  return sections.map(sanitizeSection);
}

/**
 * Rate limiting helper - prevents abuse
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];

    // Remove old requests outside window
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}
