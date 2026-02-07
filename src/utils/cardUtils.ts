/**
 * Utility functions for card component selection and management
 */

import { type MD3Theme } from 'react-native-paper';

import DidYouKnowCard from '../features/featured/components/DidYouKnowCard';
import GenericCard from '../features/featured/components/GenericCard';
import NewsCard from '../features/featured/components/NewsCard';
import OnThisDayCard from '../features/featured/components/OnThisDayCard';
import { RecommendationItem } from '../types/components';

export type CardType = 'on-this-day' | 'news' | 'did-you-know' | 'generic';

export interface CardComponentProps {
  item: RecommendationItem;
  itemWidth: number;
  theme: MD3Theme;
}

/**
 * Get the appropriate card component based on card type
 */
export function getCardComponent(cardType: CardType) {
  switch (cardType) {
    case 'on-this-day':
      return OnThisDayCard;
    case 'news':
      return NewsCard;
    case 'did-you-know':
      return DidYouKnowCard;
    case 'generic':
    default:
      return GenericCard;
  }
}
