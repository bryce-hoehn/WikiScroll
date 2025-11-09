import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function TrendingEmptyState() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
        No trending articles available
      </Text>
    </View>
  );
}
