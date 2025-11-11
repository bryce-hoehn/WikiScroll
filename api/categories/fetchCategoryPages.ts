import { CategoryPagesResponse } from '../../types/api';
import { fetchArticleByTitle } from '../articles';
import { fetchDescription } from '../articles/fetchDescription';
import { actionAxiosInstance, restAxiosInstance, WIKIPEDIA_API_CONFIG } from '../shared';

/**
 * Fetch category pages with Wikipedia API compliance
 *
 * This function demonstrates proper mixed API usage:
 * - Uses Action API for category members (no REST equivalent)
 * - Uses REST API for article summaries (preferred for performance)
 * - Falls back to alternative methods if primary API fails
 *
 * Rate limiting is enforced by:
 * - actionAxiosInstance: 1 concurrent request, <5 req/sec
 * - restAxiosInstance: <5 concurrent requests, <10 req/sec
 */
export const fetchCategoryPages = async (
  categoryTitle: string
): Promise<CategoryPagesResponse> => {
  try {
    // Category members still requires Action API as REST API doesn't have equivalent
    const url = `${WIKIPEDIA_API_CONFIG.BASE_URL}`;
    const params = {
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${categoryTitle}`,
      cmtype: 'page',
      cmlimit: 1,
      format: 'json',
      origin: '*'
    };

    const response = await actionAxiosInstance.get(url, { params });
    const data = response.data;

    if (!data.query || !data.query.categorymembers || data.query.categorymembers.length === 0) {
      return { articles: [], subcategories: [] };
    }

    const categoryMember = data.query.categorymembers[0];

    // Fetch article summary using REST API for better performance
    try {
      // Use REST API summary endpoint for thumbnails and descriptions
      const summaryUrl = `/page/summary/${encodeURIComponent(categoryMember.title)}`;
      const summaryResponse = await restAxiosInstance.get(summaryUrl);
      const summaryData = summaryResponse.data;
      
      const article = {
        title: summaryData.title,
        description: summaryData.description || summaryData.extract?.substring(0, 150) || '',
        thumbnail: summaryData.thumbnail?.source || '',
        pageid: summaryData.pageid || categoryMember.pageid,
      };

      return { articles: [article], subcategories: [] };
    } catch (error) {
      console.warn(`Failed to fetch summary for ${categoryMember.title}:`, error);
      // Fallback to original methods
      const articleResponse = await fetchArticleByTitle(categoryMember.title);
      const article = articleResponse.article;
      const description = await fetchDescription(categoryMember.title);
      
      const fallbackArticle = {
        title: categoryMember.title,
        description: description || article?.description || '',
        thumbnail: '',
        pageid: categoryMember.pageid,
      };

      return { articles: [fallbackArticle], subcategories: [] };
    }
  } catch (error: any) {
    console.error(`Failed to fetch category pages for ${categoryTitle}:`, error.response?.status, error.response?.data || error);
    return { articles: [], subcategories: [] };
  }
};
