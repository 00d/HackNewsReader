import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
} from '@tanstack/react-query';
import { hnApi } from '../api/hnApi';
import { FeedType, Story } from '../api/types';
import { CACHE_TIMES, STORIES_PER_PAGE } from '../utils/constants';

export interface InfiniteStoriesPage {
  stories: Story[];
  nextPage: number | undefined;
}

/**
 * Hook to fetch stories with infinite pagination
 * Properly accumulates stories across pages
 */
export function useInfiniteStories(
  feedType: FeedType
): UseInfiniteQueryResult<InfiniteData<InfiniteStoriesPage>, Error> {
  return useInfiniteQuery({
    queryKey: ['infiniteStories', feedType],
    queryFn: async ({ pageParam = 0 }) => {
      // Get all story IDs for this feed (cached by TanStack Query)
      const ids = await hnApi.getFeedIds(feedType);

      // Calculate pagination slice
      const startIndex = pageParam * STORIES_PER_PAGE;
      const endIndex = startIndex + STORIES_PER_PAGE;
      const pageIds = ids.slice(startIndex, endIndex);

      // Fetch story details
      const stories = await hnApi.getStories(pageIds);

      // Determine if there's a next page
      const hasMore = endIndex < ids.length;
      const nextPage = hasMore ? pageParam + 1 : undefined;

      return {
        stories,
        nextPage,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: CACHE_TIMES.stories,
    gcTime: CACHE_TIMES.stories * 3,
  });
}

/**
 * Helper to flatten infinite query pages into single array
 */
export function flattenInfiniteStories(
  data: InfiniteStoriesPage[] | undefined
): Story[] {
  if (!data) return [];
  return data.flatMap((page) => page.stories);
}
