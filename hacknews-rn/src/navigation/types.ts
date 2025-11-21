import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { FeedType, Story } from '../api/types';

// Root Stack Navigator (main navigation)
export type RootStackParamList = {
  Home: undefined;
  StoryDetail: { story: Story };
  Article: { url: string; title: string; story: Story };
  Bookmarks: undefined;
  History: undefined;
};

// Bottom Tab Navigator (feed types)
export type TabParamList = {
  Top: undefined;
  New: undefined;
  Best: undefined;
  Ask: undefined;
  Show: undefined;
  Jobs: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

// Navigation helpers
export const feedTypeFromRoute = (
  routeName: keyof TabParamList
): FeedType => {
  const map: Record<keyof TabParamList, FeedType> = {
    Top: 'top',
    New: 'new',
    Best: 'best',
    Ask: 'ask',
    Show: 'show',
    Jobs: 'job',
  };
  return map[routeName];
};

// Augment React Navigation types
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
