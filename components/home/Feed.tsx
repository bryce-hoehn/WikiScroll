import React, { useCallback, useRef } from 'react';
import {
  FlatList,
  RefreshControl,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useBookmarks } from '../../hooks';
import { FeedProps, RecommendationItem } from '../../types/components';
import RecommendationCard from '../article/RecommendationCard';
import LoadingFooter from './LoadingFooter';

export default function Feed({
  data,
  loading,
  refreshing,
  onRefresh,
  loadMore,
  renderEmptyState,
  keyExtractor,
  renderItem,
}: FeedProps) {
  const theme = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const handleBookmarkToggle = useCallback(async (item: RecommendationItem) => {
    const bookmarked = isBookmarked(item.title);
    
    if (bookmarked) {
      await removeBookmark(item.title);
    } else {
      await addBookmark(item.title, item.thumbnail, item.description);
    }
  }, [addBookmark, removeBookmark, isBookmarked]);

  const defaultRenderItem = useCallback(({ item, index }: { item: RecommendationItem; index: number }) => (
    <RecommendationCard
      item={item}
      index={index}
      isBookmarked={isBookmarked}
      onBookmarkToggle={handleBookmarkToggle}
    />
  ), [isBookmarked, handleBookmarkToggle]);

  const renderFooter = useCallback(() => (
    <LoadingFooter loading={loading && data.length > 0} />
  ), [loading, data.length]);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItem || defaultRenderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{
        flexGrow: 1,
        gap: 8,
        ...(data.length === 0 && { justifyContent: 'center' })
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={7}
      removeClippedSubviews={false}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
    />
  );
}
