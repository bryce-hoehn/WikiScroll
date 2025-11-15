/**
 * Custom hooks for Wikipedia Expo
 * Organized by feature domains
 */

// Article hooks
export { default as useArticle } from './articles/useArticle';
export { default as useArticleHtml } from './articles/useArticleHtml';
export { default as useArticleThumbnail } from './articles/useArticleThumbnail';
export { default as useBacklinkRecommendations } from './articles/useBacklinkRecommendations';
export { default as useCategoryMembers } from './articles/useCategoryMembers';

// Search hooks
export { default as useSearchSuggestions } from './search/useSearchSuggestions';

// Content hooks
export { default as useFeaturedContent } from './content/useFeaturedContent';
export { default as useTrendingArticles } from './content/useTrendingArticles';

// Storage hooks
export { useBookmarks } from '../context/BookmarksContext';
export { default as useVisitedArticles } from './storage/useVisitedArticles';

// UI hooks
export { default as useBookmarkToggle } from './ui/useBookmarkToggle';
export { default as useDebounce } from './ui/useDebounce';
export { default as useThumbnailLoader } from './ui/useThumbnailLoader';

// Re-export types
export type { VisitedArticle } from './storage/useVisitedArticles';
