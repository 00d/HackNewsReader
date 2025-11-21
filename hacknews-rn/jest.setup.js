// Setup file for Jest

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock WebView
jest.mock('react-native-webview', () => {
  return {
    WebView: jest.fn(),
  };
});

// Mock useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => {
  return {
    default: jest.fn(() => 'light'),
  };
});

// Mock FlashList
jest.mock('@shopify/flash-list', () => {
  const React = require('react');
  const { FlatList } = require('react-native');

  return {
    FlashList: React.forwardRef((props, ref) => {
      return React.createElement(FlatList, {
        ...props,
        ref,
        estimatedItemSize: undefined,
      });
    }),
  };
});
