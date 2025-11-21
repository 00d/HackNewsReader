import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../store/themeStore';
import { typography, spacing } from '../../theme';
import { Story } from '../../api/types';
import { StoryMetadata } from './StoryMetadata';
import { extractDomain } from '../../utils/formatTime';
import { useBookmarks } from '../../store/bookmarksStore';
import { useHistory } from '../../store/historyStore';

interface StoryListItemProps {
  story: Story;
  index: number;
  onPress: () => void;
  onCommentsPress: () => void;
}

export function StoryListItem({
  story,
  index,
  onPress,
  onCommentsPress,
}: StoryListItemProps) {
  const { theme } = useTheme();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isRead } = useHistory();

  const domain = story.url ? extractDomain(story.url) : '';
  const bookmarked = isBookmarked(story.id);
  const read = isRead(story.id);

  const handleBookmarkPress = () => {
    toggleBookmark(story);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Story number */}
        <Text style={[styles.index, { color: theme.textTertiary }]}>
          {index + 1}.
        </Text>

        {/* Story details */}
        <View style={styles.details}>
          {/* Title */}
          <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <Text
              style={[
                styles.title,
                { color: read ? theme.textSecondary : theme.text },
              ]}
            >
              {story.title}
            </Text>
            {domain && (
              <Text style={[styles.domain, { color: theme.textTertiary }]}>
                ({domain})
              </Text>
            )}
          </TouchableOpacity>

          {/* Metadata */}
          <TouchableOpacity onPress={onCommentsPress} activeOpacity={0.7}>
            <View style={styles.metadata}>
              <StoryMetadata
                points={story.score}
                by={story.by}
                time={story.time}
                commentCount={story.descendants || 0}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bookmark icon */}
        <TouchableOpacity
          onPress={handleBookmarkPress}
          activeOpacity={0.7}
          style={styles.bookmarkButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text
            style={[
              styles.bookmarkIcon,
              { color: bookmarked ? theme.accent : theme.textTertiary },
            ]}
          >
            {bookmarked ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  index: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    marginRight: spacing.sm,
    minWidth: 24,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
    marginBottom: spacing.xs,
  },
  domain: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  metadata: {
    marginTop: spacing.xs,
  },
  bookmarkButton: {
    marginLeft: spacing.sm,
    paddingTop: 2,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
});
