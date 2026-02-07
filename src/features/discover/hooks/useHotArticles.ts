import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { fetchArticleSummaries } from '@/api';
import { RecommendationItem } from '@/types/components';

interface TrendingArticle {
  article: string;
}

const ITEMS_PER_PAGE = 50;

function filterUnwantedArticles(
  articles: TrendingArticle[]
): TrendingArticle[] {
  return articles.filter((article) => {
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
}

export default function useHotArticles(trendingArticles: TrendingArticle[]) {
  const [allTrendingArticles, setAllTrendingArticles] = useState<
    RecommendationItem[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayedTitles = useMemo(() => {
    const endIndex = (currentPage + 1) * ITEMS_PER_PAGE;
    return allTrendingArticles.slice(0, endIndex).map((a) => a.title);
  }, [allTrendingArticles, currentPage]);

  // Batch fetch all displayed article summaries at once (much faster)
  // Sort titles for query key (stable cache key) but don't mutate original array
  const sortedTitlesForKey = useMemo(
    () => [...displayedTitles].sort().join('|'),
    [displayedTitles]
  );

  const { data: summariesMap, isLoading: isLoadingSummaries } = useQuery({
    queryKey: ['article-summaries-batch', sortedTitlesForKey],
    queryFn: () => fetchArticleSummaries(displayedTitles),
    enabled: displayedTitles.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false // Don't refetch on focus
  });

  const displayedArticles = useMemo(() => {
    // Don't return articles until summaries have loaded (or query has completed)
    // This allows the Feed component to show skeletons while loading
    if (isLoadingSummaries || !summariesMap) {
      return [];
    }

    return displayedTitles
      .map((title) => {
        const article = summariesMap[title];
        if (article) {
          return {
            title: article.title,
            displaytitle: article.displaytitle || article.title,
            description: article.description,
            extract: article.extract,
            thumbnail: article.thumbnail,
            pageid: article.pageid
          } as RecommendationItem;
        }
        // If article not found in summaries, return basic item with just title
        return {
          title,
          displaytitle: title
        } as RecommendationItem;
      })
      .filter(
        (article): article is RecommendationItem =>
          article !== null && article.title !== ''
      );
  }, [summariesMap, displayedTitles, isLoadingSummaries]);

  useEffect(() => {
    if (trendingArticles.length > 0 && allTrendingArticles.length === 0) {
      const filteredArticles = filterUnwantedArticles(trendingArticles);
      const basicArticles: RecommendationItem[] = filteredArticles.map(
        (article) => ({
          title: article.article
        })
      );

      setAllTrendingArticles(basicArticles);
      setCurrentPage(1);
    }
  }, [trendingArticles, allTrendingArticles.length]);

  const loadMore = useCallback(async () => {
    if (allTrendingArticles.length === 0 || loadingMore) return;

    const nextPage = currentPage + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;

    if (startIndex >= allTrendingArticles.length) {
      return;
    }

    setLoadingMore(true);
    setCurrentPage(nextPage);

    if (loadMoreTimeoutRef.current) {
      clearTimeout(loadMoreTimeoutRef.current);
    }

    loadMoreTimeoutRef.current = setTimeout(() => {
      setLoadingMore(false);
      loadMoreTimeoutRef.current = null;
    }, 100);
  }, [allTrendingArticles.length, currentPage, loadingMore]);

  useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, []);

  // Show loading state while summaries are being fetched
  const isLoading = isLoadingSummaries && displayedTitles.length > 0;

  return {
    displayedArticles,
    loadingMore: loadingMore || isLoading,
    loadMore,
    hasMore: currentPage * ITEMS_PER_PAGE < allTrendingArticles.length
  };
}
