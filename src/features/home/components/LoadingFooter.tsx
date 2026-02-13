import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

import { SPACING } from '@/constants/spacing';

interface LoadingFooterProps {
  loading: boolean;
}

export default function LoadingFooter({ loading }: LoadingFooterProps) {
  const theme = useTheme();

  if (!loading) return null;

  return (
    <View
      style={{
        padding: SPACING.lg,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.md
      }}
    >
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant, fontWeight: '500' }}
      >
        Loading more recommendations...
      </Text>
    </View>
  );
}
