import React from 'react';
import { render } from '@testing-library/react-native';
import { StoryListItem } from '../../components/story/StoryListItem';
import { Story } from '../../api/types';

// Mock the theme hook
jest.mock('../../store/themeStore', () => ({
  useTheme: () => ({
    theme: {
      surface: '#ffffff',
      border: '#e0e0e0',
      text: '#000000',
      textSecondary: '#828282',
      textTertiary: '#999999',
      accent: '#ff6600',
    },
    isDark: false,
  }),
}));
jest.mock('../../store/bookmarksStore', () => ({
  useBookmarks: () => ({
    bookmarks: [],
    isBookmarked: jest.fn(() => false),
    toggleBookmark: jest.fn(),
  }),
}));
jest.mock('../../store/historyStore', () => ({
  useHistory: () => ({
    history: [],
    isRead: jest.fn(() => false),
  }),
}));

describe('StoryListItem', () => {
  const mockStory: Story = {
    id: 123,
    type: 'story',
    by: 'testuser',
    time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    title: 'Test Story Title',
    url: 'https://example.com',
    score: 42,
    descendants: 10,
  };

  const mockOnPress = jest.fn();
  const mockOnCommentsPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render story title', () => {
    const { getByText } = render(
      <StoryListItem
        story={mockStory}
        index={0}
        onPress={mockOnPress}
        onCommentsPress={mockOnCommentsPress}
      />
    );

    expect(getByText('Test Story Title')).toBeTruthy();
  });

  it('should render story metadata', () => {
    const { getByText } = render(
      <StoryListItem
        story={mockStory}
        index={0}
        onPress={mockOnPress}
        onCommentsPress={mockOnCommentsPress}
      />
    );

    expect(getByText(/42 points/)).toBeTruthy();
    expect(getByText(/testuser/)).toBeTruthy();
    expect(getByText(/10 comments/)).toBeTruthy();
  });

  it('should render story index', () => {
    const { getByText } = render(
      <StoryListItem
        story={mockStory}
        index={5}
        onPress={mockOnPress}
        onCommentsPress={mockOnCommentsPress}
      />
    );

    expect(getByText('6.')).toBeTruthy(); // index + 1
  });

  it('should render domain for stories with URLs', () => {
    const { getByText } = render(
      <StoryListItem
        story={mockStory}
        index={0}
        onPress={mockOnPress}
        onCommentsPress={mockOnCommentsPress}
      />
    );

    expect(getByText('(example.com)')).toBeTruthy();
  });

  it('should not render domain for stories without URLs', () => {
    const storyWithoutUrl = { ...mockStory, url: undefined };
    const { queryByText } = render(
      <StoryListItem
        story={storyWithoutUrl}
        index={0}
        onPress={mockOnPress}
        onCommentsPress={mockOnCommentsPress}
      />
    );

    expect(queryByText(/example.com/)).toBeNull();
  });

  it('should handle zero comments', () => {
    const storyWithNoComments = { ...mockStory, descendants: 0 };
    const { getByText } = render(
      <StoryListItem
        story={storyWithNoComments}
        index={0}
        onPress={mockOnPress}
        onCommentsPress={mockOnCommentsPress}
      />
    );

    expect(getByText('discuss')).toBeTruthy();
  });

  it('should handle missing score', () => {
    const storyWithoutScore = { ...mockStory, score: undefined };
    const { queryByText } = render(
      <StoryListItem
        story={storyWithoutScore}
        index={0}
        onPress={mockOnPress}
        onCommentsPress={mockOnCommentsPress}
      />
    );

    expect(queryByText(/points/)).toBeNull();
  });
});
