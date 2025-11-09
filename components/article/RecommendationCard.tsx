import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';

import { RecommendationCardProps } from '../../types/components';

export default function RecommendationCard({ 
  item, 
  index, 
  isBookmarked, 
  onBookmarkToggle 
}: RecommendationCardProps) {
  const theme = useTheme();

  return (
    <View style={{ alignItems: 'center' }}>
      <Card 
        style={{
          width: '100%',
          marginBottom: 16,
          borderRadius: 8,
          elevation: 1,
          overflow: 'hidden',
        }}
        onPress={() => router.push(`/(zArticleStack)/${encodeURIComponent(item.title)}`)}
      >
        {/* Article Image */}
        {item.thumbnail && (
          <Image 
            source={{ uri: item.thumbnail.source }} 
            style={{ 
              height: 300,
              width: '100%',
              backgroundColor: theme.colors.surfaceVariant
            }}
            contentFit="cover"
          />
        )}

        {/* Article Content */}
        <Card.Content style={{ padding: 20 }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <Text 
              variant="titleLarge" 
              style={{ 
                fontWeight: '700', 
                lineHeight: 24,
                color: theme.colors.onSurface,
                flex: 1,
                marginRight: 12
              }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <IconButton
              icon={isBookmarked(item.title) ? "bookmark" : "bookmark-outline"}
              iconColor={isBookmarked(item.title) ? theme.colors.primary : theme.colors.onSurfaceVariant}
              onPress={(e) => {
                e.stopPropagation(); // Prevent card navigation
                onBookmarkToggle(item);
              }}
              style={{ margin: 0 }}
            />
          </View>
          <Text 
            variant="bodyMedium" 
            style={{ 
              color: theme.colors.onSurfaceVariant,
              lineHeight: 20,
            }}
            numberOfLines={3}
            >
            {item.description}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}
