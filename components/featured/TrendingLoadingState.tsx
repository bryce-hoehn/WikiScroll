import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export default function TrendingLoadingState() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ActivityIndicator size="large" />
      <Text variant="bodyLarge" style={{ marginTop: 12, color: theme.colors.onSurfaceVariant }}>
        Loading trending articles...
      </Text>
    </View>
  );
}
