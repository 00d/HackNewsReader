// Application constants

// API Configuration
export const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

export const HN_API_ENDPOINTS = {
  topStories: `${HN_API_BASE}/topstories.json`,
  newStories: `${HN_API_BASE}/newstories.json`,
  bestStories: `${HN_API_BASE}/beststories.json`,
  askStories: `${HN_API_BASE}/askstories.json`,
  showStories: `${HN_API_BASE}/showstories.json`,
  jobStories: `${HN_API_BASE}/jobstories.json`,
  item: (id: number) => `${HN_API_BASE}/item/${id}.json`,
  user: (id: string) => `${HN_API_BASE}/user/${id}.json`,
} as const;

// Pagination
export const STORIES_PER_PAGE = 30;

// Cache times (in milliseconds)
export const CACHE_TIMES = {
  feedIds: 2 * 60 * 1000, // 2 minutes
  stories: 5 * 60 * 1000, // 5 minutes
  comments: 10 * 60 * 1000, // 10 minutes
} as const;

// HN Website URL
export const HN_WEBSITE = 'https://news.ycombinator.com';
