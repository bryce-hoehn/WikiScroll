import React, { useCallback, useEffect, useState } from 'react';
import { useRecommendations, useVisitedArticles } from '../../hooks';
import EmptyState from './EmptyState';
import Feed from './Feed';

export default function ForYouFeed() {
  const { getQuickRecommendations } = useRecommendations();
  const { visitedArticles, categories: visitedCategories, loading: visitedArticlesLoading } = useVisitedArticles();
  
  const [recommendations, setRecommendations] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecommendations = useCallback(async (isRefresh = false) => {
    // Don't load recommendations if visited articles are still loading
    if (visitedArticlesLoading) {
      return;
    }
    
    if (visitedArticles.length === 0) {
      setRecommendations([]);
      return;
    }
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      // Use the pre-computed categories from visited articles
      const recs = await getQuickRecommendations(15, visitedCategories);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getQuickRecommendations, visitedArticles.length, visitedArticlesLoading, visitedCategories]);

  const handleRefresh = useCallback(() => {
    loadRecommendations(true);
  }, [loadRecommendations]);

  const loadMore = useCallback(async () => {
    if (!loading) {
      setLoading(true);
      try {
        const newRecs = await getQuickRecommendations(10, visitedCategories);
        setRecommendations((prev: any[]) => {
          const combined = [...prev, ...newRecs];
          // Remove duplicates
          const uniqueRecs = combined.filter((rec, index, self) => 
            index === self.findIndex(r => r.title === rec.title)
          );
          return uniqueRecs;
        });
      } catch (error) {
        console.error('Failed to load more recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [loading, getQuickRecommendations, visitedCategories]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const renderEmptyState = useCallback(() => {
    // Show welcome state when there are no visited articles
    if (visitedArticles.length === 0 && !visitedArticlesLoading) {
      return <EmptyState type="welcome" />;
    }
    
    // Show loading state when there are no recommendations (including during initial load)
    if (recommendations.length === 0) {
      return (
        <EmptyState 
          icon="account-heart"
          title="Finding Articles For You"
          description="We're analyzing your reading history to find the perfect articles for you."
          buttonText="Refresh Recommendations"
          buttonAction={handleRefresh}
          buttonIcon="refresh"
          buttonMode="outlined"
          showSpinner={loading || visitedArticlesLoading}
        />
      );
    }
    
    return null;
  }, [loading, visitedArticles.length, recommendations.length, handleRefresh, visitedArticlesLoading]);

  const keyExtractor = useCallback((item: any) => 
    `${item.title}-${item.thumbnail || 'no-thumb'}`, []);

  return (
    <Feed
      data={recommendations}
      loading={loading}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      loadMore={loadMore}
      renderEmptyState={renderEmptyState}
      keyExtractor={keyExtractor}
    />
  );
}
