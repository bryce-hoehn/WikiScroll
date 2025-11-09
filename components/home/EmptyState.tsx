import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, IconButton, Text, useTheme } from 'react-native-paper';

interface EmptyStateProps {
  type?: 'welcome' | 'loading' | 'no-history';
  onRefresh?: () => void;
  // Custom props for more flexibility
  icon?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  buttonIcon?: string;
  buttonMode?: 'contained' | 'outlined' | 'text';
  // New prop to show spinner instead of button
  showSpinner?: boolean;
}

export default function EmptyState({ 
  type, 
  onRefresh, 
  icon,
  title,
  description,
  buttonText,
  buttonAction,
  buttonIcon,
  buttonMode = 'contained',
  showSpinner = false
}: EmptyStateProps) {
  const theme = useTheme();
  const router = useRouter();

  const getConfig = () => {
    // Use custom props if provided
    if (icon || title || description || buttonText || buttonAction || buttonIcon) {
      return {
        icon: icon || 'book-open-blank-variant',
        title: title || 'Welcome to Wikipedia Expo',
        description: description || 'Start exploring articles to get personalized recommendations tailored to your interests.',
        buttonText: buttonText || 'Explore Articles',
        buttonAction: buttonAction || (() => router.push('/search')),
        buttonIcon: buttonIcon || 'magnify',
        buttonMode,
      };
    }

    // Fall back to type-based config
    switch (type) {
      case 'welcome':
        return {
          icon: 'book-open-blank-variant',
          title: 'Welcome to Wikipedia Expo',
          description: 'Start exploring articles to get personalized recommendations tailored to your interests.',
          buttonText: 'Explore Articles',
          buttonAction: () => router.push('/search'),
          buttonIcon: 'magnify',
          buttonMode: 'contained' as const,
        };
      case 'loading':
        return {
          icon: 'chart-timeline-variant',
          title: 'Finding Recommendations',
          description: "We're analyzing your reading history to find the perfect articles for you.",
          buttonText: 'Refresh Recommendations',
          buttonAction: onRefresh,
          buttonIcon: 'refresh',
          buttonMode: 'outlined' as const,
        };
      case 'no-history':
        return {
          icon: 'book-open-blank-variant',
          title: 'Welcome to Wikipedia Expo',
          description: 'Start exploring articles to get personalized recommendations tailored to your interests.',
          buttonText: 'Explore Articles',
          buttonAction: () => router.push('/search'),
          buttonIcon: 'magnify',
          buttonMode: 'contained' as const,
        };
      default:
        return {
          icon: 'book-open-blank-variant',
          title: 'Welcome to Wikipedia Expo',
          description: 'Start exploring articles to get personalized recommendations tailored to your interests.',
          buttonText: 'Explore Articles',
          buttonAction: () => router.push('/search'),
          buttonIcon: 'magnify',
          buttonMode: 'contained' as const,
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
      
      {showSpinner ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <Button 
          mode={config.buttonMode}
          onPress={config.buttonAction}
          style={{ 
            borderRadius: 12,
            paddingHorizontal: 24
          }}
          contentStyle={{ paddingVertical: 8 }}
          icon={config.buttonIcon}
        >
          {config.buttonText}
        </Button>
      )}
    </View>
  );
}
