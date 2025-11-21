import { create } from 'zustand';
import { persist } from './middleware/persistence';
import { Story } from '../api/types';

export interface HistoryEntry {
  storyId: number; // HN story ID
  story: Story; // Cache story data
  readAt: number; // Timestamp when read
  readType: 'article' | 'comments'; // What they viewed
}

interface HistoryState {
  history: HistoryEntry[]; // Max 500, FIFO

  // Actions
  markAsRead: (story: Story, type: 'article' | 'comments') => void;
  isRead: (storyId: number) => boolean;
  getReadEntry: (storyId: number) => HistoryEntry | undefined;
  getRecentHistory: (limit: number) => HistoryEntry[];
  getAllHistory: () => HistoryEntry[];
  clearHistory: () => void;
}

const MAX_HISTORY_SIZE = 500;

/**
 * Reading history store with AsyncStorage persistence
 *
 * Features:
 * - Track when stories are read
 * - Store what type of view (article or comments)
 * - Automatic FIFO with 500-item limit
 * - Persist across app restarts
 */
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      markAsRead: (story: Story, type: 'article' | 'comments') => {
        const { history } = get();

        // Check if already in history
        const existingIndex = history.findIndex((h) => h.storyId === story.id);

        let newHistory: HistoryEntry[];

        if (existingIndex >= 0) {
          // Update existing entry and move to front
          const updated: HistoryEntry = {
            ...history[existingIndex],
            readAt: Date.now(),
            readType: type,
          };

          newHistory = [
            updated,
            ...history.slice(0, existingIndex),
            ...history.slice(existingIndex + 1),
          ];
        } else {
          // Add new entry at front
          const newEntry: HistoryEntry = {
            storyId: story.id,
            story,
            readAt: Date.now(),
            readType: type,
          };

          newHistory = [newEntry, ...history];
        }

        // Enforce FIFO limit
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory = newHistory.slice(0, MAX_HISTORY_SIZE);
        }

        set({ history: newHistory });
      },

      isRead: (storyId: number) => {
        return get().history.some((h) => h.storyId === storyId);
      },

      getReadEntry: (storyId: number) => {
        return get().history.find((h) => h.storyId === storyId);
      },

      getRecentHistory: (limit: number) => {
        return get().history.slice(0, limit);
      },

      getAllHistory: () => {
        return get().history;
      },

      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: '@hacknews:history',
      version: 1,
      // Only persist the history array
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);

/**
 * Hook to use history functionality
 */
export const useHistory = () => {
  const history = useHistoryStore((state) => state.history);
  const markAsRead = useHistoryStore((state) => state.markAsRead);
  const isRead = useHistoryStore((state) => state.isRead);
  const getReadEntry = useHistoryStore((state) => state.getReadEntry);
  const getRecentHistory = useHistoryStore((state) => state.getRecentHistory);
  const getAllHistory = useHistoryStore((state) => state.getAllHistory);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  return {
    history,
    markAsRead,
    isRead,
    getReadEntry,
    getRecentHistory,
    getAllHistory,
    clearHistory,
  };
};
