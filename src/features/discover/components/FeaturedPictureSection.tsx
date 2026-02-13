import React from 'react';

import { useFeaturedContent } from '@/stores/FeaturedContentContext';

import ContentSection from './ContentSection';
import FeaturedPictureCard from './FeaturedPictureCard';
import { FeaturedPictureSkeleton } from './SkeletonComponents';

/**
 * Featured Picture section component for SearchScreen
 */
export default function FeaturedPictureSection() {
  const { featuredContent, isLoading } = useFeaturedContent();

  return (
    <ContentSection
      title="Featured Picture"
      isLoading={isLoading}
      skeleton={<FeaturedPictureSkeleton />}
    >
      {featuredContent?.image ? <FeaturedPictureCard /> : null}
    </ContentSection>
  );
}
