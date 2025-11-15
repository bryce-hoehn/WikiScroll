import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchArticleSummary } from '../../api';
import { RecommendationItem } from '../../types/components';

interface TrendingArticle {
  article: string;
}

/**
 * Hook for managing hot articles with caching and pagination
 * Extracts complex logic from HotFeed component
 */
export default function useHotArticles(trendingArticles: TrendingArticle[]) {
  const [allTrendingArticles, setAllTrendingArticles] = useState<RecommendationItem[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<RecommendationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [articleDetailsCache, setArticleDetailsCache] = useState<Map<string, RecommendationItem>>(new Map());
  const [loadingMore, setLoadingMore] = useState(false);
  const displayedArticlesRef = useRef<RecommendationItem[]>([]);
  
  const ITEMS_PER_PAGE = 20;

  // Filter out unwanted pages (Main_Page, Special: pages, etc.)
  const filterUnwantedArticles = useCallback((articles: TrendingArticle[]) => {
    return articles.filter(article => {
      const title = article.article;
      return !(
        title === 'Main_Page' ||
        title.startsWith('Special:') ||
        title.startsWith('File:') ||
        title.startsWith('Category:') ||
        title.startsWith('Template:') ||
        title.startsWith('Help:') ||
        title.startsWith('Portal:') ||
        title.startsWith('Wikipedia:')
      );
    });
  }, []);

  // Create basic article objects from trending data
  const createBasicArticles = useCallback((filteredArticles: TrendingArticle[]) => {
    return filteredArticles.map(article => ({
      title: article.article,
      // description and thumbnail will be fetched below
    }));
  }, []);

  // Fetch detailed article information
  const fetchArticleDetails = useCallback(async (title: string): Promise<RecommendationItem | null> => {
    try {
      const summaryResponse = await fetchArticleSummary(title);
      if (summaryResponse.article) {
        return {
          title: summaryResponse.article.title,
          description: summaryResponse.article.description,
          thumbnail: summaryResponse.article.thumbnail,
          pageid: summaryResponse.article.pageid,
        };
      }
    } catch (error) {
      console.error(`Failed to fetch summary for ${title}:`, error);
    }
    return null;
  }, []);

  // Update displayed articles with detailed information
  const updateArticleDetails = useCallback(async (articles: RecommendationItem[], startIndex: number) => {
    // Use ref to avoid dependency on displayedArticles state
    const currentDisplayed = [...displayedArticlesRef.current];
    
    // Process articles and collect updates
    const updates = await Promise.all(
      articles.map(async (article, index) => {
        const displayIndex = startIndex + index;
        
        // Check cache first
        if (articleDetailsCache.has(article.title)) {
          const cachedDetails = articleDetailsCache.get(article.title)!;
          return { index: displayIndex, article: cachedDetails };
        }
        
        const detailedArticle = await fetchArticleDetails(article.title);
        if (detailedArticle) {
          // Update cache
          setArticleDetailsCache(prev => new Map(prev).set(article.title, detailedArticle));
          return { index: displayIndex, article: detailedArticle };
        }
        
        // Return the basic article if fetch fails, but with normalized title
        return { index: displayIndex, article };
      })
    );
    
    // Apply all updates at once
    const updatedArticles = [...currentDisplayed];
    updates.forEach(update => {
      if (update) {
        updatedArticles[update.index] = update.article;
      }
    });
    
    // Only update if there are actual changes
    if (JSON.stringify(updatedArticles) !== JSON.stringify(currentDisplayed)) {
      setDisplayedArticles(updatedArticles);
      displayedArticlesRef.current = updatedArticles;
    }
  }, [articleDetailsCache, fetchArticleDetails]);

  // Process trending articles when they load
  useEffect(() => {
    if (trendingArticles.length > 0 && allTrendingArticles.length === 0) {
      const filteredArticles = filterUnwantedArticles(trendingArticles);
      const basicArticles = createBasicArticles(filteredArticles);
      
      setAllTrendingArticles(basicArticles);
      
      // Set basic articles immediately for fast initial render
      const firstPageArticles = basicArticles.slice(0, ITEMS_PER_PAGE);
      setDisplayedArticles(firstPageArticles);
      displayedArticlesRef.current = firstPageArticles;
      setCurrentPage(1);
      
      // Lazy load detailed information for the first page with a small delay
      // to allow the initial render to complete first
      setTimeout(() => {
        updateArticleDetails(firstPageArticles, 0);
      }, 100);
    }
  }, [trendingArticles, filterUnwantedArticles, createBasicArticles, updateArticleDetails, ITEMS_PER_PAGE, allTrendingArticles.length]);

  // Keep ref in sync with state
  useEffect(() => {
    displayedArticlesRef.current = displayedArticles;
  }, [displayedArticles]);

  // Load more articles with pagination
  const loadMore = useCallback(async () => {
    if (allTrendingArticles.length === 0 || loadingMore) return;
    
    setLoadingMore(true);
    
    try {
      const nextPage = currentPage + 1;
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = nextPage * ITEMS_PER_PAGE;
      
      if (startIndex >= allTrendingArticles.length) {
        // No more articles to load
        return;
      }
      
      const nextArticles = allTrendingArticles.slice(startIndex, endIndex);
      
      // Add basic articles immediately for fast rendering
      const newDisplayed = [...displayedArticles, ...nextArticles];
      setDisplayedArticles(newDisplayed);
      displayedArticlesRef.current = newDisplayed;
      setCurrentPage(nextPage);
      
      // Lazy load detailed information for the new articles with delay
      setTimeout(() => {
        updateArticleDetails(nextArticles, startIndex);
      }, 200);
    } finally {
      setLoadingMore(false);
    }
  }, [allTrendingArticles, currentPage, loadingMore, updateArticleDetails, ITEMS_PER_PAGE, displayedArticles]);

  return {
    displayedArticles: displayedArticles.filter(item => item && item.title),
    loadingMore,
    loadMore,
    hasMore: currentPage * ITEMS_PER_PAGE < allTrendingArticles.length,
  };
}