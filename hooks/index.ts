/**
 * Custom hooks for Wikipedia Expo
 * Organized by feature domains
 */

// Article hooks
export { default as useArticle } from './articles/useArticle';
export { default as useCategoryPages } from './articles/useCategoryPages';
export { default as useRecommendations } from './articles/useRecommendations';

// Search hooks
export { default as useSearchSuggestions } from './search/useSearchSuggestions';

// Content hooks
export { default as useFeaturedContent } from './content/useFeaturedContent';

// Storage hooks
export { useBookmarks } from '../context/BookmarksContext';
export { default as useVisitedArticles } from './storage/useVisitedArticles';

// UI hooks
export { default as useDebounce } from './ui/useDebounce';

// Re-export types
export type { VisitedArticle } from './storage/useVisitedArticles';
