import { actionAxiosInstance, WIKIPEDIA_API_CONFIG } from '@/api/shared';
import { ArticleResponse } from '@/types/api/articles';
import {
  WikipediaActionApiParams,
  WikipediaQueryResponse
} from '@/types/api/base';

import { fetchArticleSummaries } from './fetchArticleSummary';

/**
 * Fetch a single random article
 */
export const fetchRandomArticle = async (
  maxRetries = 3
): Promise<ArticleResponse> => {
  const batch = await fetchRandomArticles(1);
  if (batch.length > 0 && batch[0].article) {
    return batch[0];
  }
  return {
    article: null,
    error: 'Failed to load random article'
  };
};

/**
 * @param count - Number of random articles to fetch (max 20 per request, will batch if needed)
 * @returns Array of ArticleResponse objects
 */
export const fetchRandomArticles = async (
  count: number
): Promise<ArticleResponse[]> => {
  if (count <= 0) {
    return [];
  }

  const results: ArticleResponse[] = [];
  const BATCH_SIZE = 20;
  const batches: number[] = [];

  for (let i = 0; i < count; i += BATCH_SIZE) {
    batches.push(Math.min(BATCH_SIZE, count - i));
  }

  for (const batchSize of batches) {
    try {
      const randomParams: WikipediaActionApiParams = {
        action: 'query',
        list: 'random',
        rnnamespace: 0,
        rnlimit: batchSize,
        format: 'json',
        origin: '*'
      };

      const randomResponse =
        await actionAxiosInstance.get<WikipediaQueryResponse>('', {
          baseURL: WIKIPEDIA_API_CONFIG.BASE_URL,
          params: randomParams
        });

      const randomPages = randomResponse.data.query?.random || [];
      if (randomPages.length === 0) {
        continue;
      }

      const titles = randomPages.map((page: { title: string }) => page.title);
      const summariesMap = await fetchArticleSummaries(titles);

      for (const title of titles) {
        const article = summariesMap[title];
        if (article) {
          results.push({ article });
        } else {
          results.push({
            article: null,
            error: 'Failed to load article summary'
          });
        }
      }
    } catch (error: unknown) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('Failed to fetch random articles batch:', error);
      }
      for (let i = 0; i < batchSize; i++) {
        results.push({
          article: null,
          error: 'Failed to load random article'
        });
      }
    }
  }

  return results;
};
