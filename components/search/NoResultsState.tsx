import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface NoResultsStateProps {
  query: string;
}

export default function NoResultsState({ query }: NoResultsStateProps) {
  const theme = useTheme();

  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 16 }}>
        {`No results found for "${query}"`}
      </Text>
    </View>
  );
}
