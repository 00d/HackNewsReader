import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { colors, ThemeMode } from '../theme/colors';
import { persist } from './middleware/persistence';

interface ThemeState {
  mode: ThemeMode | 'system';
  setMode: (mode: ThemeMode | 'system') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode: ThemeMode | 'system') => set({ mode }),
    }),
    {
      name: '@hacknews:theme',
      version: 1,
    }
  )
);

// Hook to get current theme
export const useTheme = () => {
  const systemScheme = useColorScheme();
  const { mode, setMode } = useThemeStore();

  // Determine effective mode and theme
  const effectiveMode: ThemeMode =
    mode === 'system' ? (systemScheme as ThemeMode) || 'light' : mode;
  const effectiveTheme = colors[effectiveMode];

  return {
    theme: effectiveTheme,
    mode,
    isDark: effectiveMode === 'dark',
    setMode,
  };
};
