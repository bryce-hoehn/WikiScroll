import { fetchArticleThumbnail } from '@/api';
import HtmlRenderer from '@/components/common/HtmlRenderer';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

function CarouselItem({ item, itemWidth, theme }: any) {
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);

  // Extract description
  const description =
    item?.html || item?.story || item?.text || '';

  // Extract year
  const year = item.year;

  // Load thumbnail dynamically based on item type
  useEffect(() => {
    const loadThumbnail = async () => {
      // On This Day
      if (item?.pages) {
        for (const page of item.pages) {
          if (page?.thumbnail?.source) {
            setThumbnail(page.thumbnail.source);
            return;
          }
        }
      }
      // In The News
      else if (item?.links) {
        for (const link of item.links) {
          if (link?.thumbnail?.source) {
            setThumbnail(link.thumbnail.source);
            return;
          }
        }
      }
      // Did You Know
      else if (item?.html) {
        const title = item.html.match(/title="([^"]*)"/)?.[1] || null;
        if (title) {
          const thumb = await fetchArticleThumbnail(title);
          if (thumb) {
            setThumbnail(thumb);
            return; // Important: return after setting thumbnail
          }
        }
      }
    };

    loadThumbnail();
  }, [item]);

  return (
    <>
      {year && (
        <Text
          variant="titleLarge"
          onPress={() => router.push(`/(zArticleStack)/${encodeURIComponent(year)}`)}
          style={{
            marginBottom: 8,
            fontWeight: 'bold',
            textAlign: 'left',
            color: theme.colors.primary,
          }}
        >
          {year}
        </Text>
      )}
      <View style={{ flex: 1 }}>
        <Card
          style={{
            width: '100%',
            height: 250,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {thumbnail && typeof thumbnail === 'string' && (
            <ImageBackground
              source={{ uri: thumbnail }}
              contentFit="cover"
              style={{ width: '100%', height: 250 }}
            >
              {/* Semi-transparent overlay covering entire image for better text contrast */}
              <View style={{ 
                position: 'absolute', 
                top: 0,
                bottom: 0,
                left: 0, 
                right: 0, 
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                justifyContent: 'flex-end',
                padding: 16,
              }}>
                <HtmlRenderer html={description} style={{color: 'white'}} />
              </View>
            </ImageBackground>
          )}
          {(!thumbnail || typeof thumbnail !== 'string') && (
            <View style={{ flex: 1, justifyContent: 'flex-end', padding: 16 }}>
              <HtmlRenderer html={description} />
            </View>
          )}
        </Card>
      </View>
    </>
  );
}

interface FeaturedCarouselProps {
  items: any[];
}

export default function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const itemWidth = windowWidth - 32;

  // renderItem must be synchronous
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <CarouselItem
        key={index}
        item={item}
        itemWidth={itemWidth}
        theme={theme}
      />
    ),
    [itemWidth, theme]
  );

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={carouselRef}
        loop
        width={itemWidth - 16}
        height={300}
        data={items}
        onProgressChange={progress}
        renderItem={renderItem}
      />
    </View>
  );
}
