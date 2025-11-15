import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  skeleton?: React.ReactNode;
}

/**
 * Reusable content section component for SearchScreen
 * Handles title, loading state, and content rendering
 */
export default function ContentSection({ 
  title, 
  children, 
  isLoading = false, 
  skeleton 
}: ContentSectionProps) {
  const theme = useTheme();

  if (isLoading && skeleton) {
    return skeleton;
  }

  if (!children) {
    return null;
  }

  return (
    <View style={{ marginBottom: 24 }}>
      <Text 
        variant="headlineMedium" 
        style={{ 
          marginBottom: 8, 
          fontWeight: 'bold',
          color: theme.colors.onSurface
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}