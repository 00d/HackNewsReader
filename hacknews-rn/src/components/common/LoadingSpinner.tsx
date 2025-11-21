import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../store/themeStore';
import { typography, spacing } from '../../theme';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export function LoadingSpinner({
  message,
  size = 'large',
}: LoadingSpinnerProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.accent} />
      {message && (
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  message: {
    marginTop: spacing.md,
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
});
