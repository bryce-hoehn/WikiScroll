import { useCallback, useState } from 'react';
import { fetchArticleBacklinks, fetchArticleLinks, fetchArticleSummary } from '../../api';
import { RecommendationItem } from '../../types/components';
import useVisitedArticles from '../storage/useVisitedArticles';

/**
 * Hook for generating article recommendations using Wikipedia's linkshere API
 * This provides highly relevant recommendations based on articles that link to visited articles
 */
export default function useBacklinkRecommendations() {
  const { visitedArticles } = useVisitedArticles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get a random visited article
  const getRandomVisitedArticle = useCallback(() => {
    if (visitedArticles.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * visitedArticles.length);
    return visitedArticles[randomIndex];
  }, [visitedArticles]);

  // Get a random backlink from a visited article
  const getRandomBacklink = useCallback(async (visitedArticleTitle: string) => {
    try {
      // Get backlinks for this visited article
      const backlinkTitles = await fetchArticleBacklinks(visitedArticleTitle);
      
      if (backlinkTitles.length === 0) {
        return null;
      }
      
      // Pick a random backlink
      const randomIndex = Math.floor(Math.random() * backlinkTitles.length);
      const randomBacklinkTitle = backlinkTitles[randomIndex];
      
      // Skip if this is already a visited article
      if (visitedArticles.some(visited => visited.title === randomBacklinkTitle)) {
        return null;
      }
      
      return randomBacklinkTitle;
    } catch (error) {
      console.warn(`Failed to fetch backlinks for ${visitedArticleTitle}:`, error);
      return null;
    }
  }, [visitedArticles]);

  // Get a random forward link from a visited article
  const getRandomForwardlink = useCallback(async (visitedArticleTitle: string) => {
    try {
      // Get forward links for this visited article
      const forwardLinkTitles = await fetchArticleLinks(visitedArticleTitle);
      
      if (forwardLinkTitles.length === 0) {
        return null;
      }
      
      // Pick a random forward link
      const randomIndex = Math.floor(Math.random() * forwardLinkTitles.length);
      const randomForwardLinkTitle = forwardLinkTitles[randomIndex];
      
      // Skip if this is already a visited article
      if (visitedArticles.some(visited => visited.title === randomForwardLinkTitle)) {
        return null;
      }
      
      return randomForwardLinkTitle;
    } catch (error) {
      console.warn(`Failed to fetch forward links for ${visitedArticleTitle}:`, error);
      return null;
    }
  }, [visitedArticles]);

  // Main recommendation function using backlinks with forward links as fallback
  const getRecommendations = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      if (visitedArticles.length === 0) {
        return [];
      }

      const recommendations: RecommendationItem[] = [];
      const processedTitles = new Set<string>();
      
      // Try to get one backlink from multiple random visited articles
      let attempts = 0;
      const maxAttempts = limit * 3; // Allow some retries for failed fetches
      
      while (recommendations.length < limit && attempts < maxAttempts) {
        attempts++;
        
        // Pick a random visited article
        const randomVisitedArticle = getRandomVisitedArticle();
        if (!randomVisitedArticle) continue;
        
        // First try to get a backlink
        let recommendationTitle = await getRandomBacklink(randomVisitedArticle.title);
        
        // If no backlink found, try to get a forward link as fallback
        if (!recommendationTitle) {
          recommendationTitle = await getRandomForwardlink(randomVisitedArticle.title);
        }
        
        if (!recommendationTitle) continue;
        
        // Skip if we've already processed this title
        if (processedTitles.has(recommendationTitle)) continue;
        processedTitles.add(recommendationTitle);
        
        try {
          // Get article details for the recommendation
          const summaryResponse = await fetchArticleSummary(recommendationTitle);
          if (summaryResponse.article) {
            const recommendation: RecommendationItem = {
              title: summaryResponse.article.title,
              displaytitle: summaryResponse.article.displaytitle,
              description: summaryResponse.article.description,
              thumbnail: summaryResponse.article.thumbnail,
              pageid: summaryResponse.article.pageid,
            };
            
            recommendations.push(recommendation);
          }
        } catch (error) {
          console.warn(`Failed to fetch summary for ${recommendationTitle}:`, error);
          // Add basic recommendation even if details fail
          recommendations.push({
            title: recommendationTitle,
            displaytitle: recommendationTitle,
          });
        }
      }
      
      return recommendations.slice(0, limit);
        
    } catch (error) {
      console.warn('Failed to fetch recommendations:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [visitedArticles, getRandomVisitedArticle, getRandomBacklink, getRandomForwardlink]);

  return {
    getRecommendations,
    visitedArticlesCount: visitedArticles.length,
    loading,
    error
  };
}