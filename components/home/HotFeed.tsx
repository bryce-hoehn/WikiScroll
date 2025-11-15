import React, { useCallback } from 'react';
import useHotArticles from '../../hooks/content/useHotArticles';
import useTrendingArticles from '../../hooks/content/useTrendingArticles';
import { RecommendationItem } from '../../types/components';
import EmptyState from './EmptyState';
import Feed from './Feed';

export default function HotFeed() {
  const { data: trendingArticles = [], isLoading, refetch } = useTrendingArticles();
  const { displayedArticles, loadingMore, loadMore } = useHotArticles(trendingArticles);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderEmptyState = useCallback(() => {
    if (!displayedArticles || displayedArticles.length === 0) {
      return (
        <EmptyState
          icon="trending-up"
          title="Loading Hot Articles"
          description="Discovering what's popular on Wikipedia right now..."
          showSpinner={true}
        />
      );
    }
    
    return null;
  }, [displayedArticles]);

  const keyExtractor = useCallback((item: RecommendationItem) =>
    `${item?.title || 'unknown'}-${item?.thumbnail?.source || 'no-thumb'}`, []);

  return (
    <Feed
      data={displayedArticles}
      loading={isLoading || loadingMore}
      refreshing={isLoading}
      onRefresh={handleRefresh}
      loadMore={loadMore}
      renderEmptyState={renderEmptyState}
      keyExtractor={keyExtractor}
    />
  );
}
