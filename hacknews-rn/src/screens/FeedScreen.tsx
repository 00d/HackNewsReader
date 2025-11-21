import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { feedTypeFromRoute } from '../navigation/types';
import { useInfiniteStories, flattenInfiniteStories } from '../hooks/useInfiniteStories';
import { StoryList } from '../components/story/StoryList';
import { useTheme } from '../store/themeStore';
import { Story } from '../api/types';
import { spacing, typography } from '../theme';

type FeedRouteName = 'Top' | 'New' | 'Best' | 'Ask' | 'Show' | 'Jobs';

export default function FeedScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Get feed type from route name
  const feedType = feedTypeFromRoute(route.name as FeedRouteName);

  // Fetch stories with infinite pagination
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteStories(feedType);

  // Flatten paginated data into single array
  const stories = flattenInfiniteStories(data ? data.pages : undefined);

  const handleRefresh = () => {
    refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleStoryPress = (story: Story) => {
    if (story.url) {
      navigation.navigate('Article', {
        url: story.url,
        title: story.title,
        story,
      });
    } else {
      // If no URL, go to comments (e.g., Ask HN posts)
      navigation.navigate('StoryDetail', { story });
    }
  };

  const handleCommentsPress = (story: Story) => {
    navigation.navigate('StoryDetail', { story });
  };

  // Render Load More button with loading state
  const renderFooter = () => {
    if (!stories || stories.length === 0) return null;

    // Show loading spinner while fetching next page
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadMoreContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading more stories...
          </Text>
        </View>
      );
    }

    // Show "Load More" button if there are more pages
    if (hasNextPage) {
      return (
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity
            style={[styles.loadMoreButton, { backgroundColor: theme.accent }]}
            onPress={handleLoadMore}
          >
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Show "End of feed" message
    return (
      <View style={styles.loadMoreContainer}>
        <Text style={[styles.endText, { color: theme.textSecondary }]}>
          You&apos;ve reached the end
        </Text>
      </View>
    );
  };

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error.message || 'Failed to load stories'}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.accent }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StoryList
        stories={stories || []}
        isLoading={isLoading}
        isRefreshing={false}
        onRefresh={handleRefresh}
        onStoryPress={handleStoryPress}
        onCommentsPress={handleCommentsPress}
        ListFooterComponent={renderFooter()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadMoreContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  loadMoreButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  loadMoreText: {
    color: '#ffffff',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  loadingText: {
    fontSize: typography.sizes.base,
    marginTop: spacing.sm,
  },
  endText: {
    fontSize: typography.sizes.base,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
    marginTop: spacing['4xl'],
    paddingHorizontal: spacing.xl,
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryText: {
    color: '#ffffff',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});
