import {
  formatRelativeTime,
  formatPoints,
  formatCommentCount,
  extractDomain,
} from '../../utils/formatTime';

describe('formatTime utilities', () => {
  describe('formatRelativeTime', () => {
    const now = Date.now();
    const nowInSeconds = Math.floor(now / 1000);

    it('should return "just now" for recent timestamps', () => {
      expect(formatRelativeTime(nowInSeconds)).toBe('just now');
      expect(formatRelativeTime(nowInSeconds - 30)).toBe('just now');
    });

    it('should format minutes correctly', () => {
      expect(formatRelativeTime(nowInSeconds - 60)).toBe('1 minute ago');
      expect(formatRelativeTime(nowInSeconds - 120)).toBe('2 minutes ago');
      expect(formatRelativeTime(nowInSeconds - 1800)).toBe('30 minutes ago');
    });

    it('should format hours correctly', () => {
      expect(formatRelativeTime(nowInSeconds - 3600)).toBe('1 hour ago');
      expect(formatRelativeTime(nowInSeconds - 7200)).toBe('2 hours ago');
      expect(formatRelativeTime(nowInSeconds - 36000)).toBe('10 hours ago');
    });

    it('should format days correctly', () => {
      expect(formatRelativeTime(nowInSeconds - 86400)).toBe('1 day ago');
      expect(formatRelativeTime(nowInSeconds - 172800)).toBe('2 days ago');
      expect(formatRelativeTime(nowInSeconds - 604800)).toBe('7 days ago');
    });

    it('should format months correctly', () => {
      expect(formatRelativeTime(nowInSeconds - 2592000)).toBe('1 month ago');
      expect(formatRelativeTime(nowInSeconds - 5184000)).toBe('2 months ago');
    });

    it('should format years correctly', () => {
      expect(formatRelativeTime(nowInSeconds - 31536000)).toBe('1 year ago');
      expect(formatRelativeTime(nowInSeconds - 63072000)).toBe('2 years ago');
    });
  });

  describe('formatPoints', () => {
    it('should format single point correctly', () => {
      expect(formatPoints(1)).toBe('1 point');
    });

    it('should format multiple points correctly', () => {
      expect(formatPoints(0)).toBe('0 points');
      expect(formatPoints(42)).toBe('42 points');
      expect(formatPoints(1000)).toBe('1000 points');
    });
  });

  describe('formatCommentCount', () => {
    it('should return "discuss" for zero comments', () => {
      expect(formatCommentCount(0)).toBe('discuss');
    });

    it('should format single comment correctly', () => {
      expect(formatCommentCount(1)).toBe('1 comment');
    });

    it('should format multiple comments correctly', () => {
      expect(formatCommentCount(2)).toBe('2 comments');
      expect(formatCommentCount(42)).toBe('42 comments');
      expect(formatCommentCount(500)).toBe('500 comments');
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from various URLs', () => {
      expect(extractDomain('https://www.example.com')).toBe('example.com');
      expect(extractDomain('https://example.com/path/to/page')).toBe(
        'example.com'
      );
      expect(extractDomain('http://subdomain.example.com')).toBe(
        'subdomain.example.com'
      );
      expect(extractDomain('https://news.ycombinator.com/item?id=123')).toBe(
        'news.ycombinator.com'
      );
    });

    it('should handle invalid URLs', () => {
      expect(extractDomain('not a url')).toBe('');
      expect(extractDomain('')).toBe('');
    });
  });
});
