import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../store/themeStore';
import { sanitizeHtml, stripHtml } from '../../utils/parseHtml';
import { typography } from '../../theme';

interface HtmlRendererProps {
  html: string;
}

// Simple HTML renderer for comments
// Uses sanitized plain text for Phase 1
// Can be enhanced with proper HTML rendering in future phases
export function HtmlRenderer({ html }: HtmlRendererProps) {
  const { theme } = useTheme();

  if (!html) return null;

  // Sanitize and convert to plain text
  const sanitized = sanitizeHtml(html);
  const plainText = stripHtml(sanitized);

  return (
    <Text style={[styles.text, { color: theme.text }]}>{plainText}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: typography.sizes.base,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.base,
  },
});
