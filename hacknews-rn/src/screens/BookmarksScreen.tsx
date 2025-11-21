import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../store/bookmarksStore';
import { useTheme } from '../store/themeStore';
import { StoryList } from '../components/story/StoryList';
import { Story } from '../api/types';
import { spacing, typography } from '../theme';

export default function BookmarksScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { bookmarks, clearAll } = useBookmarks();

  // Convert bookmarks to stories array
  const stories: Story[] = bookmarks.map((bookmark) => bookmark.story);

  const handleStoryPress = (story: Story) => {
    if (story.url) {
      navigation.navigate('Article', {
        url: story.url,
        title: story.title,
        story,
      });
    } else {
      navigation.navigate('StoryDetail', { story });
    }
  };

  const handleCommentsPress = (story: Story) => {
    navigation.navigate('StoryDetail', { story });
  };

  const handleClearAll = () => {
    clearAll();
  };

  if (bookmarks.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyIcon, { color: theme.textTertiary }]}>
            ☆
          </Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No Bookmarks
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
            Tap the star icon on any story to bookmark it for later
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {bookmarks.length} Bookmark{bookmarks.length !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={[styles.clearButton, { color: theme.accent }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>
      <StoryList
        stories={stories}
        isLoading={false}
        isRefreshing={false}
        onRefresh={() => {}}
        onStoryPress={handleStoryPress}
        onCommentsPress={handleCommentsPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  clearButton: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed * typography.sizes.base,
  },
});
