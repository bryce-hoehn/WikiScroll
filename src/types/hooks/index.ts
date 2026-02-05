/**
 * Hook-specific type definitions for Wikipedia Expo
 */

import { Article } from '../api/articles';
import { CategoryPagesResponse } from '../api/categories';
import { FeaturedContentResponse } from '../api/featured';
import { SearchSuggestion } from '../api/search';

/**
 * Generic hook response interface
 */
export interface HookResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Hook response for article data
 */
export type UseArticleResponse = HookResponse<Article>;

/**
 * Hook response for featured content
 */
export type UseFeaturedContentResponse = HookResponse<
  FeaturedContentResponse['data']
>;

/**
 * Hook response for search suggestions
 */
export type UseSearchSuggestionsResponse = HookResponse<SearchSuggestion[]>;

/**
 * Hook response for category pages
 */
export type UseCategoryPagesResponse = HookResponse<CategoryPagesResponse>;

/**
 * Hook response for recommendations
 */
export type UseRecommendationsResponse = HookResponse<Article[]>;

/**
 * Hook response for visited articles
 */
export interface UseVisitedArticlesResponse extends HookResponse<Article[]> {
  addVisitedArticle: (title: string, article?: Article) => Promise<void>;
  clearVisitedArticles: () => Promise<void>;
}
