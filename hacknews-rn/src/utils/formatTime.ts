/**
 * Format Unix timestamp to relative time string
 * e.g., "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(unixTime: number): string {
  const now = Date.now();
  const timestampMs = unixTime * 1000; // Convert to milliseconds
  const diffMs = now - timestampMs;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
  } else {
    return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
  }
}

/**
 * Format points count
 */
export function formatPoints(points: number): string {
  if (points === 1) return '1 point';
  return `${points} points`;
}

/**
 * Format comment count
 */
export function formatCommentCount(count: number): string {
  if (count === 0) return 'discuss';
  if (count === 1) return '1 comment';
  return `${count} comments`;
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}
