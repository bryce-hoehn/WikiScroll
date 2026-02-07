import { useFocusEffect } from '@react-navigation/native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Animated,
  Platform,
  RefreshControl,
  View,
  useWindowDimensions
} from 'react-native';
import { useTheme } from 'react-native-paper';

import SearchFAB from '@/components/search/SearchFAB';
import CardSkeleton from '@/components/skeleton/CardSkeleton';
import ScrollToTopMiniFAB from '@/components/ui/buttons/ScrollToTopMiniFAB';
import { LAYOUT } from '@/constants/layout';
import { SPACING } from '@/constants/spacing';
import { RecommendationCard } from '@/features/article';
import { useBookmarkToggle, useImagePrefetching } from '@/hooks';
import { useFeedScroll } from '@/stores/FeedScrollContext';
import { useScrollToTop } from '@/stores/ScrollToTopContext';
import { FeedProps, RecommendationItem } from '@/types/components';
import LoadingFooter from './LoadingFooter';

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
  const { width } = useWindowDimensions();
  const flashListRef = useRef<FlashListRef<FeedItem>>(null);
  const { handleBookmarkToggle, isBookmarked } = useBookmarkToggle();
  const { saveScrollPosition, getScrollPosition } = useFeedScroll();
  const { registerScrollRef, shouldScrollOnFocus, markFocused } =
    useScrollToTop();
  const [fabVisible, setFabVisible] = useState(false);
  const hasRestoredScrollRef = useRef(false);

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

  // Use refs to prevent infinite loops from context function changes
  const saveScrollPositionRef = React.useRef(saveScrollPosition);

  React.useEffect(() => {
    saveScrollPositionRef.current = saveScrollPosition;
  }, [saveScrollPosition]);

  // Create a stable fallback Animated.Value to prevent creating new values on every render
  // This is critical for preventing crashes on web
  const fallbackScrollY = React.useRef<Animated.Value>(new Animated.Value(0));
  const scrollYValue = scrollY || fallbackScrollY.current;

  // Create a stable scroll handler to prevent crashes on web
  // On web, use direct handler instead of Animated.event to avoid issues
  const handleScroll = React.useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      try {
        const yOffset = event.nativeEvent.contentOffset.y;
        setFabVisible(yOffset > 300);

        // Update animated value if provided
        if (scrollYValue) {
          scrollYValue.setValue(yOffset);
        }

        // Save scroll position on web - use ref to prevent stale closures
        if (Platform.OS === 'web' && feedKey) {
          saveScrollPositionRef.current(feedKey, yOffset);
        }
      } catch (error) {
        // Silently handle errors to prevent crashes
        if (__DEV__) {
          console.error('Error in scroll handler:', error);
        }
      }
    },
    [feedKey, scrollYValue]
  );

  // Calculate content width - centered on large screens, but narrower for cards
  // Account for left gutter (88px) + drawer (360px) = 448px and right sidebar (480px) on large screens
  const isLargeScreen = width >= LAYOUT.DESKTOP_BREAKPOINT; // Use MD3 desktop breakpoint
  const leftOffset = isLargeScreen ? 448 : 0; // gutter + drawer
  const rightOffset = isLargeScreen ? 480 : 0; // sidebar
  const availableWidth = width - leftOffset - rightOffset;

  const maxCardWidth = 650; // Reduced from 800 to 650 for tighter, more focused feed (Bluesky-like)
  const horizontalPadding =
    availableWidth > maxCardWidth
      ? (availableWidth - maxCardWidth) / 2
      : SPACING.base;
  // Card width: on large screens use maxCardWidth, on small screens use availableWidth minus padding
  const cardWidth =
    availableWidth > maxCardWidth
      ? maxCardWidth
      : availableWidth - SPACING.base * 2; // SPACING.base padding on each side

  const defaultRenderItem = useCallback(
    ({ item, index }: { item: RecommendationItem; index: number }) => (
      <View
        style={{
          marginBottom: SPACING.lg, // Increased from SPACING.base (16dp) to SPACING.lg (24dp) for more breathing room
          width: cardWidth,
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
    [isBookmarked, handleBookmarkToggle, cardWidth]
  );

  // Render item with ad support
  const renderItemWithAds = useCallback(
    ({ item, index }: { item: FeedItem; index: number }) => {
      if ('type' in item && item.type === 'ad') {
        return (
          <View
            style={{
              marginBottom: SPACING.lg,
              width: cardWidth,
              alignSelf: 'center'
            }}
          >
            <Suspense fallback={<View style={{ height: 90 }} />}>
              {React.createElement('div', {
                className: 'adsbygoogle',
                style: {
                  display: 'block',
                  minHeight: 90,
                  width: '100%'
                },
                'data-ad-client':
                  process.env.ADSENSE_AD_CLIENT || 'ca-pub-5306494001256992',
                'data-ad-slot': process.env.ADSENSE_AD_SLOT || '4212576009',
                'data-ad-format': 'fluid',
                'data-ad-layout-key':
                  process.env.ADSENSE_AD_LAYOUT_KEY || '-fb+5w+4e-db+86'
              })}
            </Suspense>
          </View>
        );
      }
      return defaultRenderItem({ item: item as RecommendationItem, index });
    },
    [defaultRenderItem, cardWidth]
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
              width: cardWidth,
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
            width: cardWidth,
            alignSelf: 'center'
          }}
        >
          <CardSkeleton index={index} />
        </View>
      );
    },
    [cardWidth, theme.colors.surfaceVariant]
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

  // Register scroll ref for scroll-to-top functionality
  // Use refs to prevent infinite loops from context function changes
  const feedKeyRef = React.useRef(feedKey);
  const registerScrollRefRef = React.useRef(registerScrollRef);
  const shouldScrollOnFocusRef = React.useRef(shouldScrollOnFocus);
  const markFocusedRef = React.useRef(markFocused);
  const getScrollPositionRef = React.useRef(getScrollPosition);

  React.useEffect(() => {
    feedKeyRef.current = feedKey;
    registerScrollRefRef.current = registerScrollRef;
    shouldScrollOnFocusRef.current = shouldScrollOnFocus;
    markFocusedRef.current = markFocused;
    getScrollPositionRef.current = getScrollPosition;
  }, [
    feedKey,
    registerScrollRef,
    shouldScrollOnFocus,
    markFocused,
    getScrollPosition
  ]);

  useEffect(() => {
    if (feedKeyRef.current) {
      registerScrollRefRef.current(feedKeyRef.current, {
        scrollToTop: () => {
          if (flashListRef.current) {
            flashListRef.current.scrollToOffset({ offset: 0, animated: true });
          }
        }
      });
    }
  }, []); // Empty dependencies - only run once per component mount

  useFocusEffect(
    useCallback(() => {
      if (feedKeyRef.current) {
        // Check if this route was already focused before (user is returning to it)
        const wasAlreadyFocused = shouldScrollOnFocusRef.current(
          feedKeyRef.current
        );

        // Mark this route as focused for future checks
        markFocusedRef.current(feedKeyRef.current);

        // If this route was already focused before, scroll to top
        // This handles the case where user navigates to the same tab again
        if (wasAlreadyFocused && flashListRef.current) {
          // Small delay to ensure the list is ready
          setTimeout(() => {
            flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
          }, 100);
        }
      }
    }, [])
  );

  // Restore scroll position when component mounts (web only)
  useEffect(() => {
    if (
      Platform.OS === 'web' &&
      feedKeyRef.current &&
      !hasRestoredScrollRef.current &&
      data.length > 0
    ) {
      const savedPosition = getScrollPositionRef.current(feedKeyRef.current);
      if (savedPosition !== undefined && flashListRef.current) {
        // Use setTimeout to ensure FlashList is ready
        setTimeout(() => {
          flashListRef.current?.scrollToOffset({
            offset: savedPosition,
            animated: false
          });
          hasRestoredScrollRef.current = true;
        }, 100);
      } else {
        hasRestoredScrollRef.current = true;
      }
    }
  }, [data.length]);

  if (loading && data.length === 0) {
    return (
      <View
        style={{ flex: 1 }}
        {...(Platform.OS === 'web' &&
          feedKey === 'for-you' && { id: 'main-content' })}
      >
        <FlashList
          ref={flashListRef}
          data={skeletonDataWithAds} // Show skeleton cards with ad placeholders
          renderItem={renderSkeletonItem}
          keyExtractor={keyExtractorWithAds}
          {...({ estimatedItemSize: 280 } as any)}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: SPACING.md, // Increased from SPACING.sm (8dp) to SPACING.md (12dp)
            paddingBottom: SPACING.lg, // Increased from SPACING.base (16dp) to SPACING.lg (24dp)
            paddingHorizontal: horizontalPadding,
            alignItems: 'center'
          }}
          showsVerticalScrollIndicator={false}
          onScroll={
            Platform.OS === 'web'
              ? handleScroll
              : Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollYValue } } }],
                  {
                    useNativeDriver: false, // Required for scroll position tracking
                    listener: handleScroll
                  }
                )
          }
          scrollEventThrottle={16}
        />
        <ScrollToTopMiniFAB scrollRef={flashListRef} visible={fabVisible} />
        <SearchFAB />
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1 }}
      // @ts-expect-error - main role is valid for React Native Web but not in TypeScript types
      accessibilityRole="main"
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
          paddingBottom: SPACING.lg, // Increased from SPACING.base (16dp) to SPACING.lg (24dp)
          paddingHorizontal: horizontalPadding,
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
        onScroll={
          Platform.OS === 'web'
            ? handleScroll
            : Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollYValue } } }],
                {
                  useNativeDriver: false, // Required for scroll position tracking
                  listener: handleScroll
                }
              )
        }
        scrollEventThrottle={16}
      />
      <ScrollToTopMiniFAB scrollRef={flashListRef} visible={fabVisible} />
      <SearchFAB />
    </View>
  );
}
