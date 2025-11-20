import { actionAxiosInstance, WIKIPEDIA_API_CONFIG } from '@/api/shared';
import { normalizeWikipediaTitle } from '@/utils/titleNormalization';

interface LinksResponse {
  query: {
    pages: {
      [pageId: string]: {
        pageid: number;
        ns: number;
        title: string;
        links?: {
          ns: number;
          title: string;
        }[];
      };
    };
  };
}

export const fetchArticleLinks = async (articleTitle: string): Promise<string[]> => {
  const results = await fetchArticleLinksBatch([articleTitle]);
  return results[articleTitle] || [];
};

/**
 * @param articleTitles - Array of article titles to fetch links for
 * @returns Map of article title to array of link titles
 */
export const fetchArticleLinksBatch = async (
  articleTitles: string[]
): Promise<Record<string, string[]>> => {
  if (articleTitles.length === 0) {
    return {};
  }

  const results: Record<string, string[]> = {};
  const BATCH_SIZE = 50;
  const batches: string[][] = [];
  
  for (let i = 0; i < articleTitles.length; i += BATCH_SIZE) {
    batches.push(articleTitles.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    try {
      const titlesParam = batch.map(t => normalizeWikipediaTitle(t)).join('|');

      const response = await actionAxiosInstance.get<LinksResponse>('', {
        baseURL: WIKIPEDIA_API_CONFIG.BASE_URL,
        params: {
          action: 'query',
          prop: 'links',
          titles: titlesParam,
          pllimit: 50,
          format: 'json',
          origin: '*',
        },
      });

      const pages = response.data.query?.pages;
      if (!pages) {
        continue;
      }

      const normalized = (response.data.query as any)?.normalized || [];
      const normalizedToOriginal: Record<string, string> = {};
      for (const norm of normalized as Array<{ from: string; to: string }>) {
        if (norm.from && norm.to) {
          normalizedToOriginal[norm.to] = batch.find(t => normalizeWikipediaTitle(t) === norm.from) || norm.from;
        }
      }

      for (const page of Object.values(pages)) {
        const pageTitle = page.title;
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
          const links = page.links || [];
          const filteredLinks = links
            .filter((link) => {
              const title = link.title;
              return (
                link.ns === 0 &&
                !(
                  title === 'Main_Page' ||
                  title.startsWith('Special:') ||
                  title.startsWith('File:') ||
                  title.startsWith('Category:') ||
                  title.startsWith('Template:') ||
                  title.startsWith('Help:') ||
                  title.startsWith('Portal:') ||
                  title.startsWith('Wikipedia:')
                )
              );
            })
            .map((link) => link.title);

          results[originalTitle] = filteredLinks;
        }
      }
    } catch (error: unknown) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error(
          `Failed to fetch forward links batch:`,
          (error as { response?: { status?: number; data?: unknown } }).response?.status,
          (error as { response?: { data?: unknown } }).response?.data || error
        );
      }
    }
  }

  return results;
};
