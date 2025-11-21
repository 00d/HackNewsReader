import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../store/themeStore';
import { typography } from '../../theme';
import {
  formatRelativeTime,
  formatPoints,
  formatCommentCount,
} from '../../utils/formatTime';

interface StoryMetadataProps {
  points?: number;
  by?: string;
  time: number;
  commentCount?: number;
}

export function StoryMetadata({
  points,
  by,
  time,
  commentCount = 0,
}: StoryMetadataProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {points !== undefined && (
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          {formatPoints(points)}
        </Text>
      )}
      {by && (
        <>
          <Text style={[styles.separator, { color: theme.textSecondary }]}>
            {' '}
            •{' '}
          </Text>
          <Text style={[styles.text, { color: theme.textSecondary }]}>
            {by}
          </Text>
        </>
      )}
      <Text style={[styles.separator, { color: theme.textSecondary }]}>
        {' '}
        •{' '}
      </Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {formatRelativeTime(time)}
      </Text>
      <Text style={[styles.separator, { color: theme.textSecondary }]}>
        {' '}
        •{' '}
      </Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        {formatCommentCount(commentCount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  text: {
    fontSize: typography.sizes.sm,
  },
  separator: {
    fontSize: typography.sizes.sm,
  },
});
