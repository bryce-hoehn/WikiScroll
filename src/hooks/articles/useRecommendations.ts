import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import {
  fetchArticleBacklinksBatch,
  fetchArticleLinksBatch,
  fetchArticleSummaries
} from '@/api';
import useArticleLinks from '@/hooks/storage/useArticleLinks';
import useVisitedArticles from '@/hooks/storage/useVisitedArticles';
import { Article } from '@/types/api';
import { RecommendationItem } from '@/types/components';

/**
 * Hook for generating article recommendations using Wikipedia's link APIs
 * This provides relevant recommendations based on articles that link to or are linked from visited articles
 */
export default function useBacklinkRecommendations() {
  const { visitedArticles } = useVisitedArticles();
  const { getArticleLinks, hasArticleLinks, saveArticleLinks } =
    useArticleLinks();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Main recommendation function
  // Default limit matches ForYouFeed initial load (30)
  const recommendations = useCallback(
    async (limit = 30) => {
      setLoading(true);
      setError(null);

      try {
        if (visitedArticles.length === 0) {
          return [];
        }

        const visitedTitlesSet = new Set(visitedArticles.map((v) => v.title));

        // Step 1: Collect all links from all visited articles
        // Check AsyncStorage first, batch fetch missing links using pipe character (|)
        const articlesNeedingFetch: string[] = [];
        const storedLinksMap: Record<string, string[]> = {};

        // Separate articles into those with stored links and those needing fetch
        for (const article of visitedArticles) {
          if (hasArticleLinks(article.title)) {
            // Article exists in storage, use stored links (may be empty array)
            const storedLinks = getArticleLinks(article.title);
            storedLinksMap[article.title] = storedLinks;
            // Also update React Query cache to keep it in sync
            queryClient.setQueryData(
              ['article-links', article.title],
              storedLinks
            );
            queryClient.setQueryData(
              ['article-backlinks', article.title],
              storedLinks
            );
          } else {
            // Article not in storage, add to batch fetch list
            articlesNeedingFetch.push(article.title);
          }
        }

        // Batch fetch links for all articles not in storage
        const fetchedLinksMap: Record<string, string[]> = {};
        if (articlesNeedingFetch.length > 0) {
          // Batch fetch both backlinks and forward links in parallel
          const sortedTitlesForKey = [...articlesNeedingFetch].sort().join('|');
          const [backlinksBatch, forwardLinksBatch] = await Promise.all([
            queryClient.fetchQuery({
              queryKey: ['article-backlinks-batch', sortedTitlesForKey],
              queryFn: () => fetchArticleBacklinksBatch(articlesNeedingFetch),
              staleTime: 10 * 60 * 1000,
              gcTime: 30 * 60 * 1000
            }),
            queryClient.fetchQuery({
              queryKey: ['article-links-batch', sortedTitlesForKey],
              queryFn: () => fetchArticleLinksBatch(articlesNeedingFetch),
              staleTime: 10 * 60 * 1000,
              gcTime: 30 * 60 * 1000
            })
          ]);

          // Combine backlinks and forward links for each article
          // Collect all updates first, then save in parallel
          const linkUpdates: { title: string; links: string[] }[] = [];
          for (const title of articlesNeedingFetch) {
            const backlinks = backlinksBatch[title] || [];
            const forwardLinks = forwardLinksBatch[title] || [];
            const allLinks = Array.from(
              new Set([...backlinks, ...forwardLinks])
            );
            fetchedLinksMap[title] = allLinks;
            linkUpdates.push({ title, links: allLinks });

            // Update React Query cache for individual article queries
            queryClient.setQueryData(['article-backlinks', title], backlinks);
            queryClient.setQueryData(['article-links', title], forwardLinks);
          }

          // Save all links in parallel (AsyncStorage handles concurrency)
          await Promise.all(
            linkUpdates.map(({ title, links }) =>
              saveArticleLinks(title, links)
            )
          );
        }

        // Combine stored and fetched links
        const linkResults = visitedArticles.map((article) => {
          return (
            storedLinksMap[article.title] ||
            fetchedLinksMap[article.title] ||
            []
          );
        });

        // Flatten all links into a single array and filter out visited articles
        const allCandidates = new Set<string>();
        for (const linkList of linkResults) {
          for (const title of linkList) {
            if (!visitedTitlesSet.has(title)) {
              allCandidates.add(title);
            }
          }
        }

        // Convert Set to array and shuffle
        const candidateArray = Array.from(allCandidates);
        for (let i = candidateArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [candidateArray[i], candidateArray[j]] = [
            candidateArray[j],
            candidateArray[i]
          ];
        }

        // Select candidates up to limit
        const candidateTitles = candidateArray.slice(0, limit);

        // Step 2: Batch fetch summaries for all candidates
        const fetchLimit = Math.min(candidateTitles.length, limit + 5);
        const titlesToFetch = candidateTitles.slice(0, fetchLimit);

        let summariesMap: Record<string, Article | null> = {};
        const sortedTitlesForKey = [...titlesToFetch].sort().join('|');
        summariesMap = await queryClient.fetchQuery({
          queryKey: ['article-summaries-batch', sortedTitlesForKey],
          queryFn: () => fetchArticleSummaries(titlesToFetch),
          staleTime: 5 * 60 * 1000,
          gcTime: 30 * 60 * 1000
        });

        // Convert summaries to recommendations
        const recommendations: RecommendationItem[] = [];
        for (const title of titlesToFetch) {
          if (recommendations.length >= limit) break;

          const article = summariesMap[title];
          if (article) {
            recommendations.push({
              title: article.title,
              displaytitle: article.displaytitle || article.title,
              description: article.description,
              extract: article.extract,
              thumbnail: article.thumbnail,
              pageid: article.pageid
            } as RecommendationItem);
          } else {
            // Include basic recommendation even if fetch failed
            recommendations.push({
              title,
              displaytitle: title
            } as RecommendationItem);
          }
        }

        return recommendations;
      } catch {
        setError('Failed to fetch recommendations');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [
      visitedArticles,
      queryClient,
      getArticleLinks,
      hasArticleLinks,
      saveArticleLinks
    ]
  );

  return {
    recommendations
  };
}
