import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import { typography, spacing } from '../../theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: theme.error }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.accent }]}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
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
    fontSize: typography.sizes.base,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});
