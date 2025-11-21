import { create } from 'zustand';
import { FeedType } from '../api/types';
import { STORIES_PER_PAGE } from '../utils/constants';
import { persist } from './middleware/persistence';

interface PreferencesState {
  storiesPerPage: number;
  defaultFeed: FeedType;
  setStoriesPerPage: (count: number) => void;
  setDefaultFeed: (feed: FeedType) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      storiesPerPage: STORIES_PER_PAGE,
      defaultFeed: 'top',
      setStoriesPerPage: (count: number) => set({ storiesPerPage: count }),
      setDefaultFeed: (feed: FeedType) => set({ defaultFeed: feed }),
    }),
    {
      name: '@hacknews:preferences',
      version: 1,
      // Only persist data, not functions
      partialize: (state) => ({
        storiesPerPage: state.storiesPerPage,
        defaultFeed: state.defaultFeed,
      }),
    }
  )
);
