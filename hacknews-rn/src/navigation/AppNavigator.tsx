import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useTheme } from '../store/themeStore';
import { RootStackParamList, TabParamList } from './types';
import FeedScreen from '../screens/FeedScreen';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import ArticleScreen from '../screens/ArticleScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Bottom Tab Navigator with all feed types
function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Top"
        component={FeedScreen}
        options={{ tabBarLabel: 'Top' }}
      />
      <Tab.Screen
        name="New"
        component={FeedScreen}
        options={{ tabBarLabel: 'New' }}
      />
      <Tab.Screen
        name="Best"
        component={FeedScreen}
        options={{ tabBarLabel: 'Best' }}
      />
      <Tab.Screen
        name="Ask"
        component={FeedScreen}
        options={{ tabBarLabel: 'Ask' }}
      />
      <Tab.Screen
        name="Show"
        component={FeedScreen}
        options={{ tabBarLabel: 'Show' }}
      />
      <Tab.Screen
        name="Jobs"
        component={FeedScreen}
        options={{ tabBarLabel: 'Jobs' }}
      />
    </Tab.Navigator>
  );
}

// Header button components
function HeaderButtons() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate('Bookmarks')}
        style={styles.headerButton}
      >
        <Text style={[styles.headerButtonText, { color: theme.accent }]}>
          ★
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('History')}
        style={styles.headerButton}
      >
        <Text style={[styles.headerButtonText, { color: theme.accent }]}>
          📖
        </Text>
      </TouchableOpacity>
    </>
  );
}

// Root Stack Navigator
export default function AppNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.accent,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.border,
          notification: theme.accent,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.surface,
          },
          headerTintColor: theme.accent,
          headerTitleStyle: {
            color: theme.text,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{
            title: 'Hacker News',
            headerLargeTitle: false,
            headerRight: () => <HeaderButtons />,
          }}
        />
        <Stack.Screen
          name="StoryDetail"
          component={StoryDetailScreen}
          options={{ title: 'Comments' }}
        />
        <Stack.Screen
          name="Article"
          component={ArticleScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen
          name="Bookmarks"
          component={BookmarksScreen}
          options={{ title: 'Bookmarks' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Reading History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginLeft: 16,
  },
  headerButtonText: {
    fontSize: 20,
  },
});
