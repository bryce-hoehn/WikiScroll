import { useBacklinkRecommendations } from '@/hooks';
import React, { useState } from 'react';

import EmptyState from './EmptyState';
import Feed from './Feed';

export default function ForYouFeed() {
  const { recommendations } = useBacklinkRecommendations();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const renderEmptyState = () => {
    if (recommendations.length === 0 && !loading) {
      return (
        <EmptyState
          icon="account-heart"
          title="No Recommendations Yet"
          description="Read some articles to get personalized recommendations."
        />
      );
    }
    return null;
  };

  return (
    <Feed
      data={recommendations}
      loading={loading}
      refreshing={refreshing}
      renderEmptyState={renderEmptyState}
      keyExtractor={(item: any) =>
        `${item.title}-${item.thumbnail || 'no-thumb'}`
      }
      feedKey="for-you"
    />
  );
}
