import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Comment } from '../../api/types';
import { CommentItem } from './CommentItem';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { useTheme } from '../../store/themeStore';

interface CommentThreadProps {
  comments: Comment[] | undefined;
  isLoading: boolean;
}

export function CommentThread({ comments, isLoading }: CommentThreadProps) {
  const { theme } = useTheme();

  if (isLoading) {
    return <LoadingSpinner message="Loading comments..." />;
  }

  if (!comments || comments.length === 0) {
    return <EmptyState message="No comments yet" />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} depth={0} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});
