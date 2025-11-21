import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import StoryDetailScreen from '../../screens/StoryDetailScreen';
import {
  renderWithProviders,
  mockNavigation,
  createMockStory,
  createMockComment,
  waitForAsync,
} from '../utils/testUtils';
import * as useStoryDetailModule from '../../hooks/useStoryDetail';

const mockStory = createMockStory({
  id: 123,
  title: 'Test Story',
  url: 'https://example.com',
  by: 'testauthor',
  score: 100,
  descendants: 50,
});

// Mock the hooks
jest.mock('../../hooks/useStoryDetail', () => ({
  useComments: jest.fn(),
  useNestedComments: jest.fn(() => ({ data: undefined, isLoading: false })),
}));
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
  useRoute: () => ({ name: 'StoryDetail', key: 'StoryDetail-key', params: { story: mockStory } }),
}));
jest.mock('../../store/themeStore', () => ({
  useTheme: () => ({
    theme: {
      background: '#ffffff',
      surface: '#f6f6ef',
      text: '#000000',
      textSecondary: '#828282',
      textTertiary: '#999999',
      accent: '#ff6600',
      border: '#e5e5e5',
      error: '#ff4444',
    },
    isDark: false,
  }),
}));
jest.mock('../../store/historyStore', () => ({
  useHistory: () => ({
    markAsRead: jest.fn(),
    isRead: jest.fn(() => false),
    getReadEntry: jest.fn(),
    history: [],
  }),
}));

const mockUseComments = useStoryDetailModule.useComments as jest.MockedFunction<
  typeof useStoryDetailModule.useComments
>;

describe('StoryDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {

    mockUseComments.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    expect(getByText('Loading comments...')).toBeTruthy();
  });

  it('should render story details and metadata', async () => {

    const mockComments = [createMockComment({ id: 1 })];

    mockUseComments.mockReturnValue({
      data: mockComments,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    await waitForAsync();

    expect(getByText('Test Story')).toBeTruthy();
    expect(getByText(/testauthor/)).toBeTruthy();
    expect(getByText(/100 points/)).toBeTruthy();
  });

  it('should show "Read Article" button when story has URL', async () => {

    mockUseComments.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    await waitForAsync();

    expect(getByText('Read Article')).toBeTruthy();
  });

  it('should navigate to article when "Read Article" is pressed', async () => {

    mockUseComments.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    await waitForAsync();

    const readArticleButton = getByText('Read Article');
    fireEvent.press(readArticleButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Article', {
      url: 'https://example.com',
      title: 'Test Story',
      story: mockStory,
    });
  });

  it('should not show "Read Article" button when story has no URL', async () => {
    const storyWithoutUrl = createMockStory({ url: undefined });

    mockUseComments.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { queryByText } = renderWithProviders(<StoryDetailScreen />);

    await waitForAsync();

    expect(queryByText('Read Article')).toBeNull();
  });

  it('should render comments', async () => {

    const mockComments = [
      createMockComment({ id: 1, text: '<p>First comment</p>' }),
      createMockComment({ id: 2, text: '<p>Second comment</p>' }),
    ];

    mockUseComments.mockReturnValue({
      data: mockComments,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    await waitForAsync();

    expect(getByText(/First comment/)).toBeTruthy();
    expect(getByText(/Second comment/)).toBeTruthy();
  });

  it('should show empty state when no comments', async () => {

    mockUseComments.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    await waitForAsync();

    expect(getByText('No comments yet')).toBeTruthy();
  });

  it('should render error state', () => {

    mockUseComments.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load comments'),
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    expect(getByText('Failed to load comments')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('should refetch when retry button is pressed', () => {
    const refetch = jest.fn();

    mockUseComments.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load comments'),
      refetch,
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    const retryButton = getByText('Retry');
    fireEvent.press(retryButton);

    expect(refetch).toHaveBeenCalled();
  });

  it('should show comment count in header', async () => {

    const mockComments = [
      createMockComment({ id: 1 }),
      createMockComment({ id: 2 }),
      createMockComment({ id: 3 }),
    ];

    mockUseComments.mockReturnValue({
      data: mockComments,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    await waitForAsync();

    expect(getByText('3 Comments')).toBeTruthy();
  });

  it('should handle stories with text content', async () => {
    const storyWithText = createMockStory({
      url: undefined,
      text: '<p>This is the story text content</p>',
    });

    mockUseComments.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText } = renderWithProviders(<StoryDetailScreen />);

    await waitForAsync();

    expect(getByText(/story text content/)).toBeTruthy();
  });

  it('should display correct comment count label', async () => {

    // Test with 1 comment
    mockUseComments.mockReturnValue({
      data: [createMockComment({ id: 1 })],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    const { getByText, rerender } = renderWithProviders(<StoryDetailScreen />);

    await waitForAsync();

    expect(getByText('1 Comment')).toBeTruthy();

    // Test with multiple comments
    mockUseComments.mockReturnValue({
      data: [createMockComment({ id: 1 }), createMockComment({ id: 2 })],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    rerender(<StoryDetailScreen />);

    await waitForAsync();

    expect(getByText('2 Comments')).toBeTruthy();
  });
});
