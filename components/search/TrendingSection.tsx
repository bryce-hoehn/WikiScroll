import { useFeaturedContent } from '@/context/FeaturedContentContext';
import React from 'react';
import TrendingList from '../featured/Trending';
import ContentSection from './ContentSection';
import { FeaturedCarouselSkeleton } from './SkeletonComponents';

/**
 * Trending Articles section component for SearchScreen
 */
export default function TrendingSection() {
  const { featuredContent, isLoading } = useFeaturedContent();

  return (
    <ContentSection
      title="Trending Articles"
      isLoading={isLoading}
      skeleton={<FeaturedCarouselSkeleton />}
    >
      {featuredContent?.mostread && <TrendingList />}
    </ContentSection>
  );
}