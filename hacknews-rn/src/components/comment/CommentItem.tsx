import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import { Comment } from '../../api/types';
import { HtmlRenderer } from './HtmlRenderer';
import { formatRelativeTime } from '../../utils/formatTime';
import { typography, spacing } from '../../theme';
import { useNestedComments } from '../../hooks/useStoryDetail';

interface CommentItemProps {
  comment: Comment;
  depth: number;
  maxDepth?: number;
}

export function CommentItem({
  comment,
  depth,
  maxDepth = 6,
}: CommentItemProps) {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  // Fetch child comments if they exist
  const { data: childComments } = useNestedComments(
    !collapsed && depth < maxDepth ? comment : null
  );

  // Handle deleted/dead comments
  if (comment.deleted || comment.dead) {
    return (
      <View
        style={[
          styles.container,
          { borderLeftColor: theme.border, marginLeft: depth * spacing.lg },
        ]}
      >
        <Text style={[styles.deletedText, { color: theme.textTertiary }]}>
          [deleted]
        </Text>
      </View>
    );
  }

  const hasChildren = childComments && childComments.length > 0;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            borderLeftColor: theme.border,
            marginLeft: depth * spacing.lg,
          },
        ]}
      >
        {/* Comment Header */}
        <TouchableOpacity
          onPress={() => setCollapsed(!collapsed)}
          activeOpacity={0.7}
        >
          <View style={styles.header}>
            <Text style={[styles.author, { color: theme.textSecondary }]}>
              {comment.by}
            </Text>
            <Text style={[styles.separator, { color: theme.textTertiary }]}>
              {' '}
              •{' '}
            </Text>
            <Text style={[styles.time, { color: theme.textTertiary }]}>
              {formatRelativeTime(comment.time)}
            </Text>
            {hasChildren && (
              <>
                <Text style={[styles.separator, { color: theme.textTertiary }]}>
                  {' '}
                  •{' '}
                </Text>
                <Text style={[styles.childCount, { color: theme.textTertiary }]}>
                  {collapsed ? '[+]' : '[-]'}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Comment Body */}
        {!collapsed && comment.text && (
          <View style={styles.body}>
            <HtmlRenderer html={comment.text} />
          </View>
        )}
      </View>

      {/* Nested Comments (Recursive) */}
      {!collapsed && hasChildren && depth < maxDepth && (
        <View>
          {childComments.map(childComment => (
            <CommentItem
              key={childComment.id}
              comment={childComment}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </View>
      )}

      {/* Depth limit indicator */}
      {!collapsed && hasChildren && depth >= maxDepth && (
        <View
          style={[
            styles.depthLimitContainer,
            { marginLeft: (depth + 1) * spacing.lg },
          ]}
        >
          <Text style={[styles.depthLimitText, { color: theme.textSecondary }]}>
            [more replies...]
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.sm,
  },
  container: {
    borderLeftWidth: 2,
    paddingLeft: spacing.md,
    paddingVertical: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  author: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  separator: {
    fontSize: typography.sizes.sm,
  },
  time: {
    fontSize: typography.sizes.sm,
  },
  childCount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  body: {
    marginTop: spacing.xs,
  },
  deletedText: {
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
  },
  depthLimitContainer: {
    paddingVertical: spacing.sm,
  },
  depthLimitText: {
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
  },
});
