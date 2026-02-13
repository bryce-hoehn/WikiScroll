import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Card, List, useTheme } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

import TrendingListItem from './TrendingListItem';

interface TrendingCarouselProps {
  ref?: React.Ref<any>;
  memoizedPages: any[][];
  itemWidth: number;
  itemsPerPage: number;
  onPageChange: (index: number) => void;
  currentPage: number;
}

// React 19: ref is now a regular prop, no need for forwardRef
function TrendingCarousel({
  ref,
  memoizedPages,
  itemWidth,
  itemsPerPage,
  onPageChange,
  currentPage
}: TrendingCarouselProps) {
  const theme = useTheme();

  const containerHeight = 410;

  const renderPage = useCallback(
    ({ item: pageItems, index: pageIndex }: { item: any[]; index: number }) => {
      const cardWidth = itemWidth - 12;

      return (
        <View
          style={{
            width: itemWidth,
            height: containerHeight + 8,
            paddingLeft: 4,
            paddingRight: 8,
            paddingBottom: 4,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Card
            style={{
              width: cardWidth,
              height: containerHeight + 8,
              backgroundColor: theme.colors.elevation.level2,
              borderRadius: theme.roundness * 3,
              overflow: 'hidden'
            }}
            contentStyle={{
              padding: 0,
              paddingBottom: 0,
              height: containerHeight + 8
            }}
          >
            <List.Section
              style={{
                height: containerHeight + 8,
                backgroundColor: 'transparent',
                paddingVertical: 0,
                paddingTop: 0,
                paddingBottom: 10,
                marginTop: 0,
                marginBottom: 0
              }}
            >
              {pageItems.map((item: any, itemIndex: number) => {
                const isFirst = itemIndex === 0;
                const isLast = itemIndex === pageItems.length - 1;

                return (
                  <TrendingListItem
                    key={item.id}
                    item={item}
                    itemIndex={itemIndex}
                    pageIndex={pageIndex}
                    itemsPerPage={itemsPerPage}
                    isFirst={isFirst}
                    isLast={isLast}
                  />
                );
              })}
            </List.Section>
          </Card>
        </View>
      );
    },
    [itemWidth, containerHeight, itemsPerPage, theme]
  );

  return (
    <Carousel
      width={itemWidth}
      height={containerHeight + 8}
      data={memoizedPages}
      renderItem={renderPage}
      loop={true}
      autoPlay={false}
      style={{ backgroundColor: theme.colors.background }}
    />
  );
}

export default TrendingCarousel;
