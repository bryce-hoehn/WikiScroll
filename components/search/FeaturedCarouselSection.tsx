import { useFeaturedContent } from '@/context/FeaturedContentContext';
import React from 'react';
import FeaturedCarousel from '../featured/FeaturedCarousel';
import ContentSection from './ContentSection';
import { FeaturedCarouselSkeleton } from './SkeletonComponents';

interface FeaturedCarouselSectionProps {
  title: string;
  items: any[] | null | undefined;
  cardType?: 'on-this-day' | 'news' | 'did-you-know' | 'generic';
  year?: number;
}

/**
 * Reusable carousel section component for SearchScreen
 */
export default function FeaturedCarouselSection({ title, items, cardType = 'generic', year }: FeaturedCarouselSectionProps) {
  const { isLoading } = useFeaturedContent();

  return (
    <ContentSection
      title={title}
      isLoading={isLoading}
      skeleton={<FeaturedCarouselSkeleton />}
    >
      {items && <FeaturedCarousel items={items} cardType={cardType} />}
    </ContentSection>
  );
}