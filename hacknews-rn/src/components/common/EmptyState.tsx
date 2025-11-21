import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../store/themeStore';
import { typography, spacing } from '../../theme';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {message}
      </Text>
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
    fontSize: typography.sizes.lg,
    textAlign: 'center',
  },
});
