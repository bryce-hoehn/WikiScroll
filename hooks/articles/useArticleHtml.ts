import { useQuery } from '@tanstack/react-query';
import { fetchArticleHtml } from '../../api';

/**
 * Hook for fetching Wikipedia article HTML content
 * Used for article detail pages where complete HTML with images is needed
 */
export default function useArticleHtml(title: string) {
  return useQuery({
    queryKey: ['article-html', title],
    queryFn: async (): Promise<string | null> => {
      if (!title) return null;
      const rawHtml = await fetchArticleHtml(title);
      
      // Return null if rawHtml is null (error case)
      if (!rawHtml) return null;
      
      return rawHtml;
    },
    enabled: !!title,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}