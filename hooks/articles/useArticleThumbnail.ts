import { useQuery } from '@tanstack/react-query';
import { fetchArticleThumbnail } from '../../api';
import { useBookmarks } from '../../context/BookmarksContext';

/**
 * Hook for fetching Wikipedia articles by title
 * Checks offline cache first, then falls back to network
 */
export default function useArticleThumbnail(title: string) {
  const { getOfflineArticle } = useBookmarks();

  return useQuery({
    queryKey: ['article', title],
    queryFn: async () => {
      // Check if article is available offline first
      const offlineArticle = getOfflineArticle(title);
      if (offlineArticle) {
        return offlineArticle;
      }
      
      // Fall back to network request
      const articleData = await fetchArticleThumbnail(title);
      return articleData;
    },
    enabled: !!title,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
