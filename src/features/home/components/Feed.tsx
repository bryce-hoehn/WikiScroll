import { FlashList, FlashListRef } from '@shopify/flash-list';
import React, { Suspense, useCallback, useMemo, useRef } from 'react';
import { Animated, Platform, RefreshControl, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import SearchFAB from '@/components/search/SearchFAB';
import CardSkeleton from '@/components/skeleton/CardSkeleton';
import { SPACING } from '@/constants/spacing';
import { useBookmarkToggle, useImagePrefetching } from '@/hooks';
import { FeedProps, RecommendationItem } from '@/types/components';

import { RecommendationCard } from '@/features/article';
import LoadingFooter from './LoadingFooter';

import AdManager from '@/components/ads/AdManager';
import { LAYOUT } from '@/constants/layout';

// Type for feed items that can be either content or ads
type FeedItem = RecommendationItem | { type: 'ad'; id: string };

// Configuration for ad insertion
const AD_INTERVAL = 7; // Show ad every 7 items

export default function Feed({
  data,
  loading,
  refreshing,
  onRefresh,
  loadMore,
  renderEmptyState,
  keyExtractor,
  renderItem,
  feedKey,
  scrollY
}: FeedProps & { feedKey?: string; scrollY?: Animated.Value }) {
  const theme = useTheme();
  const flashListRef = useRef<FlashListRef<FeedItem>>(null);
  const { handleBookmarkToggle, isBookmarked } = useBookmarkToggle();

  // Transform data to include ads at regular intervals
  const dataWithAds = useMemo(() => {
    if (data.length === 0) return [];

    const items: FeedItem[] = [];
    data.forEach((item, index) => {
      items.push(item);
      // Insert ad after every AD_INTERVAL items (but not after the last item)
      if ((index + 1) % AD_INTERVAL === 0 && index < data.length - 1) {
        items.push({ type: 'ad', id: `ad-${index}` });
      }
    });
    return items;
  }, [data]);

  // Image prefetching: Prefetch images for items about to become visible
  const { onViewableItemsChanged } = useImagePrefetching({
    data: data, // Use original data for prefetching (ads don't have images)
    getImageUrl: (item: RecommendationItem) => item?.thumbnail?.source,
    preferredWidth: 800 // Standard width for feed images
  });

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50, // Item is considered visible when 50% is shown
    minimumViewTime: 100 // Minimum time item must be visible (ms)
  }).current;

  const defaultRenderItem = useCallback(
    ({ item, index }: { item: RecommendationItem; index: number }) => (
      <View
        style={{
          marginBottom: SPACING.lg,
          width: LAYOUT.CARD_WIDTH,
          alignSelf: 'center'
        }}
      >
        <RecommendationCard
          item={item}
          index={index}
          isBookmarked={isBookmarked}
          onBookmarkToggle={handleBookmarkToggle}
        />
      </View>
    ),
    [isBookmarked, handleBookmarkToggle]
  );

  // Render item with ad support
  const renderItemWithAds = useCallback(
    ({ item, index }: { item: FeedItem; index: number }) => {
      if ('type' in item && item.type === 'ad') {
        return (
          <View
            style={{
              marginBottom: SPACING.lg,
              width: LAYOUT.CARD_WIDTH,
              alignSelf: 'center'
            }}
          >
            <Suspense fallback={<View style={{ height: 90 }} />}>
              <AdManager />
            </Suspense>
          </View>
        );
      }
      return defaultRenderItem({ item: item as RecommendationItem, index });
    },
    [defaultRenderItem]
  );

  // Key extractor that handles both content and ad items
  const keyExtractorWithAds = useCallback(
    (item: FeedItem) => {
      if ('type' in item && item.type === 'ad') {
        return (item as { type: 'ad'; id: string }).id;
      }
      return keyExtractor(item as RecommendationItem);
    },
    [keyExtractor]
  );

  const renderFooter = useCallback(
    () => <LoadingFooter loading={loading && data.length > 0} />,
    [loading, data.length]
  );

  // Render skeleton loaders when initial loading
  const renderSkeletonItem = useCallback(
    ({ item, index }: { item: FeedItem; index: number }) => {
      if ('type' in item && item.type === 'ad') {
        // Render ad placeholder skeleton
        return (
          <View
            style={{
              marginBottom: SPACING.lg,
              width: LAYOUT.CARD_WIDTH,
              alignSelf: 'center',
              height: 60, // Approximate height for banner ad
              backgroundColor: theme.colors.surfaceVariant,
              borderRadius: 8
            }}
          />
        );
      }
      return (
        <View
          style={{
            marginBottom: SPACING.lg,
            width: LAYOUT.CARD_WIDTH,
            alignSelf: 'center'
          }}
        >
          <CardSkeleton index={index} />
        </View>
      );
    },
    [theme.colors.surfaceVariant]
  );

  // Create skeleton data with ad placeholders for consistent loading experience
  const skeletonDataWithAds = useMemo(() => {
    const items: FeedItem[] = [];
    for (let i = 0; i < 15; i++) {
      items.push({ title: `skeleton-${i}` } as RecommendationItem);
      // Insert ad placeholder after every AD_INTERVAL items
      if ((i + 1) % AD_INTERVAL === 0 && i < 14) {
        items.push({ type: 'ad', id: `skeleton-ad-${i}` });
      }
    }
    return items;
  }, []);

  if (loading && data.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <FlashList
          ref={flashListRef}
          data={skeletonDataWithAds} // Show skeleton cards with ad placeholders
          renderItem={renderSkeletonItem}
          keyExtractor={keyExtractorWithAds}
          {...({ estimatedItemSize: 280 } as any)}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: SPACING.md,
            paddingBottom: SPACING.lg,
            paddingHorizontal: SPACING.lg,
            alignItems: 'center'
          }}
          showsVerticalScrollIndicator={false}
        />
        <SearchFAB />
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1 }}
      {...(Platform.OS === 'web' &&
        feedKey === 'for-you' && {
          id: 'main-content',
          tabIndex: -1
        })}
    >
      <FlashList
        ref={flashListRef}
        data={dataWithAds}
        renderItem={renderItemWithAds}
        keyExtractor={keyExtractorWithAds}
        {...({
          estimatedItemSize: 280,
          initialNumToRender: 15, // Preload 15 items initially
          windowSize: 10, // Render 10 screens worth of items
          drawDistance: 500 // Start rendering items 500px before they're visible
        } as any)}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: SPACING.md, // Increased from SPACING.sm (8dp) to SPACING.md (12dp)
          paddingBottom: SPACING.lg, // Increased from SPACING.sm (16dp) to SPACING.lg (24dp)
          paddingHorizontal: SPACING.lg,
          alignItems: 'center',
          ...(data.length === 0 && {
            justifyContent: 'center'
          })
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
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />
      <SearchFAB />
    </View>
  );
}
