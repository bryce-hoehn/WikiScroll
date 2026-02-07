import React from 'react';

import { useFeaturedContent } from '@/stores/FeaturedContentContext';

import { FeaturedArticleCard } from '@/features/featured';
import ContentSection from './ContentSection';
import { FeaturedArticleSkeleton } from './SkeletonComponents';

/**
 * Featured Article section component for SearchScreen
 */
export default function FeaturedArticleSection() {
  const { featuredContent, isLoading } = useFeaturedContent();

  return (
    <ContentSection
      title="Featured Article"
      isLoading={isLoading}
      skeleton={<FeaturedArticleSkeleton />}
    >
      {featuredContent?.tfa ? <FeaturedArticleCard /> : null}
    </ContentSection>
  );
}
