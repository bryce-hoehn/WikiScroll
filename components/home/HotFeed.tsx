import { useFeaturedContent } from '@/context/FeaturedContentContext';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecommendations } from '../../hooks';
import EmptyState from './EmptyState';
import Feed from './Feed';

export default function HotFeed() {
  const { featuredContent, trendingCategories, refreshFeaturedContent } = useFeaturedContent();
  const { getQuickRecommendations } = useRecommendations();
  
  const [recommendations, setRecommendations] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecommendations = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      if (isRefresh) {
        await refreshFeaturedContent();
      }
      
      if (trendingCategories.length === 0) {
        setRecommendations([]);
        return;
      }
      
      const recs = await getQuickRecommendations(15, trendingCategories);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load trending recommendations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshFeaturedContent, trendingCategories, getQuickRecommendations]);

  const handleRefresh = useCallback(() => {
    loadRecommendations(true);
  }, [loadRecommendations]);

  const loadMore = useCallback(async () => {
    if (!loading) {
      setLoading(true);
      try {
        if (trendingCategories.length === 0) {
          setLoading(false);
          return;
        }
        
        const newRecs = await getQuickRecommendations(10, trendingCategories);
        setRecommendations((prev: any[]) => {
          const combined = [...prev, ...newRecs];
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
  }, [loading, getQuickRecommendations, trendingCategories]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const renderEmptyState = useCallback(() => {
    if (recommendations.length === 0) {
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
  }, [recommendations.length]);

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
