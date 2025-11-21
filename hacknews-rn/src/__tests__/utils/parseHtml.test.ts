import { sanitizeHtml, stripHtml, containsHtml } from '../../utils/parseHtml';

describe('parseHtml utilities', () => {
  describe('sanitizeHtml', () => {
    it('should handle empty or null input', () => {
      expect(sanitizeHtml('')).toBe('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(sanitizeHtml(null as any)).toBe('');
    });

    it('should decode HTML entities', () => {
      expect(sanitizeHtml('&amp;')).toBe('&');
      expect(sanitizeHtml('&lt;')).toBe('<');
      expect(sanitizeHtml('&gt;')).toBe('>');
      expect(sanitizeHtml('&quot;')).toBe('"');
      expect(sanitizeHtml('&#x27;')).toBe("'");
      expect(sanitizeHtml('&#x2F;')).toBe('/');
    });

    it('should convert paragraph tags to line breaks', () => {
      const input = '<p>First paragraph</p><p>Second paragraph</p>';
      const output = sanitizeHtml(input);
      expect(output).toContain('First paragraph');
      expect(output).toContain('Second paragraph');
    });

    it('should remove disallowed HTML tags', () => {
      const input = '<script>alert("xss")</script><p>Safe content</p>';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('<script>');
      expect(output).not.toContain('</script>');
      expect(output).toContain('Safe content');
    });

    it('should clean up multiple consecutive line breaks', () => {
      const input = 'Line 1\n\n\n\n\nLine 2';
      const output = sanitizeHtml(input);
      expect(output).not.toContain('\n\n\n');
    });

    it('should trim whitespace', () => {
      const input = '   Content with spaces   ';
      const output = sanitizeHtml(input);
      expect(output).toBe('Content with spaces');
    });
  });

  describe('stripHtml', () => {
    it('should handle empty input', () => {
      expect(stripHtml('')).toBe('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(stripHtml(null as any)).toBe('');
    });

    it('should remove all HTML tags', () => {
      expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe(
        'Hello world'
      );
      expect(stripHtml('<a href="#">Link</a>')).toBe('Link');
    });

    it('should decode HTML entities', () => {
      expect(stripHtml('&amp; &lt; &gt;')).toBe('& < >');
    });

    it('should normalize whitespace', () => {
      expect(stripHtml('Hello    world')).toBe('Hello world');
      expect(stripHtml('Hello\n\nworld')).toBe('Hello world');
    });

    it('should handle complex HTML', () => {
      const html = `
        <div>
          <h1>Title</h1>
          <p>Paragraph with <em>emphasis</em> and <strong>bold</strong>.</p>
        </div>
      `;
      const result = stripHtml(html);
      expect(result).toBe('Title Paragraph with emphasis and bold.');
    });
  });

  describe('containsHtml', () => {
    it('should detect HTML tags', () => {
      expect(containsHtml('<p>Hello</p>')).toBe(true);
      expect(containsHtml('Hello <strong>world</strong>')).toBe(true);
      expect(containsHtml('<br/>')).toBe(true);
    });

    it('should return false for plain text', () => {
      expect(containsHtml('Plain text')).toBe(false);
      expect(containsHtml('Text with & special chars')).toBe(false);
    });

    it('should handle empty input', () => {
      expect(containsHtml('')).toBe(false);
    });
  });
});
