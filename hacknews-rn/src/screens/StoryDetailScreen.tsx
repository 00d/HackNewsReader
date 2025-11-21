import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { useComments } from '../hooks/useStoryDetail';
import { useTheme } from '../store/themeStore';
import { CommentThread } from '../components/comment/CommentThread';
import { StoryMetadata } from '../components/story/StoryMetadata';
import { spacing, typography } from '../theme';
import { extractDomain } from '../utils/formatTime';
import { useHistory } from '../store/historyStore';

export default function StoryDetailScreen() {
  const route = useRoute<RootStackScreenProps<'StoryDetail'>['route']>();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { story } = route.params;
  const { markAsRead } = useHistory();

  // Fetch comments
  const { data: comments, isLoading } = useComments(story.kids);

  const domain = story.url ? extractDomain(story.url) : '';

  // Mark story as read when viewing comments
  useEffect(() => {
    markAsRead(story, 'comments');
  }, [story.id, markAsRead]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Story Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            if (story.url) {
              navigation.navigate('Article', {
                url: story.url,
                title: story.title,
                story,
              });
            }
          }}
          disabled={!story.url}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            {story.title}
          </Text>
          {domain && (
            <Text style={[styles.domain, { color: theme.textTertiary }]}>
              ({domain})
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.metadata}>
          <StoryMetadata
            points={story.score}
            by={story.by}
            time={story.time}
            commentCount={story.descendants || 0}
          />
        </View>

        {story.url && (
          <TouchableOpacity
            style={[styles.readButton, { backgroundColor: theme.accent }]}
            onPress={() =>
              navigation.navigate('Article', {
                url: story.url!,
                title: story.title,
                story,
              })
            }
          >
            <Text style={styles.readButtonText}>Read Article</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Comments Section */}
      <CommentThread comments={comments} isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.normal * typography.sizes.lg,
    marginBottom: spacing.xs,
  },
  domain: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  metadata: {
    marginTop: spacing.md,
  },
  readButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  readButtonText: {
    color: '#ffffff',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});
