import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { useTheme } from '../store/themeStore';
import { useHistory } from '../store/historyStore';

export default function ArticleScreen() {
  const route = useRoute<RootStackScreenProps<'Article'>['route']>();
  const { theme } = useTheme();
  const { url, story } = route.params;
  const [loading, setLoading] = useState(true);
  const { markAsRead } = useHistory();

  // Mark story as read when viewing article
  useEffect(() => {
    markAsRead(story, 'article');
  }, [story.id, markAsRead]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <WebView
        source={{ uri: url }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={styles.webview}
        // Security settings
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
