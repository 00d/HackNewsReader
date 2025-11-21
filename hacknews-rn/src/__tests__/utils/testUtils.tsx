import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { Story, Comment, FeedType } from '../../api/types';

/**
 * Custom render function that wraps components with necessary providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialRoute?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          staleTime: 0,
        },
      },
    }),
    ...renderOptions
  } = options || {};

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>{children}</NavigationContainer>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Create a mock navigation object for testing
 */
export function createMockNavigation() {
  return {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    removeListener: jest.fn(),
    canGoBack: jest.fn(() => true),
    dispatch: jest.fn(),
    isFocused: jest.fn(() => true),
    push: jest.fn(),
    replace: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    reset: jest.fn(),
    setParams: jest.fn(),
    getId: jest.fn(() => 'test-id'),
    getParent: jest.fn(),
    getState: jest.fn(() => ({})),
  };
}

/**
 * Create a mock route object for testing
 */
export function createMockRoute(name: string = 'Test', params: any = {}) {
  return {
    key: `${name}-key`,
    name,
    params,
    path: undefined,
  };
}

/**
 * Mock navigation - use this in jest.mock() calls
 */
export const mockNavigation = createMockNavigation();

/**
 * Setup navigation mocks (call this in beforeEach)
 */
export const mockUseNavigation = () => {
  return mockNavigation;
};

/**
 * Setup route mock (call this in beforeEach or individual tests)
 */
export const mockUseRoute = (name: string = 'Test', params: any = {}) => {
  return createMockRoute(name, params);
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Wait for specific time
 */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a mock Story object
 */
export function createMockStory(overrides: Partial<Story> = {}): Story {
  return {
    id: Math.floor(Math.random() * 1000000),
    title: 'Test Story Title',
    by: 'testuser',
    time: Date.now() / 1000,
    score: 100,
    descendants: 50,
    type: 'story',
    url: 'https://example.com/article',
    kids: [1, 2, 3],
    ...overrides,
  };
}

/**
 * Create multiple mock stories
 */
export function createMockStories(count: number, overrides: Partial<Story> = {}): Story[] {
  return Array.from({ length: count }, (_, i) =>
    createMockStory({
      id: i + 1,
      title: `Story ${i + 1}`,
      ...overrides,
    })
  );
}

/**
 * Create a mock Comment object
 */
export function createMockComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: Math.floor(Math.random() * 1000000),
    by: 'commenter',
    time: Date.now() / 1000,
    text: '<p>This is a test comment</p>',
    type: 'comment',
    kids: [],
    parent: 1,
    ...overrides,
  };
}

/**
 * Create a nested comment thread
 */
export function createMockCommentThread(depth: number = 3): Comment {
  const createNestedComment = (level: number, parentId: number): Comment => {
    const comment = createMockComment({
      id: parentId + level,
      parent: parentId,
      text: `<p>Comment at depth ${level}</p>`,
    });

    if (level < depth) {
      const childId = comment.id + 1;
      comment.kids = [childId];
    }

    return comment;
  };

  return createNestedComment(0, 1000);
}

/**
 * Mock TanStack Query hooks
 */
export function mockUseQuery(data: any, options: { isLoading?: boolean; error?: Error } = {}) {
  return {
    data,
    isLoading: options.isLoading || false,
    isError: !!options.error,
    error: options.error || null,
    isSuccess: !options.isLoading && !options.error,
    refetch: jest.fn(),
    isFetching: false,
    status: options.isLoading ? 'pending' : options.error ? 'error' : 'success',
  };
}

/**
 * Mock useInfiniteQuery hook
 */
export function mockUseInfiniteQuery(
  pages: any[],
  options: { isLoading?: boolean; error?: Error; hasNextPage?: boolean } = {}
) {
  return {
    data: pages.length > 0 ? { pages, pageParams: [] } : undefined,
    isLoading: options.isLoading || false,
    isError: !!options.error,
    error: options.error || null,
    isSuccess: !options.isLoading && !options.error,
    fetchNextPage: jest.fn(),
    hasNextPage: options.hasNextPage !== undefined ? options.hasNextPage : true,
    isFetchingNextPage: false,
    refetch: jest.fn(),
    status: options.isLoading ? 'pending' : options.error ? 'error' : 'success',
  };
}

/**
 * Create mock feed IDs
 */
export function createMockFeedIds(count: number = 100): number[] {
  return Array.from({ length: count }, (_, i) => i + 1);
}

/**
 * Mock theme hook
 */
export const mockUseTheme = (isDark: boolean = false) => {
  const theme = {
    background: isDark ? '#000000' : '#ffffff',
    surface: isDark ? '#1a1a1a' : '#f6f6ef',
    text: isDark ? '#ffffff' : '#000000',
    textSecondary: isDark ? '#cccccc' : '#828282',
    textTertiary: isDark ? '#999999' : '#999999',
    accent: '#ff6600',
    border: isDark ? '#333333' : '#e5e5e5',
    error: '#ff4444',
  };

  return {
    theme,
    isDark,
    mode: isDark ? 'dark' : 'light',
    setMode: jest.fn(),
  };
};

/**
 * Mock AsyncStorage for tests
 */
export const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

/**
 * Reset all mocks
 */
export function resetAllMocks() {
  jest.clearAllMocks();
  mockAsyncStorage.getItem.mockResolvedValue(null);
  mockAsyncStorage.setItem.mockResolvedValue(undefined);
  mockAsyncStorage.removeItem.mockResolvedValue(undefined);
}

/**
 * Suppress console errors/warnings in tests
 */
export function suppressConsole() {
  const originalError = console.error;
  const originalWarn = console.warn;

  beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
}

/**
 * Common test scenarios
 */
export const testScenarios = {
  /**
   * Test loading state
   */
  loading: {
    data: undefined,
    isLoading: true,
    error: null,
  },

  /**
   * Test error state
   */
  error: {
    data: undefined,
    isLoading: false,
    error: new Error('Test error'),
  },

  /**
   * Test empty data
   */
  empty: {
    data: [],
    isLoading: false,
    error: null,
  },

  /**
   * Test success with data
   */
  success: (data: any) => ({
    data,
    isLoading: false,
    error: null,
  }),
};
