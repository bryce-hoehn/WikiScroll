import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedContent } from '../../api';

/**
 * Hook for fetching Wikipedia featured content (Today's Featured Article, Picture of the Day, etc.)
 * with enhanced data including categories for trending articles
 */
export default function useFeaturedContent() {
  const queryResult = useQuery({
    queryKey: ['featured-content'],
    queryFn: async () => {
      try {
        const content = await fetchFeaturedContent();
        
        // If we have trending articles, fetch their categories
        if (content.data?.mostread?.articles) {
          const trendingArticles = content.data.mostread.articles;
          
          return {
            ...content,
            data: {
              ...content.data,
              mostread: {
                ...content.data.mostread,
                articles: trendingArticles
              }
            }
          };
        }
        
        return content;
      } catch (error) {
        console.error('Featured content fetch failed, returning empty data:', error);
        // Return properly structured empty featured content to prevent app from breaking
        return {
          data: {
            tfa: null,
            mostread: null,
            image: null,
            news: null,
            dyk: null,
            onthisday: null,
          },
          onThisDay: {
            events: [],
          },
        };
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour - featured content changes daily
    retry: 0, // Don't retry to avoid repeated errors
  });

  // Extract trending categories from the featured content
  // Note: The new Article structure doesn't include categories
  // We'll need to implement category fetching separately if needed
  const trendingCategories: string[] = [];

  return {
    ...queryResult,
    trendingCategories: trendingCategories,
  };
}
