import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useReducer } from 'react';
import { Article } from '../../types/api/articles';

// Use the existing Article type from API types instead of defining a new one
export interface VisitedArticle {
  title: string;
  visitedAt: string;
  article?: Article;
}

const VISITED_ARTICLES_KEY = 'visited_articles';

// State interface
interface VisitedArticlesState {
  articles: VisitedArticle[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

// Action types
type VisitedArticlesAction =
  | { type: 'SET_ARTICLES'; payload: VisitedArticle[] }
  | { type: 'ADD_ARTICLE'; payload: { title: string; article?: Article } }
  | { type: 'CLEAR_ARTICLES' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: VisitedArticlesState = {
  articles: [],
  categories: [],
  loading: false,
  error: null,
};

// Helper function to extract categories from articles
function extractCategoriesFromArticles(articles: VisitedArticle[]): string[] {
  const allCategories: string[] = [];
  articles.forEach((article) => {
    const articleCategories = (article.article as any)?.categories;
    if (articleCategories && Array.isArray(articleCategories)) {
      allCategories.push(...articleCategories);
    }
  });
  return [...new Set(allCategories)];
}

// Reducer function
function visitedArticlesReducer(state: VisitedArticlesState, action: VisitedArticlesAction): VisitedArticlesState {
  switch (action.type) {
    case 'SET_ARTICLES':
      const categories = extractCategoriesFromArticles(action.payload);
      return { ...state, articles: action.payload, categories, loading: false, error: null };
    
    case 'ADD_ARTICLE':
      const { title, article } = action.payload;
      const existingArticleIndex = state.articles.findIndex(a => a.title === title);
      
      let updatedArticles;
      if (existingArticleIndex >= 0) {
        // Update existing article
        updatedArticles = [...state.articles];
        updatedArticles[existingArticleIndex] = {
          title,
          visitedAt: new Date().toISOString(),
          article,
        };
      } else {
        // Add new article
        const newArticle: VisitedArticle = {
          title,
          visitedAt: new Date().toISOString(),
          article,
        };
        updatedArticles = [newArticle, ...state.articles].slice(0, 100);
      }
      
      const updatedCategories = extractCategoriesFromArticles(updatedArticles);
      return { ...state, articles: updatedArticles, categories: updatedCategories, error: null };
    
    case 'CLEAR_ARTICLES':
      return { ...state, articles: [], categories: [], error: null };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
}

/**
 * Hook for managing visited articles in local storage using useReducer
 */
export default function useVisitedArticles() {
  const [state, dispatch] = useReducer(visitedArticlesReducer, initialState);

  const loadVisitedArticles = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const stored = await AsyncStorage.getItem(VISITED_ARTICLES_KEY);
      if (stored) {
        const articles = JSON.parse(stored);
        dispatch({ type: 'SET_ARTICLES', payload: articles });
      } else {
        dispatch({ type: 'SET_ARTICLES', payload: [] });
      }
    } catch (error) {
      console.error('Failed to load visited articles:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load visited articles' 
      });
    }
  }, []);

  // Load visited articles from storage on mount
  useEffect(() => {
    loadVisitedArticles();
  }, [loadVisitedArticles]);

  const addVisitedArticle = useCallback(async (title: string, article?: Article) => {
    try {
      // Calculate the new state first to avoid race conditions
      const existingArticleIndex = state.articles.findIndex(a => a.title === title);
      let updatedArticles;
      
      if (existingArticleIndex >= 0) {
        // Update existing article
        updatedArticles = [...state.articles];
        updatedArticles[existingArticleIndex] = {
          title,
          visitedAt: new Date().toISOString(),
          article,
        };
      } else {
        // Add new article
        const newArticle: VisitedArticle = {
          title,
          visitedAt: new Date().toISOString(),
          article,
        };
        updatedArticles = [newArticle, ...state.articles].slice(0, 100);
      }
      
      // Dispatch and save atomically
      dispatch({ type: 'SET_ARTICLES', payload: updatedArticles });
      await AsyncStorage.setItem(VISITED_ARTICLES_KEY, JSON.stringify(updatedArticles));
    } catch (error) {
      console.error('Failed to save visited article:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to save visited article' 
      });
    }
  }, [state.articles]);

  const clearVisitedArticles = useCallback(async () => {
    try {
      dispatch({ type: 'CLEAR_ARTICLES' });
      await AsyncStorage.removeItem(VISITED_ARTICLES_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear visited articles:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to clear visited articles' 
      });
      return false;
    }
  }, []);

  return {
    visitedArticles: state.articles,
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    addVisitedArticle,
    clearVisitedArticles,
    loadVisitedArticles,
  };
};
