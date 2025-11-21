import { hnApi } from '../../api/hnApi';

// These are integration tests that hit the real HN API
// They may be slow and can fail if API is down

describe('HN API Connectivity', () => {
  // Increase timeout for API calls
  jest.setTimeout(10000);

  describe('getFeedIds', () => {
    it('should fetch top stories IDs', async () => {
      const ids = await hnApi.getFeedIds('top');
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
      expect(typeof ids[0]).toBe('number');
    });

    it('should fetch new stories IDs', async () => {
      const ids = await hnApi.getFeedIds('new');
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
    });

    it('should fetch best stories IDs', async () => {
      const ids = await hnApi.getFeedIds('best');
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
    });
  });

  describe('getStory', () => {
    it('should fetch a real story by ID', async () => {
      // Get a story ID first
      const ids = await hnApi.getFeedIds('top');
      const storyId = ids[0];

      const story = await hnApi.getStory(storyId);
      expect(story).not.toBeNull();
      expect(story?.id).toBe(storyId);
      expect(story?.title).toBeDefined();
      expect(typeof story?.time).toBe('number');
    });

    it('should return null for invalid story ID', async () => {
      const story = await hnApi.getStory(99999999999);
      expect(story).toBeNull();
    });
  });

  describe('getStories', () => {
    it('should batch fetch multiple stories', async () => {
      const ids = await hnApi.getFeedIds('top');
      const first5 = ids.slice(0, 5);

      const stories = await hnApi.getStories(first5);
      expect(stories.length).toBeGreaterThan(0);
      expect(stories.length).toBeLessThanOrEqual(5);

      stories.forEach(story => {
        expect(story.title).toBeDefined();
        expect(story.time).toBeDefined();
        expect(typeof story.id).toBe('number');
      });
    });
  });

  describe('getComment', () => {
    it('should fetch a comment from a story', async () => {
      // Get a story with comments
      const ids = await hnApi.getFeedIds('top');

      // Try to find a story with comments
      for (const id of ids.slice(0, 10)) {
        const story = await hnApi.getStory(id);
        if (story?.kids && story.kids.length > 0) {
          const commentId = story.kids[0];
          const comment = await hnApi.getComment(commentId);

          expect(comment).not.toBeNull();
          expect(comment?.type).toBe('comment');
          expect(comment?.parent).toBe(story.id);
          break;
        }
      }
    });
  });
});
