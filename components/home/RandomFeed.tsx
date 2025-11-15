import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { fetchRandomArticle } from '../../api';
import { useBookmarkToggle } from '../../hooks';
import { ArticleResponse } from '../../types/api/articles';
import { RecommendationItem } from '../../types/components';
import RecommendationCard from '../article/RecommendationCard';
import EmptyState from './EmptyState';
import LoadingFooter from './LoadingFooter';

export default function RandomFeed() {
  const theme = useTheme();
  const { handleBookmarkToggle, isBookmarked } = useBookmarkToggle();
  
  const [randomArticles, setRandomArticles] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      // Load 10 articles at once for better performance
      const articlePromises = [];
      for (let i = 0; i < 10; i++) {
        articlePromises.push(fetchRandomArticle());
      }
      
      const responses = await Promise.all(articlePromises);
      const validArticles = responses
        .filter((response: ArticleResponse) => response.article !== null)
        .map((response: ArticleResponse) => {
          const article = response.article!;
          return {
            title: article?.title || 'Untitled Article',
            displaytitle: article?.titles?.normalized || article?.displaytitle || article?.title || 'Untitled Article',
            description: article?.description || article?.extract || '',
            thumbnail: article?.thumbnail,
            pageid: article?.pageid,
          } as RecommendationItem;
        });
      
      setRandomArticles(prev => [...prev, ...validArticles]);
      
      // Stop loading after reaching a reasonable number for performance
      if (randomArticles.length + validArticles.length >= 50) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch random articles:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, randomArticles.length]);

  // Load initial articles
  useEffect(() => {
    loadMoreArticles();
  }, [loadMoreArticles]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRandomArticles([]);
    setHasMore(true);
    
    try {
      // Load 10 articles on refresh too
      const articlePromises = [];
      for (let i = 0; i < 10; i++) {
        articlePromises.push(fetchRandomArticle());
      }
      
      const responses = await Promise.all(articlePromises);
      const validArticles = responses
        .filter((response: ArticleResponse) => response.article !== null)
        .map((response: ArticleResponse) => {
          const article = response.article!;
          return {
            title: article?.title || 'Untitled Article',
            displaytitle: article?.titles?.normalized || article?.displaytitle || article?.title || 'Untitled Article',
            description: article?.description || article?.extract || '',
            thumbnail: article?.thumbnail,
            pageid: article?.pageid,
          } as RecommendationItem;
        });
      
      setRandomArticles(validArticles);
    } catch (error) {
      console.error('Failed to refresh random articles:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderItem = useCallback(({ item, index }: { item: RecommendationItem; index: number }) => (
    <RecommendationCard
      item={item}
      index={index}
      isBookmarked={isBookmarked}
      onBookmarkToggle={handleBookmarkToggle}
    />
  ), [isBookmarked, handleBookmarkToggle]);

  const renderFooter = useCallback(() => (
    <LoadingFooter loading={loading && randomArticles.length > 0} />
  ), [loading, randomArticles.length]);

  const renderEmptyState = useCallback(() => (
    <EmptyState
      icon="dice-5"
      title="Loading Random Articles"
      description="Discovering interesting Wikipedia articles for you..."
      showSpinner={true}
    />
  ), []);

  return (
    <FlashList
      data={randomArticles}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.title}-${index}`}
      contentContainerStyle={{
        flexGrow: 1,
        ...(randomArticles.length === 0 && { justifyContent: 'center' })
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      onEndReached={loadMoreArticles}
      onEndReachedThreshold={0.2}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
    />
  );
}
