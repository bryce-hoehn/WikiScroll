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
export interface UseArticleResponse extends HookResponse<Article> {}

/**
 * Hook response for featured content
 */
export interface UseFeaturedContentResponse extends HookResponse<FeaturedContentResponse['data']> {}

/**
 * Hook response for search suggestions
 */
export interface UseSearchSuggestionsResponse extends HookResponse<SearchSuggestion[]> {}

/**
 * Hook response for category pages
 */
export interface UseCategoryPagesResponse extends HookResponse<CategoryPagesResponse> {}

/**
 * Hook response for recommendations
 */
export interface UseRecommendationsResponse extends HookResponse<Article[]> {}

/**
 * Hook response for visited articles
 */
export interface UseVisitedArticlesResponse extends HookResponse<Article[]> {
  addVisitedArticle: (title: string, article?: Article) => Promise<void>;
  clearVisitedArticles: () => Promise<void>;
}

/**
 * Action types for visited articles reducer
 */
export type VisitedArticlesAction =
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'ADD_ARTICLE'; payload: { title: string; article?: Article } }
  | { type: 'CLEAR_ARTICLES' };

/**
 * State for visited articles reducer
 */
export interface VisitedArticlesState {
  articles: Article[];
}
