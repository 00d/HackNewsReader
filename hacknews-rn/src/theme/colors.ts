// HN Orange/Minimal color palette

export const colors = {
  // HN Brand
  orange: '#ff6600',
  orangeDark: '#ff8533', // Lighter for dark mode

  // Light theme
  light: {
    background: '#f6f6ef', // HN beige
    surface: '#ffffff',
    text: '#000000',
    textSecondary: '#828282',
    textTertiary: '#999999',
    border: '#e0e0e0',
    link: '#0066cc',
    accent: '#ff6600',
    error: '#cc0000',
    success: '#00aa00',
  },

  // Dark theme
  dark: {
    background: '#1a1a1a',
    surface: '#2a2a2a',
    text: '#f0f0f0',
    textSecondary: '#a0a0a0',
    textTertiary: '#808080',
    border: '#3a3a3a',
    link: '#5599ff',
    accent: '#ff8533',
    error: '#ff4444',
    success: '#44dd44',
  },
} as const;

export type Theme = typeof colors.light;
export type ThemeMode = 'light' | 'dark';
