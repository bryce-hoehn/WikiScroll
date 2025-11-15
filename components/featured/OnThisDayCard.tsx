import HtmlRenderer from '@/components/common/HtmlRenderer';
import useThumbnailLoader from '@/hooks/ui/useThumbnailLoader';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface OnThisDayCardProps {
  item: any;
  itemWidth: number;
  theme: any;
}

function OnThisDayCard({ item, theme }: OnThisDayCardProps) {
  // Use the year from the OnThisDayItem
  const year = item.year;
  const thumbnail = useThumbnailLoader(item);

  // Handle card press - navigate to first page if available
  const handleCardPress = useCallback(() => {
    if (item?.pages?.[0]?.title) {
      router.push(`/(zArticleStack)/${encodeURIComponent(item.pages[0].title)}`);
    } else if (item?.articleTitle) {
      router.push(`/(zArticleStack)/${encodeURIComponent(item.articleTitle)}`);
    }
  }, [item]);

  return (
    <View style={{ flex: 1 }}>
      {year && (
        <Text
          variant="titleLarge"
          onPress={() => router.push(`/(zArticleStack)/${encodeURIComponent(year)}`)}
          style={{
            fontWeight: 'bold',
            color: theme.colors.primary,
            marginBottom: 8,
          }}
        >
          {year}
        </Text>
      )}
      <Card
        style={{
          width: '100%',
          borderRadius: 12,
          overflow: 'hidden',
        }}
        onPress={handleCardPress}
      >
        <View style={{ height: 160, width: '100%', backgroundColor: theme.colors.surfaceVariant }}>
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              style={{ height: 160, width: '100%' }}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                No Image
              </Text>
            </View>
          )}
        </View>
        <Card.Content style={{ padding: 12 }}>
          <HtmlRenderer
            html={item.html || item.text || 'No content available'}
            maxLines={6}
            style={{ paddingTop: 12 }}
          />
        </Card.Content>
      </Card>
    </View>
  );
}

export default memo(OnThisDayCard);