import React, { useCallback, useEffect, useState } from 'react';
import { useBacklinkRecommendations, useVisitedArticles } from '../../hooks';
import EmptyState from './EmptyState';
import Feed from './Feed';

export default function ForYouFeed() {
  const { getRecommendations } = useBacklinkRecommendations();
  const { visitedArticles, loading: visitedArticlesLoading } = useVisitedArticles();
  
  const [recommendations, setRecommendations] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const loadRecommendations = useCallback(async (isRefresh = false) => {
    // Don't load if no visited articles or still loading
    if (visitedArticlesLoading || visitedArticles.length === 0) {
      return;
    }
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const recs = await getRecommendations(20);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getRecommendations, visitedArticles.length, visitedArticlesLoading]);

  const handleRefresh = useCallback(() => {
    loadRecommendations(true);
  }, [loadRecommendations]);

  const loadMore = useCallback(async () => {
    if (!loading && visitedArticles.length > 0) {
      setLoading(true);
      try {
        const newRecs = await getRecommendations(20);
        setRecommendations((prev: any[]) => {
          const combined = [...prev, ...newRecs];
          // Remove duplicates
          return combined.filter((rec, index, self) =>
            index === self.findIndex(r => r.title === rec.title)
          );
        });
      } catch (error) {
        console.error('Failed to load more recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [loading, getRecommendations, visitedArticles.length]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  // Show loading state while fetching recommendations
  if (loading && recommendations.length === 0) {
    return (
      <EmptyState
        icon="account-heart"
        title="Finding Recommendations"
        description="We're analyzing your reading history to find the perfect articles for you."
        showSpinner={true}
      />
    );
  }

  // Show welcome screen if no recommendations found (same as welcome for now)
  if (recommendations.length === 0 && !loading && visitedArticles.length > 0) {
    return <EmptyState />;
  }

  return (
    <Feed
      data={recommendations}
      loading={loading}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      loadMore={loadMore}
      renderEmptyState={() => null} // We handle empty states above
      keyExtractor={(item: any) => `${item.title}-${item.thumbnail || 'no-thumb'}`}
    />
  );
}
