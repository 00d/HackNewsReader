import React from 'react';
import { View, RefreshControl, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Story } from '../../api/types';
import { StoryListItem } from './StoryListItem';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { useTheme } from '../../store/themeStore';

interface StoryListProps {
  stories: Story[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onStoryPress: (story: Story) => void;
  onCommentsPress: (story: Story) => void;
  onEndReached?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function StoryList({
  stories,
  isLoading,
  isRefreshing,
  onRefresh,
  onStoryPress,
  onCommentsPress,
  onEndReached,
  ListFooterComponent,
}: StoryListProps) {
  const { theme } = useTheme();

  if (isLoading && !isRefreshing && stories.length === 0) {
    return <LoadingSpinner message="Loading stories..." />;
  }

  if (!isLoading && stories.length === 0) {
    return <EmptyState message="No stories found" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlashList
        data={stories}
        renderItem={({ item, index }) => (
          <StoryListItem
            story={item}
            index={index}
            onPress={() => onStoryPress(item)}
            onCommentsPress={() => onCommentsPress(item)}
          />
        )}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
            colors={[theme.accent]}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
