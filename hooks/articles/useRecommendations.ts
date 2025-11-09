import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { fetchCategoryPages } from '../../api';
import { axiosInstance } from '../../api/shared';
import { CategoryPagesResponse } from '../../types/api/categories';
import { RecommendationItem } from '../../types/components';
import useVisitedArticles from '../storage/useVisitedArticles';

export default function useRecommendations() {
  const { visitedArticles } = useVisitedArticles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const getQuickRecommendations = useCallback(async (limit = 10, categories: string[]) => {
    if (categories.length === 0) {
      return [];
    }

    setLoading(true);
    setError(null);

    const visitedTitles = new Set(visitedArticles.map(article => article.title));
    const recommendations: RecommendationItem[] = [];

    try {
      // Pick 2 random unique categories instead of 3 to reduce API calls
      const selectedCategories = [...new Set(
        Array.from({ length: Math.min(2, categories.length) }, () => 
          categories[Math.floor(Math.random() * categories.length)]
        )
      )];

      // Fetch category data in parallel with extended caching (24 hours)
      const categoryPromises = selectedCategories.map(async (category) => {
        const categoryKey = ['category-pages', category.replace(' ', '_')];
        const cachedCategoryData = queryClient.getQueryData(categoryKey);
        
        // Stale-while-revalidate: Return cached data immediately, fetch fresh in background
        if (cachedCategoryData) {
          // Fire and forget background refresh
          fetchCategoryPages(category.replace(' ', '_'))
            .then(freshData => {
              if (freshData) {
                queryClient.setQueryData(categoryKey, freshData);
              }
            })
            .catch(() => {
              // Silent fail - we already have cached data
            });
          return cachedCategoryData as CategoryPagesResponse;
        }
        
        const categoryData = await fetchCategoryPages(category.replace(' ', '_'));
        if (categoryData) {
          queryClient.setQueryData(categoryKey, categoryData);
        }
        return categoryData;
      });

      const categoryResults = await Promise.all(categoryPromises);

      // Collect potential articles from all categories
      const potentialArticles = categoryResults.flatMap(categoryData => 
        categoryData?.articles?.filter(article => 
          !visitedTitles.has(article.title) && article.thumbnail
        ) || []
      );

      // Take fewer articles initially to reduce API calls
      const selectedArticles = [...potentialArticles]
        .sort(() => 0.5 - Math.random())
        .slice(0, limit + 5); // Just enough to ensure we hit the limit

      // Fetch article details in parallel with concurrency limit
      const BATCH_SIZE = 5;
      const articleResults = [];
      
      for (let i = 0; i < selectedArticles.length; i += BATCH_SIZE) {
        const batch = selectedArticles.slice(i, i + BATCH_SIZE);
        const batchPromises = batch.map(async (article) => {
          try {
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(article.title)}`;
            const response = await axiosInstance.get(url);
            const data = response.data;

            return {
              title: data.title,
              displaytitle: data.title,
              description: data.description,
              thumbnail: data.thumbnail ? {
                source: data.thumbnail.source,
                width: data.thumbnail.width,
                height: data.thumbnail.height
              } : undefined,
              pageid: data.pageid,
            };
          } catch (error) {
            console.warn(`Failed to fetch article: ${article.title}`, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter(article => 
          article !== null && !visitedTitles.has(article.title)
        ) as RecommendationItem[];
        articleResults.push(...validResults);
        
        // If we already have enough recommendations, break early
        if (articleResults.length >= limit) {
          break;
        }
      }

      // Add successful results to recommendations
      recommendations.push(...articleResults.slice(0, limit));

    } catch (error) {
      console.warn('Failed to fetch recommendations:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }

    return recommendations;
  }, [visitedArticles, queryClient]);

  return {
    getQuickRecommendations,
    visitedArticlesCount: visitedArticles.length,
    loading,
    error
  };
};
