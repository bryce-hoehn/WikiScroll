import { useQuery } from '@tanstack/react-query';
import { fetchArticleByTitle } from '../../api';
import { useBookmarks } from '../../context/BookmarksContext';
import { WtfArticle } from '../../types/third-party/wtf-article';

/**
 * Hook for fetching Wikipedia articles by title
 * Checks offline cache first, then falls back to network
 */
export default function useArticle(title: string) {
  const { getOfflineArticle } = useBookmarks();

  return useQuery({
    queryKey: ['article', title],
    queryFn: async (): Promise<WtfArticle | null> => {
      // Check if article is available offline first
      const offlineArticle = getOfflineArticle(title);
      if (offlineArticle) {
        return offlineArticle;
      }
      
      // Fall back to network request
      const articleResponse = await fetchArticleByTitle(title);
      return articleResponse.article;
    },
    enabled: !!title,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
