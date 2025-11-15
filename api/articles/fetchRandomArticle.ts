import { ArticleResponse } from '../../types/api/articles';
import { restAxiosInstance } from '../shared';

export const fetchRandomArticle = async (maxRetries = 3): Promise<ArticleResponse> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Use Wikipedia REST API to get a random page summary
      const url = '/page/random/summary';
      const response = await restAxiosInstance.get(url, {
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status === 200 // Only accept 200 OK
      });

      const data = response.data;

      // Validate that we got a proper article with required fields
      if (!data.title || !data.extract) {
        console.warn(`Random article missing required fields, attempt ${attempt}/${maxRetries}`);
        continue; // Try again
      }

      return {
        article: data,
      };
    } catch (error: any) {
      console.warn(`Failed to fetch random article (attempt ${attempt}/${maxRetries}):`, error.message);
      
      // If it's a 404 or network error, retry
      if (error.response?.status === 404 || error.code === 'NETWORK_ERROR') {
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
          continue;
        }
      }
      
      // For other errors or final attempt, return error
      return {
        article: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
  
  // Should never reach here, but TypeScript wants it
  return {
    article: null,
    error: 'All retry attempts failed',
  };
};
