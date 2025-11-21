import { actionAxiosInstance, restAxiosInstance, WIKIPEDIA_API_CONFIG } from '@/api/shared';
import { Article, ArticleResponse } from '@/types/api';
import { ImageThumbnail, isAxiosError, WikipediaActionApiParams, WikipediaPage, WikipediaQueryResponse } from '@/types/api/base';
import { normalizeWikipediaTitle } from '@/utils/titleNormalization';

/**
 * Fetch a Wikipedia article summary by title
 *
 * Used for recommendation cards, search results, and article previews.
 * Automatically normalizes the title and handles redirects.
 *
 * @param title - The Wikipedia article title (e.g., "Albert Einstein")
 * @returns Promise resolving to an ArticleResponse containing the article data or an error message
 *
 * @example
 * ```ts
 * const response = await fetchArticleSummary("Albert Einstein");
 * if (response.article) {
 *   console.log(response.article.title);
 * } else {
 *   console.error(response.error);
 * }
 * ```
 */
export const fetchArticleSummary = async (title: string): Promise<ArticleResponse> => {
  try {
    const cleanTitle = normalizeWikipediaTitle(title);

    const response = await restAxiosInstance.get<Article>(
      `/page/summary/${encodeURIComponent(cleanTitle)}`,
      {
        baseURL: WIKIPEDIA_API_CONFIG.REST_API_BASE_URL,
      }
    );

    return { article: response.data };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        return { article: null, error: `Article "${title}" not found` };
      } else if (error.code === 'ECONNABORTED') {
        return { article: null, error: 'Request timeout' };
      } else if (error.response?.status && error.response.status >= 500) {
        return { article: null, error: 'Server error' };
      }
    }

    return { article: null, error: 'Failed to load article' };
  }
};

/**
 * @param titles - Array of article titles to fetch summaries for
 * @returns Map of article title to Article object
 */
export const fetchArticleSummaries = async (
  titles: string[]
): Promise<Record<string, Article | null>> => {
  if (titles.length === 0) {
    return {};
  }

  const results: Record<string, Article | null> = {};
  const BATCH_SIZE = 50;
  const batches: string[][] = [];
  
  for (let i = 0; i < titles.length; i += BATCH_SIZE) {
    batches.push(titles.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    try {
      const titlesParam = batch.map(t => normalizeWikipediaTitle(t)).join('|');
      const batchParams: WikipediaActionApiParams = {
        action: 'query',
        prop: 'pageimages|extracts|description|info',
        titles: titlesParam,
        piprop: 'thumbnail',
        pithumbsize: 300,
        pilimit: 50,
        exintro: true,
        explaintext: true,
        exlimit: 20,
        inprop: 'url',
        format: 'json',
        origin: '*',
      };

      const batchResponse = await actionAxiosInstance.get<WikipediaQueryResponse>('', {
        baseURL: WIKIPEDIA_API_CONFIG.BASE_URL,
        params: batchParams,
      });

      const pages = batchResponse.data.query?.pages;
      const normalized = (batchResponse.data.query as any)?.normalized || [];
      const normalizedToOriginal: Record<string, string> = {};
      for (const norm of normalized as Array<{ from: string; to: string }>) {
        if (norm.from && norm.to) {
          normalizedToOriginal[norm.to] = batch.find(t => normalizeWikipediaTitle(t) === norm.from) || norm.from;
        }
      }
      
      if (pages) {
        for (const page of Object.values(pages)) {
          const pageData = page as WikipediaPage & { 
            extract?: string;
            description?: string;
            thumbnail?: ImageThumbnail;
            canonicalurl?: string;
            fullurl?: string;
          };
          
          const pageTitle = pageData.title;
          let originalTitle = batch.find(t => {
            const normalizedInput = normalizeWikipediaTitle(t);
            return normalizedInput === normalizeWikipediaTitle(pageTitle) || 
                   t === pageTitle ||
                   normalizeWikipediaTitle(t) === pageTitle;
          });
          
          if (!originalTitle && normalizedToOriginal[pageTitle]) {
            originalTitle = normalizedToOriginal[pageTitle];
          }
          
          if (originalTitle) {
            let thumbnail: ImageThumbnail | undefined;
            if (pageData.thumbnail && pageData.thumbnail.source) {
              thumbnail = {
                source: pageData.thumbnail.source,
                width: pageData.thumbnail.width,
                height: pageData.thumbnail.height,
              };
            }
            
            results[originalTitle] = {
              title: pageTitle,
              displaytitle: pageTitle,
              pageid: pageData.pageid,
              extract: pageData.extract || undefined,
              thumbnail: thumbnail,
              description: pageData.description || undefined, // Use API's short description field
              content_urls: pageData.canonicalurl || pageData.fullurl ? {
                desktop: { page: pageData.canonicalurl || pageData.fullurl || '' },
                mobile: { page: pageData.canonicalurl || pageData.fullurl || '' },
              } : undefined,
            };
          }
        }
      }
    } catch (error) {
      for (const title of batch) {
        if (!(title in results)) {
          results[title] = null;
        }
      }
    }
  }

  return results;
};
