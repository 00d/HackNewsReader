import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

jest.mock('../../store/themeStore', () => ({
  useTheme: () => ({
    theme: {
      accent: '#ff6600',
      textSecondary: '#828282',
    },
  }),
}));

describe('LoadingSpinner', () => {
  it('should render without crashing', () => {
    const { root } = render(<LoadingSpinner />);
    expect(root).toBeTruthy();
  });

  it('should render with message', () => {
    const { getByText } = render(<LoadingSpinner message="Loading..." />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should render with small size', () => {
    const { root } = render(<LoadingSpinner size="small" />);
    expect(root).toBeTruthy();
  });

  it('should not render message when not provided', () => {
    const { queryByText } = render(<LoadingSpinner />);
    expect(queryByText(/./)).toBeNull(); // No text should be rendered
  });
});
