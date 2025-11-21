/**
 * Parse and sanitize HTML for safe rendering
 * Allows only a subset of safe HTML tags
 */

const ALLOWED_TAGS = ['p', 'a', 'i', 'b', 'em', 'strong', 'code', 'pre', 'br'];
// const ALLOWED_ATTRIBUTES = ['href']; // For future HTML rendering

/**
 * Strip HTML tags except allowed ones
 * This is a basic implementation - in production, use a proper HTML sanitizer library
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Decode HTML entities
  let decoded = html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Convert <p> tags to line breaks for simplicity
  decoded = decoded.replace(/<p>/gi, '\n').replace(/<\/p>/gi, '\n');

  // Remove all HTML tags except allowed ones
  // This is a simplified approach - production should use a proper library
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

  const sanitized = decoded.replace(tagRegex, (match, tagName) => {
    if (ALLOWED_TAGS.includes(tagName.toLowerCase())) {
      return match;
    }
    return '';
  });

  // Clean up multiple consecutive line breaks
  return sanitized.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Extract text content from HTML (strip all tags)
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Check if string contains HTML
 */
export function containsHtml(str: string): boolean {
  return /<[^>]*>/g.test(str);
}
