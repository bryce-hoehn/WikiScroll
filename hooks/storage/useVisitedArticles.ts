import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { fetchArticleCategories } from '../../api/articles';
import { Article } from '../../types/api/articles';

export interface VisitedArticle {
  title: string;
  visitedAt: string;
  thumbnail?: string;
  description?: string;
  categories?: string[]; // Store actual categories for each article
}

const VISITED_ARTICLES_KEY = 'visited_articles';

/**
 * Simplified hook for managing visited articles with real Wikipedia categories
 */
export default function useVisitedArticles() {
  const [visitedArticles, setVisitedArticles] = useState<VisitedArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load visited articles from storage on mount
  const loadVisitedArticles = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(VISITED_ARTICLES_KEY);
      if (stored) {
        const articles = JSON.parse(stored);
        setVisitedArticles(articles);
        
        // Extract all categories from stored articles
        const allCategories = new Set<string>();
        articles.forEach((article: VisitedArticle) => {
          if (article.categories) {
            article.categories.forEach(cat => allCategories.add(cat));
          }
        });
        setCategories(Array.from(allCategories));
      }
    } catch (error) {
      console.error('Failed to load visited articles:', error);
      setError('Failed to load visited articles');
      // Clear corrupted data
      try {
        await AsyncStorage.removeItem(VISITED_ARTICLES_KEY);
      } catch (clearError) {
        console.error('Failed to clear corrupted data:', clearError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addVisitedArticle = useCallback(async (title: string, article?: Article) => {
    try {
      // Fetch categories for this article
      const articleCategories = await fetchArticleCategories(title);
      
      const newArticle: VisitedArticle = {
        title,
        visitedAt: new Date().toISOString(),
        thumbnail: article?.thumbnail?.source,
        description: article?.description,
        categories: articleCategories,
      };

      // Update state immediately
      const updatedArticles = [
        newArticle,
        ...visitedArticles.filter(a => a.title !== title)
      ].slice(0, 100); // Keep only the 100 most recent

      setVisitedArticles(updatedArticles);
      
      // Update categories by combining all article categories
      const allCategories = new Set<string>();
      updatedArticles.forEach(article => {
        if (article.categories) {
          article.categories.forEach(cat => allCategories.add(cat));
        }
      });
      setCategories(Array.from(allCategories).slice(0, 20)); // Limit to 20 categories

      // Save to storage
      await AsyncStorage.setItem(VISITED_ARTICLES_KEY, JSON.stringify(updatedArticles));
    } catch (error) {
      console.error('Failed to save visited article:', error);
      setError('Failed to save visited article');
    }
  }, [visitedArticles]);

  const clearVisitedArticles = useCallback(async () => {
    try {
      setVisitedArticles([]);
      setCategories([]);
      await AsyncStorage.removeItem(VISITED_ARTICLES_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear visited articles:', error);
      setError('Failed to clear visited articles');
      return false;
    }
  }, []);

  // Load articles on mount
  useEffect(() => {
    loadVisitedArticles();
  }, [loadVisitedArticles]);

  return {
    visitedArticles,
    categories,
    loading,
    error,
    addVisitedArticle,
    clearVisitedArticles,
    loadVisitedArticles,
  };
}
