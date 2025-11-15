import React, { useCallback, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';

// Import specialized card components
import DidYouKnowCard from './DidYouKnowCard';
import GenericCard from './GenericCard';
import NewsCard from './NewsCard';
import OnThisDayCard from './OnThisDayCard';

interface FeaturedCarouselProps {
  items: any[];
  cardType?: 'on-this-day' | 'news' | 'did-you-know' | 'generic';
}

export default function FeaturedCarousel({ items, cardType = 'generic' }: FeaturedCarouselProps) {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const itemWidth = windowWidth - 32;

  // Select the appropriate card component based on cardType
  const getCardComponent = useCallback((item: any, index: number) => {
    switch (cardType) {
      case 'on-this-day':
        return <OnThisDayCard key={index} item={item} itemWidth={itemWidth} theme={theme} />;
      case 'news':
        return <NewsCard key={index} item={item} itemWidth={itemWidth} theme={theme} />;
      case 'did-you-know':
        return <DidYouKnowCard key={index} item={item} itemWidth={itemWidth} theme={theme} />;
      case 'generic':
      default:
        return <GenericCard key={index} item={item} itemWidth={itemWidth} theme={theme} />;
    }
  }, [cardType, itemWidth, theme]);

  // renderItem must be synchronous
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => getCardComponent(item, index),
    [getCardComponent]
  );

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={carouselRef}
        loop
        width={itemWidth - 16}
        height={320}
        data={items}
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        renderItem={renderItem}
        style={{ marginBottom: 0 }}
      />
    </View>
  );
}
