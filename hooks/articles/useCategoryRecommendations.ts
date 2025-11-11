import { useCallback, useState } from 'react';
import { fetchCategoryPages } from '../../api/categories';
import { RecommendationItem } from '../../types/components';
import useVisitedArticles from '../storage/useVisitedArticles';

/**
 * Hook for generating article recommendations with Wikipedia API compliance
 *
 * This hook generates personalized recommendations based on user's visited articles
 * and categories while respecting Wikipedia's API rate limits:
 *
 * - Uses sequential processing to avoid overwhelming the API
 * - Leverages the rate-limited axios instances (actionAxiosInstance, restAxiosInstance)
 * - Handles duplicate prevention and fallback scenarios
 * - Respects Action API limits (1 concurrent, <5 req/sec) and REST API limits (<5 concurrent, <10 req/sec)
 */
export default function useRecommendations() {
  const { visitedArticles, categories: visitedCategories } = useVisitedArticles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get a random category from the provided categories
  const getRandomCategory = useCallback((categories: string[]): string | null => {
    if (categories.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }, []);

  // Get a random article from a category
  const getRandomArticleFromCategory = useCallback(async (category: string): Promise<RecommendationItem | null> => {
    try {
      const categoryPages = await fetchCategoryPages(category);
      
      if (categoryPages.articles.length === 0) {
        return null;
      }
      
      const article = categoryPages.articles[0];
      
      // Check if article is already in visited articles
      if (visitedArticles.some(visited => visited.title === article.title)) {
        return null;
      }
      
      // Convert category article to recommendation item format
      return {
        title: article.title,
        displaytitle: article.title,
        description: article.description,
        thumbnail: article.thumbnail ? {
          source: article.thumbnail,
          width: 200,
          height: 200
        } : undefined,
        pageid: article.pageid,
      };
    } catch (error) {
      console.warn(`Failed to fetch random article from category ${category}:`, error);
      return null;
    }
  }, [visitedArticles]);

  // Main recommendation function
  const getRecommendations = useCallback(async (limit = 10, categories?: string[]) => {
    setLoading(true);
    setError(null);

    try {
      // Use provided categories or fall back to visited article categories
      const categoriesToUse = categories || visitedCategories;
      
      if (visitedArticles.length === 0 || categoriesToUse.length === 0) {
        console.log("No visited articles or categories - cannot provide personalized recommendations");
        return [];
      }

      const recommendations: RecommendationItem[] = [];
      
      // Sequential processing to respect Wikipedia API limits:
      // - Action API: 1 concurrent request, <5 requests/second (handled by actionAxiosInstance)
      // - REST API: <5 concurrent requests, <10 requests/second (handled by restAxiosInstance)
      let attempts = 0;
      const maxAttempts = limit * 3; // Allow up to 3x the limit to account for duplicates
      
      while (recommendations.length < limit && attempts < maxAttempts) {
        attempts++;
        const randomCategory = getRandomCategory(categoriesToUse);
        
        if (!randomCategory) {
          continue;
        }
        
        const recommendation = await getRandomArticleFromCategory(randomCategory);
        
        if (recommendation && !recommendations.some(rec => rec.title === recommendation.title)) {
          recommendations.push(recommendation);
        }
        
        // Note: Rate limiting is handled at the API level via axios interceptors
        // No additional delay needed here as actionAxiosInstance enforces 200ms between requests
      }
      
      console.log(`Generated ${recommendations.length} category-based recommendations`);
      return recommendations;
        
    } catch (error) {
      console.warn('Failed to fetch recommendations:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [visitedArticles, visitedCategories, getRandomCategory, getRandomArticleFromCategory]);

  return {
    getRecommendations,
    visitedArticlesCount: visitedArticles.length,
    categoriesCount: visitedCategories.length,
    loading,
    error
  };
};
