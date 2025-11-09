import React from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import TrendingListItem from './TrendingListItem';

interface TrendingCarouselProps {
  memoizedPages: any[][];
  itemWidth: number;
  progress: any;
  itemsPerPage: number;
  onPageChange: (index: number) => void;
}

export default function TrendingCarousel({ 
  memoizedPages, 
  itemWidth, 
  progress, 
  itemsPerPage, 
  onPageChange 
}: TrendingCarouselProps) {
  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop={true}
        width={itemWidth}
        height={420}
        autoPlay={false}
        data={memoizedPages}
        scrollAnimationDuration={300}
        onSnapToItem={onPageChange}
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        windowSize={3} // Only render current and adjacent pages for better performance
        renderItem={({ item: pageItems, index: pageIndex }) => (
          <List.Section style={{ flex: 1}}>
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
        )}
      />
    </View>
  );
}
