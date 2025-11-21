import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { hnApi } from '../api/hnApi';
import { Story, Comment } from '../api/types';
import { CACHE_TIMES } from '../utils/constants';

/**
 * Hook to fetch a single story with full details
 */
export function useStoryDetail(
  storyId: number
): UseQueryResult<Story, Error> {
  return useQuery({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const story = await hnApi.getStory(storyId);
      if (!story) {
        throw new Error(`Story ${storyId} not found`);
      }
      return story;
    },
    staleTime: CACHE_TIMES.stories,
    gcTime: CACHE_TIMES.stories * 3,
    enabled: !!storyId,
  });
}

/**
 * Hook to fetch comments for a story
 */
export function useComments(
  commentIds: number[] | undefined
): UseQueryResult<Comment[], Error> {
  return useQuery({
    queryKey: ['comments', commentIds],
    queryFn: async () => {
      if (!commentIds || commentIds.length === 0) {
        return [];
      }
      const comments = await hnApi.getCommentTree(commentIds);
      return comments;
    },
    staleTime: CACHE_TIMES.comments,
    gcTime: CACHE_TIMES.comments * 3,
    enabled: !!commentIds && commentIds.length > 0,
  });
}

/**
 * Hook to recursively fetch nested comments
 */
export function useNestedComments(
  parentComment: Comment | null
): UseQueryResult<Comment[], Error> {
  return useQuery({
    queryKey: ['nestedComments', parentComment?.id],
    queryFn: async () => {
      if (!parentComment?.kids || parentComment.kids.length === 0) {
        return [];
      }
      const childComments = await hnApi.getCommentTree(parentComment.kids);
      return childComments;
    },
    staleTime: CACHE_TIMES.comments,
    gcTime: CACHE_TIMES.comments * 3,
    enabled: !!parentComment?.kids && parentComment.kids.length > 0,
  });
}
