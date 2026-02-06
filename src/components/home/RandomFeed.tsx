import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Platform } from 'react-native';

import { fetchRandomArticles } from '@/api';
import { ArticleResponse } from '@/types/api/articles';
import { RecommendationItem } from '@/types/components';
import StandardEmptyState from '../common/StandardEmptyState';

import Feed from './Feed';
// Use web-specific feed on web platform to avoid native ad imports
import WebFeed from './Feed.web';

interface RandomFeedProps {
  scrollY?: Animated.Value;
}

const INITIAL_LOAD_COUNT = 18;
const LOAD_MORE_COUNT = 12;

function RandomFeed({ scrollY }: RandomFeedProps) {
  const [randomArticles, setRandomArticles] = useState<RecommendationItem[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setHasError(false);
    try {
      const loadCount =
        randomArticles.length === 0 ? INITIAL_LOAD_COUNT : LOAD_MORE_COUNT;

      const responses = await fetchRandomArticles(loadCount);

      const validArticles = responses
        .filter((response: ArticleResponse) => response.article !== null)
        .map((response: ArticleResponse) => {
          const article = response.article!;
          return {
            title: article?.title || 'Untitled Article',
            displaytitle:
              article?.titles?.normalized ||
              article?.displaytitle ||
              article?.title ||
              'Untitled Article',
            description: article?.description,
            extract: article?.extract,
            thumbnail: article?.thumbnail,
            pageid: article?.pageid,
          } as RecommendationItem;
        });

      // If no valid articles were loaded and this is the initial load, set error state
      if (validArticles.length === 0 && randomArticles.length === 0) {
        setHasError(true);
      } else {
        setRandomArticles((prev) => {
          const updated = [...prev, ...validArticles];
          if (updated.length >= 50) {
            setHasMore(false);
          }
          return updated;
        });
      }
    } catch (error) {
      setHasError(true);
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('Failed to fetch random articles:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, randomArticles.length]);

  const hasLoadedInitialRef = useRef(false);
  useEffect(() => {
    if (
      !hasLoadedInitialRef.current &&
      randomArticles.length === 0 &&
      !loading
    ) {
      hasLoadedInitialRef.current = true;
      loadMoreArticles();
    }
  }, [loadMoreArticles, randomArticles.length, loading]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRandomArticles([]);
    setHasMore(true);
    setHasError(false);

    try {
      const responses = await fetchRandomArticles(INITIAL_LOAD_COUNT);

      const validArticles = responses
        .filter((response: ArticleResponse) => response.article !== null)
        .map((response: ArticleResponse) => {
          const article = response.article!;
          return {
            title: article?.title || 'Untitled Article',
            displaytitle:
              article?.titles?.normalized ||
              article?.displaytitle ||
              article?.title ||
              'Untitled Article',
            description: article?.description,
            extract: article?.extract,
            thumbnail: article?.thumbnail,
            pageid: article?.pageid,
          } as RecommendationItem;
        });

      if (validArticles.length === 0) {
        setHasError(true);
      } else {
        setRandomArticles(validArticles);
      }
    } catch (error) {
      setHasError(true);
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('Failed to refresh random articles:', error);
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderEmptyState = useCallback(
    () => (
      <StandardEmptyState
        icon="shuffle"
        title="No Random Articles"
        description="Unable to load random articles at the moment. Try refreshing or explore other content."
        suggestions={[
          {
            label: 'Refresh',
            action: () => handleRefresh(),
            icon: 'refresh',
          },
          {
            label: 'Browse Popular',
            action: () => router.push('/(tabs)?tab=hot'),
            icon: 'trending-up',
          },
          {
            label: 'Explore Categories',
            action: () => router.push('/(tabs)/categories'),
            icon: 'folder-outline',
          },
        ]}
      />
    ),
    [handleRefresh],
  );

  const keyExtractor = useCallback(
    (item: RecommendationItem) =>
      `${item.title}-${item.thumbnail?.source || 'no-thumb'}`,
    [],
  );

  // Show empty state if we have an error or no articles and not loading
  const shouldShowEmptyState =
    (hasError || randomArticles.length === 0) && !loading && !refreshing;

  const FeedComponent = Platform.OS === 'web' ? WebFeed : Feed;

  return (
    <FeedComponent
      data={randomArticles}
      feedKey="random"
      loading={loading && !hasError}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      loadMore={loadMoreArticles}
      renderEmptyState={shouldShowEmptyState ? renderEmptyState : () => null}
      keyExtractor={keyExtractor}
      scrollY={scrollY}
    />
  );
}

export default React.memo(RandomFeed);
