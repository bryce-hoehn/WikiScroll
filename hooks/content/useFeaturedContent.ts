import { useQuery } from '@tanstack/react-query';
import { fetchArticleByTitle, fetchFeaturedContent } from '../../api';

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
          
          // Fetch categories for all trending articles
          const categoryPromises = trendingArticles.map(async (article: any) => {
            try {
              const articleData = await fetchArticleByTitle(article.title);
              return {
                ...article,
                categories: articleData.article?.categories || []
              };
            } catch (error) {
              console.warn(`Failed to fetch categories for article: ${article.title}`, error);
              return {
                ...article,
                categories: []
              };
            }
          });
          
          // Wait for all category fetches to complete
          const articlesWithCategories = await Promise.all(categoryPromises);
          
          return {
            ...content,
            data: {
              ...content.data,
              mostread: {
                ...content.data.mostread,
                articles: articlesWithCategories
              }
            }
          };
        }
        
        return content;
      } catch (error) {
        console.error('Featured content fetch failed, returning empty data:', error);
        // Return empty featured content to prevent app from breaking
        return {
          data: {
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
  const data = queryResult.data?.data as any;
  const trendingCategories = data?.mostread?.articles
    ? data.mostread.articles.flatMap((article: any) => 
        article.categories || []
      )
    : [];

  const uniqueTrendingCategories = [...new Set(trendingCategories)];

  return {
    ...queryResult,
    trendingCategories: uniqueTrendingCategories,
  };
}
