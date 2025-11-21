import { apiClient } from './client';
import { HN_API_ENDPOINTS } from '../utils/constants';
import { FeedType, HNItem, Story, Comment, HNUser } from './types';

class HackerNewsAPI {
  /**
   * Get story IDs for a specific feed type
   */
  async getFeedIds(feedType: FeedType): Promise<number[]> {
    const endpointMap: Record<FeedType, string> = {
      top: HN_API_ENDPOINTS.topStories,
      new: HN_API_ENDPOINTS.newStories,
      best: HN_API_ENDPOINTS.bestStories,
      ask: HN_API_ENDPOINTS.askStories,
      show: HN_API_ENDPOINTS.showStories,
      job: HN_API_ENDPOINTS.jobStories,
    };

    const url = endpointMap[feedType];
    return apiClient.get<number[], number[]>(url);
  }

  /**
   * Get a single item (story, comment, etc.) by ID
   */
  async getItem(id: number): Promise<HNItem | null> {
    try {
      const item = await apiClient.get<HNItem, HNItem>(
        HN_API_ENDPOINTS.item(id)
      );
      return item;
    } catch (error) {
      console.error(`Failed to fetch item ${id}:`, error);
      return null;
    }
  }

  /**
   * Get a story by ID
   */
  async getStory(id: number): Promise<Story | null> {
    const item = await this.getItem(id);
    if (!item || (item.type !== 'story' && item.type !== 'job')) {
      return null;
    }
    return item as Story;
  }

  /**
   * Batch fetch multiple stories
   */
  async getStories(ids: number[]): Promise<Story[]> {
    const promises = ids.map(id => this.getStory(id));
    const stories = await Promise.all(promises);
    // Filter out null values (deleted/missing stories)
    return stories.filter((story): story is Story => story !== null);
  }

  /**
   * Get a comment by ID
   */
  async getComment(id: number): Promise<Comment | null> {
    const item = await this.getItem(id);
    if (!item || item.type !== 'comment') {
      return null;
    }
    return item as Comment;
  }

  /**
   * Recursively fetch comment tree
   */
  async getCommentTree(ids: number[]): Promise<Comment[]> {
    const promises = ids.map(id => this.getComment(id));
    const comments = await Promise.all(promises);
    return comments.filter((comment): comment is Comment => comment !== null);
  }

  /**
   * Get user profile by ID
   */
  async getUser(id: string): Promise<HNUser | null> {
    try {
      const user = await apiClient.get<HNUser, HNUser>(
        HN_API_ENDPOINTS.user(id)
      );
      return user;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const hnApi = new HackerNewsAPI();
