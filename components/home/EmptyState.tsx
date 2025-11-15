import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, IconButton, Text, useTheme } from 'react-native-paper';

interface EmptyStateProps {
  type?: 'welcome' | 'loading' | 'no-history';
  onRefresh?: () => void;
  // Custom props for more flexibility
  icon?: string;
  title?: string;
  description?: string;
  showSpinner?: boolean;
}

export default function EmptyState({ 
  type, 
  onRefresh, 
  icon,
  title,
  description,
  showSpinner = false
}: EmptyStateProps) {
  const theme = useTheme();

  const getConfig = () => {
    // Use custom props if provided
    if (icon || title || description ) {
      return {
        icon: icon || 'book-open-blank-variant',
        title: title || 'Welcome to Wikipedia Expo',
        description: description || 'Start exploring articles to get personalized recommendations tailored to your interests.'
      };
    }

    // Fall back to type-based config
    switch (type) {
      default:
        return {
          icon: 'book-open-blank-variant',
          title: 'Welcome to Wikipedia Expo',
          description: 'Start exploring articles to get personalized recommendations tailored to your interests.',
        };
    }
  };

  const config = getConfig();

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 40, 
      minHeight: 500 
    }}>
      <View style={{ 
        width: 80, 
        height: 80, 
        borderRadius: 40,
        backgroundColor: theme.colors.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <IconButton
          icon={config.icon}
          iconColor={theme.colors.onSurfaceVariant}
          size={40}
          style={{ margin: 0 }}
        />
      </View>
      <Text variant="headlineSmall" style={{ 
        textAlign: 'center', 
        marginBottom: 16, 
        fontWeight: '700',
        color: theme.colors.onSurface
      }}>
        {config.title}
      </Text>
      <Text variant="bodyLarge" style={{ 
        textAlign: 'center', 
        marginBottom: 32, 
        color: theme.colors.onSurfaceVariant, 
        lineHeight: 24 
      }}>
        {config.description}
      </Text>
      
      {showSpinner && (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      )}
    </View>
  );
}
