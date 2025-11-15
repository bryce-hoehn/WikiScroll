import { useQuery } from '@tanstack/react-query';
import { fetchArticleSummary } from '../../api';
import { useBookmarks } from '../../context/BookmarksContext';
import { Article } from '../../types/api';

/**
 * Hook for fetching Wikipedia article summaries by title
 * Checks offline cache first, then falls back to network
 * Used for recommendation cards, search results, etc.
 */
export default function useArticle(title: string) {
  const { getOfflineArticle } = useBookmarks();

  return useQuery({
    queryKey: ['article', title],
    queryFn: async (): Promise<Article | null> => {
      // Check if article is available offline first
      const offlineArticle = getOfflineArticle(title);
      if (offlineArticle) {
        return offlineArticle;
      }
      
      // Fall back to network request
      const articleResponse = await fetchArticleSummary(title);
      return articleResponse.article;
    },
    enabled: !!title,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
