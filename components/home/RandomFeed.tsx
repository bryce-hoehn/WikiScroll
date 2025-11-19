import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { fetchRandomArticle } from '../../api';
import { ArticleResponse } from '../../types/api/articles';
import { RecommendationItem } from '../../types/components';
import StandardEmptyState from '../common/StandardEmptyState';
import Feed from './Feed';

interface RandomFeedProps {
  scrollY?: Animated.Value;
}

const BATCH_SIZE = 6;
const INITIAL_LOAD_COUNT = 18;
const LOAD_MORE_COUNT = 12;

async function fetchArticlesInBatches(count: number): Promise<ArticleResponse[]> {
  const allResponses: ArticleResponse[] = [];
  
  for (let i = 0; i < count; i += BATCH_SIZE) {
    const currentBatchSize = Math.min(BATCH_SIZE, count - i);
    const batchPromises = Array.from({ length: currentBatchSize }, () => fetchRandomArticle());
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        allResponses.push(result.value);
      }
    });
    
    if (i + BATCH_SIZE < count) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  
  return allResponses;
}

export default function RandomFeed({ scrollY }: RandomFeedProps) {
  const [randomArticles, setRandomArticles] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const loadCount = randomArticles.length === 0 ? INITIAL_LOAD_COUNT : LOAD_MORE_COUNT;
      
      const responses = await fetchArticlesInBatches(loadCount);
      
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

      setRandomArticles((prev) => {
        const updated = [...prev, ...validArticles];
        if (updated.length >= 50) {
          setHasMore(false);
        }
        return updated;
      });
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('Failed to fetch random articles:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, randomArticles.length]);

  const hasLoadedInitialRef = useRef(false);
  useEffect(() => {
    if (!hasLoadedInitialRef.current && randomArticles.length === 0 && !loading) {
      hasLoadedInitialRef.current = true;
      loadMoreArticles();
    }
  }, [loadMoreArticles, randomArticles.length, loading]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRandomArticles([]);
    setHasMore(true);

    try {
      const responses = await fetchArticlesInBatches(INITIAL_LOAD_COUNT);
      
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

      setRandomArticles(validArticles);
    } catch (error) {
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
    [handleRefresh]
  );

  const keyExtractor = useCallback(
    (item: RecommendationItem) => `${item.title}-${item.thumbnail?.source || 'no-thumb'}`,
    []
  );

  return (
    <Feed
      data={randomArticles}
      feedKey="random"
      loading={loading}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      loadMore={loadMoreArticles}
      renderEmptyState={renderEmptyState}
      keyExtractor={keyExtractor}
      scrollY={scrollY}
    />
  );
}
