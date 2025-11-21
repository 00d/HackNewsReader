import { create } from 'zustand';
import { persist } from './middleware/persistence';
import { Story } from '../api/types';

export interface Bookmark {
  id: string; // UUID for bookmark entry
  storyId: number; // HN story ID
  story: Story; // Full story data for offline viewing
  bookmarkedAt: number; // Timestamp when bookmarked
  tags?: string[]; // Optional: for future categorization
}

interface BookmarksState {
  bookmarks: Bookmark[];

  // Actions
  addBookmark: (story: Story) => void;
  removeBookmark: (storyId: number) => void;
  isBookmarked: (storyId: number) => boolean;
  getBookmark: (storyId: number) => Bookmark | undefined;
  getBookmarkCount: () => number;
  getAllBookmarks: () => Bookmark[];
  clearAll: () => void;
}

/**
 * Generate a unique ID for bookmarks
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Bookmarks store with AsyncStorage persistence
 *
 * Features:
 * - Add/remove bookmarks
 * - Check if story is bookmarked
 * - Persist across app restarts
 * - Store full story data for offline access
 */
export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (story: Story) => {
        const { bookmarks } = get();

        // Check if already bookmarked
        if (bookmarks.some((b) => b.storyId === story.id)) {
          return; // Already bookmarked
        }

        const newBookmark: Bookmark = {
          id: generateId(),
          storyId: story.id,
          story,
          bookmarkedAt: Date.now(),
        };

        set({
          bookmarks: [newBookmark, ...bookmarks], // Newest first
        });
      },

      removeBookmark: (storyId: number) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.storyId !== storyId),
        }));
      },

      isBookmarked: (storyId: number) => {
        return get().bookmarks.some((b) => b.storyId === storyId);
      },

      getBookmark: (storyId: number) => {
        return get().bookmarks.find((b) => b.storyId === storyId);
      },

      getBookmarkCount: () => {
        return get().bookmarks.length;
      },

      getAllBookmarks: () => {
        return get().bookmarks;
      },

      clearAll: () => {
        set({ bookmarks: [] });
      },
    }),
    {
      name: '@hacknews:bookmarks',
      version: 1,
      // Only persist the bookmarks array, not the functions
      partialize: (state) => ({
        bookmarks: state.bookmarks,
      }),
    }
  )
);

/**
 * Hook to use bookmarks functionality
 */
export const useBookmarks = () => {
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const addBookmark = useBookmarksStore((state) => state.addBookmark);
  const removeBookmark = useBookmarksStore((state) => state.removeBookmark);
  const isBookmarked = useBookmarksStore((state) => state.isBookmarked);
  const getBookmark = useBookmarksStore((state) => state.getBookmark);
  const getBookmarkCount = useBookmarksStore((state) => state.getBookmarkCount);
  const getAllBookmarks = useBookmarksStore((state) => state.getAllBookmarks);
  const clearAll = useBookmarksStore((state) => state.clearAll);

  const toggleBookmark = (story: Story) => {
    if (isBookmarked(story.id)) {
      removeBookmark(story.id);
    } else {
      addBookmark(story);
    }
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmark,
    getBookmarkCount,
    getAllBookmarks,
    clearAll,
    toggleBookmark,
  };
};
