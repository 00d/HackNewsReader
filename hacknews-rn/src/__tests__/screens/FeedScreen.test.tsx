import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import FeedScreen from '../../screens/FeedScreen';
import {
  renderWithProviders,
  mockNavigation,
  mockUseRoute,
  createMockStories,
  waitForAsync,
} from '../utils/testUtils';
import * as useInfiniteStoriesModule from '../../hooks/useInfiniteStories';

// Mock the hooks
jest.mock('../../hooks/useInfiniteStories');
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
  useRoute: () => ({ name: 'Top', key: 'Top-key', params: {} }),
}));
jest.mock('../../store/themeStore', () => ({
  useTheme: () => ({
    theme: {
      background: '#ffffff',
      surface: '#f6f6ef',
      text: '#000000',
      textSecondary: '#828282',
      textTertiary: '#999999',
      accent: '#ff6600',
      border: '#e5e5e5',
      error: '#ff4444',
    },
    isDark: false,
    mode: 'light',
    setMode: jest.fn(),
  }),
}));
jest.mock('../../store/bookmarksStore', () => ({
  useBookmarks: () => ({
    bookmarks: [],
    isBookmarked: jest.fn(() => false),
    toggleBookmark: jest.fn(),
  }),
}));
jest.mock('../../store/historyStore', () => ({
  useHistory: () => ({
    history: [],
    isRead: jest.fn(() => false),
  }),
}));

const mockUseInfiniteStories = useInfiniteStoriesModule.useInfiniteStories as jest.MockedFunction<
  typeof useInfiniteStoriesModule.useInfiniteStories
>;

const mockFlattenInfiniteStories = useInfiniteStoriesModule.flattenInfiniteStories as jest.MockedFunction<
  typeof useInfiniteStoriesModule.flattenInfiniteStories
>;

describe('FeedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    mockFlattenInfiniteStories.mockImplementation((data) => {
      if (!data) return [];
      return data.flatMap((page: any) => page.stories);
    });
  });

  it('should render loading state', () => {
    mockUseInfiniteStories.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    expect(getByText('Loading stories...')).toBeTruthy();
  });

  it('should render stories list', async () => {
    const mockStories = createMockStories(5);

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [{ stories: mockStories, nextPage: 1 }],
        pageParams: [0],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    await waitForAsync();

    expect(getByText('Story 1')).toBeTruthy();
    expect(getByText('Story 2')).toBeTruthy();
    expect(getByText('Story 3')).toBeTruthy();
  });

  it('should navigate to article when story with URL is pressed', async () => {
    // route mocked globally
    const mockStories = createMockStories(1, { url: 'https://example.com' });

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [{ stories: mockStories, nextPage: 1 }],
        pageParams: [0],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    await waitForAsync();

    const storyTitle = getByText('Story 1');
    fireEvent.press(storyTitle);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Article', {
      url: 'https://example.com',
      title: 'Story 1',
    });
  });

  it('should navigate to comments when story without URL is pressed', async () => {
    // route mocked globally
    const mockStories = createMockStories(1, { url: undefined });

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [{ stories: mockStories, nextPage: 1 }],
        pageParams: [0],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    await waitForAsync();

    const storyTitle = getByText('Story 1');
    fireEvent.press(storyTitle);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('StoryDetail', {
      story: expect.objectContaining({ id: 1 }),
    });
  });

  it('should navigate to comments when comments button is pressed', async () => {
    // route mocked globally
    const mockStories = createMockStories(1);

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [{ stories: mockStories, nextPage: 1 }],
        pageParams: [0],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    await waitForAsync();

    const commentsButton = getByText(/50 comments/i);
    fireEvent.press(commentsButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('StoryDetail', {
      story: expect.objectContaining({ id: 1 }),
    });
  });

  it('should show "Load More" button when there are more pages', async () => {
    // route mocked globally
    const mockStories = createMockStories(30);

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [{ stories: mockStories, nextPage: 1 }],
        pageParams: [0],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    await waitForAsync();

    expect(getByText('Load More')).toBeTruthy();
  });

  it('should fetch next page when "Load More" is pressed', async () => {
    // route mocked globally
    const mockStories = createMockStories(30);
    const fetchNextPage = jest.fn();

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [{ stories: mockStories, nextPage: 1 }],
        pageParams: [0],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    await waitForAsync();

    const loadMoreButton = getByText('Load More');
    fireEvent.press(loadMoreButton);

    expect(fetchNextPage).toHaveBeenCalled();
  });

  it('should show loading indicator while fetching next page', async () => {
    // route mocked globally
    const mockStories = createMockStories(30);

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [{ stories: mockStories, nextPage: 1 }],
        pageParams: [0],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    await waitForAsync();

    expect(getByText('Loading more stories...')).toBeTruthy();
  });

  it('should show end message when no more pages', async () => {
    // route mocked globally
    const mockStories = createMockStories(30);

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [{ stories: mockStories, nextPage: undefined }],
        pageParams: [0],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    await waitForAsync();

    expect(getByText("You've reached the end")).toBeTruthy();
  });

  it('should render error state', () => {
    // route mocked globally

    mockUseInfiniteStories.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load stories'),
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    expect(getByText('Failed to load stories')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('should refetch when retry button is pressed', () => {
    // route mocked globally
    const refetch = jest.fn();

    mockUseInfiniteStories.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load stories'),
      refetch,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    const retryButton = getByText('Retry');
    fireEvent.press(retryButton);

    expect(refetch).toHaveBeenCalled();
  });

  it('should render different feed types correctly', () => {
    const feedTypes = ['Top', 'New', 'Best', 'Ask', 'Show', 'Jobs'];

    feedTypes.forEach((feedType) => {
      jest.clearAllMocks();
      // route mocked globally

      mockUseInfiniteStories.mockReturnValue({
        data: {
          pages: [{ stories: [], nextPage: undefined }],
          pageParams: [0],
        },
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      } as any);

      const { unmount } = renderWithProviders(<FeedScreen />);

      // Verify useInfiniteStories was called with correct feed type
      const expectedFeedType = feedType.toLowerCase();
      expect(mockUseInfiniteStories).toHaveBeenCalledWith(
        expectedFeedType === 'jobs' ? 'job' : expectedFeedType
      );

      unmount();
    });
  });

  it('should not show footer when no stories', () => {
    // route mocked globally

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [{ stories: [], nextPage: undefined }],
        pageParams: [0],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { queryByText } = renderWithProviders(<FeedScreen />);

    expect(queryByText('Load More')).toBeNull();
    expect(queryByText("You've reached the end")).toBeNull();
  });

  it('should handle multiple pages of stories', async () => {
    // route mocked globally
    const page1 = createMockStories(30);
    const page2 = createMockStories(30, { id: 31 });

    mockUseInfiniteStories.mockReturnValue({
      data: {
        pages: [
          { stories: page1, nextPage: 1 },
          { stories: page2, nextPage: 2 },
        ],
        pageParams: [0, 1],
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: false,
    } as any);

    const { getByText } = renderWithProviders(<FeedScreen />);

    await waitForAsync();

    // Should show stories from both pages
    expect(getByText('Story 1')).toBeTruthy();
    expect(getByText('Story 30')).toBeTruthy();
  });
});
