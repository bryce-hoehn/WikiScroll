import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import SearchBar from '@/components/search/SearchBar';
import { LAYOUT } from '@/constants/layout';
import { SPACING } from '@/constants/spacing';
import FeaturedArticleSection from '@/features/discover/components/FeaturedArticleSection';
import FeaturedCarouselSection from '@/features/discover/components/FeaturedCarouselSection';
import FeaturedPictureSection from '@/features/discover/components/FeaturedPictureSection';
import TrendingSection from '@/features/discover/components/TrendingSection';
import { useFeaturedContent } from '@/stores/FeaturedContentContext';

export default function SearchScreen() {
  const { featuredContent, isLoading } = useFeaturedContent();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const flashListRef = useRef<any>(null);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = useCallback(async () => {
    if (searchQuery.trim()) {
      const { findBestArticleMatch } =
        await import('@/utils/fuzzyArticleSearch');
      const bestMatch = await findBestArticleMatch(searchQuery.trim());
      if (bestMatch) {
        router.push(`/article/${encodeURIComponent(bestMatch)}`);
      }
    }
  }, [searchQuery]);

  const contentItems = useMemo(
    () =>
      [
        {
          key: 'featured-article',
          content: <FeaturedArticleSection />
        },
        {
          key: 'in-the-news',
          content: (
            <FeaturedCarouselSection
              title="In The News"
              items={featuredContent?.news
                ?.map((newsItem, index) => {
                  // Use the first link for navigation and thumbnail
                  const firstLink = newsItem.links?.[0];
                  if (!firstLink) return null; // Filter out items without links
                  return {
                    title: firstLink.title || 'News Story',
                    description:
                      newsItem.story ||
                      firstLink.description ||
                      firstLink.title ||
                      'Latest news',
                    thumbnail: firstLink.thumbnail,
                    pageid: firstLink.pageid,
                    // Add the full article title for navigation
                    articleTitle: firstLink.title,
                    // Add links array for the carousel item to handle multiple articles
                    links: newsItem.links
                  };
                })
                .filter(
                  (item): item is NonNullable<typeof item> => item !== null
                )}
              cardType="news"
            />
          )
        },
        {
          key: 'did-you-know',
          content: (
            <FeaturedCarouselSection
              title="Did You Know?"
              items={featuredContent?.dyk?.map((item) => {
                const titleMatch = item.html.match(/title="([^"]*)"/);
                const title = titleMatch?.[1] || 'Did You Know?';

                return {
                  title,
                  description: item.html, // Keep HTML for proper rendering
                  html: item.html // Add explicit html field for Did You Know items
                };
              })}
              cardType="did-you-know"
            />
          )
        },
        {
          key: 'featured-picture',
          content: <FeaturedPictureSection />
        },
        {
          key: 'trending',
          content: <TrendingSection />
        },
        {
          key: 'on-this-day',
          content: (
            <FeaturedCarouselSection
              title="On This Day"
              items={featuredContent?.onthisday?.map((item) => ({
                title: item.text.substring(0, 100) + '...',
                description: item.text,
                html: item.text, // Add HTML field for proper rendering with links
                thumbnail: item.pages?.[0]?.thumbnail,
                year: item.year, // Add the year from the OnThisDayItem
                page: item.pages?.[0],
                articleTitle: item.pages?.[0]?.title
              }))}
              cardType="on-this-day"
            />
          )
        }
      ].filter((item) => {
        // Filter out sections that don't have content (except during loading)
        if (isLoading) return true;

        // Check if the section has actual content
        switch (item.key) {
          case 'featured-article':
            return !!featuredContent?.tfa;
          case 'in-the-news':
            return !!featuredContent?.news?.length;
          case 'did-you-know':
            return !!featuredContent?.dyk?.length;
          case 'featured-picture':
            return !!featuredContent?.image;
          case 'trending':
            return !!featuredContent?.mostread;
          case 'on-this-day':
            return !!featuredContent?.onthisday?.length;
          default:
            return false;
        }
      }),
    [featuredContent, isLoading]
  );

  const renderItem = useCallback(
    ({ item }: { item: { key: string; content: React.ReactNode } }) => (
      <View
        style={{
          flex: 1,
          margin: SPACING.sm,
          minWidth: 0,
          alignSelf: 'stretch'
        }}
      >
        {item.content}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: { key: string; content: React.ReactNode }) => item.key,
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        onSubmitEditing={handleSearchSubmit}
        onIconPress={handleSearchSubmit}
        style={{ width: '100%', padding: SPACING.sm }}
      />
      <FlashList
        ref={flashListRef}
        data={contentItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          maxWidth: LAYOUT.MAX_CONTENT_WIDTH,
          alignSelf: 'center',
          width: '100%',
          padding: SPACING.sm
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false
          }
        )}
      />
    </View>
  );
}
