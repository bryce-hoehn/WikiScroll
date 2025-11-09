import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

// Skeleton component for featured article
export function FeaturedArticleSkeleton() {
  const theme = useTheme();
  
  return (
    <View style={{ 
      width: '100%',
      padding: 20,
      borderRadius: 16,
    }}>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View style={{ 
          width: 100, 
          height: 100, 
          backgroundColor: theme.colors.surfaceVariant, 
          borderRadius: 8 
        }} />
        <View style={{ flex: 1, gap: 8 }}>
          <View style={{ 
            height: 20, 
            backgroundColor: theme.colors.surfaceVariant, 
            borderRadius: 4 
          }} />
          <View style={{ 
            height: 16, 
            backgroundColor: theme.colors.surfaceVariant, 
            borderRadius: 4, 
            width: '80%' 
          }} />
          <View style={{ 
            height: 16, 
            backgroundColor: theme.colors.surfaceVariant, 
            borderRadius: 4, 
            width: '60%' 
          }} />
        </View>
      </View>
    </View>
  );
}

// Skeleton component for featured picture
export function FeaturedPictureSkeleton() {
  const theme = useTheme();
  
  return (
    <View style={{ 
      width: '100%',
      padding: 20,
      borderRadius: 16,
    }}>
      <View style={{ gap: 12 }}>
        <View style={{ 
          height: 20, 
          backgroundColor: theme.colors.surfaceVariant, 
          borderRadius: 4, 
          width: '70%' 
        }} />
        <View style={{ 
          height: 200, 
          backgroundColor: theme.colors.surfaceVariant, 
          borderRadius: 8 
        }} />
        <View style={{ 
          height: 16, 
          backgroundColor: theme.colors.surfaceVariant, 
          borderRadius: 4, 
          width: '90%' 
        }} />
      </View>
    </View>
  );
}

// Skeleton component for Featured Carousel (replaces DidYouKnowSkeleton and OnThisDaySkeleton)
export function FeaturedCarouselSkeleton() {
  const theme = useTheme();
  
  return (
    <View style={{ 
      width: '100%',
      padding: 20,
      borderRadius: 16,
    }}>
      <View style={{ gap: 12 }}>
        <View style={{ 
          height: 20, 
          backgroundColor: theme.colors.surfaceVariant, 
          borderRadius: 4, 
          width: '60%' 
        }} />
        <View style={{ 
          height: 60, 
          backgroundColor: theme.colors.surfaceVariant, 
          borderRadius: 8 
        }} />
        <View style={{ 
          height: 16, 
          backgroundColor: theme.colors.surfaceVariant, 
          borderRadius: 4, 
          width: '80%' 
        }} />
        <View style={{ 
          height: 16, 
          backgroundColor: theme.colors.surfaceVariant, 
          borderRadius: 4, 
          width: '70%' 
        }} />
      </View>
    </View>
  );
}
