import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { useInfiniteStories, flattenInfiniteStories } from './useInfiniteStories';
import { hnApi } from '../api/hnApi';
import { FeedType } from '../api/types';

// Mock the hnApi
jest.mock('../api/hnApi');

const mockHnApi = hnApi as jest.Mocked<typeof hnApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useInfiniteStories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch initial page of stories', async () => {
    const mockIds = Array.from({ length: 100 }, (_, i) => i + 1);
    const mockStories = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Story ${i + 1}`,
      by: 'author',
      time: Date.now(),
      score: 100,
      descendants: 10,
      type: 'story' as const,
    }));

    mockHnApi.getFeedIds.mockResolvedValue(mockIds);
    mockHnApi.getStories.mockResolvedValue(mockStories);

    const { result } = renderHook(() => useInfiniteStories('top' as FeedType), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockHnApi.getFeedIds).toHaveBeenCalledWith('top');
    expect(mockHnApi.getStories).toHaveBeenCalledWith(mockIds.slice(0, 30));
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].stories).toHaveLength(30);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('should fetch multiple pages and accumulate stories', async () => {
    const mockIds = Array.from({ length: 100 }, (_, i) => i + 1);
    const mockStoriesPage1 = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Story ${i + 1}`,
      by: 'author',
      time: Date.now(),
      score: 100,
      descendants: 10,
      type: 'story' as const,
    }));
    const mockStoriesPage2 = Array.from({ length: 30 }, (_, i) => ({
      id: i + 31,
      title: `Story ${i + 31}`,
      by: 'author',
      time: Date.now(),
      score: 100,
      descendants: 10,
      type: 'story' as const,
    }));

    mockHnApi.getFeedIds.mockResolvedValue(mockIds);
    mockHnApi.getStories
      .mockResolvedValueOnce(mockStoriesPage1)
      .mockResolvedValueOnce(mockStoriesPage2);

    const { result } = renderHook(() => useInfiniteStories('top' as FeedType), {
      wrapper: createWrapper(),
    });

    // Wait for initial page
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages).toHaveLength(1);

    // Fetch next page
    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    // Verify both pages are accumulated
    expect(result.current.data?.pages[0].stories).toHaveLength(30);
    expect(result.current.data?.pages[1].stories).toHaveLength(30);
    expect(result.current.data?.pages[0].stories[0].id).toBe(1);
    expect(result.current.data?.pages[1].stories[0].id).toBe(31);
  });

  it('should indicate no next page when reaching end of feed', async () => {
    const mockIds = Array.from({ length: 50 }, (_, i) => i + 1);
    const mockStoriesPage1 = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Story ${i + 1}`,
      by: 'author',
      time: Date.now(),
      score: 100,
      descendants: 10,
      type: 'story' as const,
    }));
    const mockStoriesPage2 = Array.from({ length: 20 }, (_, i) => ({
      id: i + 31,
      title: `Story ${i + 31}`,
      by: 'author',
      time: Date.now(),
      score: 100,
      descendants: 10,
      type: 'story' as const,
    }));

    mockHnApi.getFeedIds.mockResolvedValue(mockIds);
    mockHnApi.getStories
      .mockResolvedValueOnce(mockStoriesPage1)
      .mockResolvedValueOnce(mockStoriesPage2);

    const { result } = renderHook(() => useInfiniteStories('top' as FeedType), {
      wrapper: createWrapper(),
    });

    // Wait for initial page
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);

    // Fetch next page (last page)
    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    // Should have no next page after reaching end
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.data?.pages[1].nextPage).toBeUndefined();
  });

  it('should handle errors gracefully', async () => {
    mockHnApi.getFeedIds.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useInfiniteStories('top' as FeedType), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error('Network error'));
  });

  it('should use correct page parameters for pagination', async () => {
    const mockIds = Array.from({ length: 100 }, (_, i) => i + 1);
    const mockStories = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      title: `Story ${i + 1}`,
      by: 'author',
      time: Date.now(),
      score: 100,
      descendants: 10,
      type: 'story' as const,
    }));

    mockHnApi.getFeedIds.mockResolvedValue(mockIds);
    mockHnApi.getStories.mockResolvedValue(mockStories);

    const { result } = renderHook(() => useInfiniteStories('new' as FeedType), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Fetch next page
    result.current.fetchNextPage();

    await waitFor(() => expect(mockHnApi.getStories).toHaveBeenCalledTimes(2));

    // Verify correct slice was requested for page 2
    expect(mockHnApi.getStories).toHaveBeenNthCalledWith(2, mockIds.slice(30, 60));
  });
});

describe('flattenInfiniteStories', () => {
  it('should flatten pages into single array', () => {
    const pages = [
      {
        stories: [
          { id: 1, title: 'Story 1', by: 'author', time: Date.now(), score: 100, descendants: 10, type: 'story' as const },
          { id: 2, title: 'Story 2', by: 'author', time: Date.now(), score: 100, descendants: 10, type: 'story' as const },
        ],
        nextPage: 1,
      },
      {
        stories: [
          { id: 3, title: 'Story 3', by: 'author', time: Date.now(), score: 100, descendants: 10, type: 'story' as const },
          { id: 4, title: 'Story 4', by: 'author', time: Date.now(), score: 100, descendants: 10, type: 'story' as const },
        ],
        nextPage: undefined,
      },
    ];

    const flattened = flattenInfiniteStories(pages);

    expect(flattened).toHaveLength(4);
    expect(flattened[0].id).toBe(1);
    expect(flattened[1].id).toBe(2);
    expect(flattened[2].id).toBe(3);
    expect(flattened[3].id).toBe(4);
  });

  it('should return empty array for undefined input', () => {
    const flattened = flattenInfiniteStories(undefined);

    expect(flattened).toEqual([]);
  });

  it('should return empty array for empty pages', () => {
    const flattened = flattenInfiniteStories([]);

    expect(flattened).toEqual([]);
  });

  it('should handle pages with empty stories arrays', () => {
    const pages = [
      { stories: [], nextPage: 1 },
      {
        stories: [
          { id: 1, title: 'Story 1', by: 'author', time: Date.now(), score: 100, descendants: 10, type: 'story' as const },
        ],
        nextPage: undefined,
      },
    ];

    const flattened = flattenInfiniteStories(pages);

    expect(flattened).toHaveLength(1);
    expect(flattened[0].id).toBe(1);
  });
});
