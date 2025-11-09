import { fetchRandomArticle } from '@/api/articles';
import {
  FeaturedArticleCard,
  FeaturedCarousel,
  FeaturedPictureCard
} from '@/components/featured';
import TrendingList from '@/components/featured/Trending';
import SearchOverlay from '@/components/search/SearchOverlay';
import {
  FeaturedArticleSkeleton,
  FeaturedCarouselSkeleton,
  FeaturedPictureSkeleton
} from '@/components/search/SkeletonComponents';
import { useFeaturedContent } from '@/context/FeaturedContentContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Appbar, Searchbar, Text, useTheme } from 'react-native-paper';

export default function SearchScreen() {
  const theme = useTheme();
  const { featuredContent, isLoading } = useFeaturedContent();
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const handleSearchOpen = () => {
    setShowSearchOverlay(true);
  };

  const handleSearchClose = () => {
    setShowSearchOverlay(false);
  };

  const handleRandomArticle = async () => {
    try {
      const randomArticle = await fetchRandomArticle();
      
      if (randomArticle?.article?.title) {
        router.push({
          pathname: '/(zArticleStack)/[title]',
          params: { title: randomArticle?.article?.title }
        });
      }
    } catch (error) {
      console.error('Failed to fetch random article:', error);
    }
  };

  // Content items array - restored all featured content types
  const contentItems = [
    {
      key: 'featured-article',
      content: isLoading ? (
        <FeaturedArticleSkeleton />
      ) : featuredContent?.tfa ? (
        <>
          <Text variant="headlineMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
            Featured Article
          </Text>
          <FeaturedArticleCard />
        </>
      ) : null
    },
    {
      key: 'in-the-news',
      content: isLoading ? (
        <FeaturedCarouselSkeleton />
      ) : featuredContent?.news ? (
        <>
          <Text variant="headlineMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
            In The News
          </Text>
          <FeaturedCarousel items={featuredContent.news}/>
        </>
      ) : null
    },
    {
      key: 'did-you-know',
      content: isLoading ? (
        <FeaturedCarouselSkeleton />
      ) : featuredContent?.dyk ? (
        <>
          <Text variant="headlineMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
            Did You Know?
          </Text>
          <FeaturedCarousel items={featuredContent.dyk} />
        </>
      ) : null
    },
    {
      key: 'featured-picture',
      content: isLoading ? (
        <FeaturedPictureSkeleton />
      ) : featuredContent?.image ? (
        <>
          <Text variant="headlineMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
            Featured Picture
          </Text>
          <FeaturedPictureCard />
        </>
      ) : null
    },
    {
      key: 'trending',
      content: isLoading ? (
        <FeaturedCarouselSkeleton />
      ) : featuredContent?.mostread ? (
        <>
          <Text variant="headlineMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
            Trending Articles
          </Text>
          <TrendingList />
        </>
      ) : null
    },
    {
      key: 'on-this-day',
      content: isLoading ? (
        <FeaturedCarouselSkeleton />
      ) : featuredContent?.onthisday ? (
        (() => {
          // Transform the facts
          const parsedMap = featuredContent.onthisday.map((fact: any) => {
            // Make a shallow copy to avoid mutating original data
            const newFact = { ...fact };
            if (fact.pages) {
              fact.pages.forEach((page: any) => {
                newFact.text = newFact.text.replace(page.normalizedtitle, page.displaytitle);
              });
            }
            return newFact;
          });

          return (
            <>
              <Text
                variant="headlineMedium"
                style={{ marginBottom: 8, fontWeight: 'bold' }}
              >
                On This Day
              </Text>
              <FeaturedCarousel items={parsedMap} />
            </>
          );
        })()
      ) : null
    }
  ].filter(item => item.content);

  return (
    <>
      <SearchOverlay 
        visible={showSearchOverlay} 
        onClose={handleSearchClose}
      />
      
      {!showSearchOverlay && (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <Appbar.Header
            style={{
              backgroundColor: theme.colors.surface,
            }}
          >
            <Appbar.Action icon="shuffle" onPress={handleRandomArticle} />
            <Searchbar
              placeholder="Search Wikipedia"
              value=""
              onFocus={handleSearchOpen}
              style={{
                flex: 1,
                marginHorizontal: 16,
              }}
            />
          </Appbar.Header>
          
          <FlatList
            data={contentItems}
            renderItem={({ item }) => item.content}
            keyExtractor={(item) => item.key}
            style={{ backgroundColor: theme.colors.background }}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: 16,
              paddingHorizontal: 16,
              flexGrow: 1,
              gap: 16,
            }}
          />
        </View>
      )}
    </>
  );
}
