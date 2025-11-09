import { RandomArticleResponse } from '../../types/api';
import { axiosInstance } from '../shared';

export const fetchRandomArticle = async (): Promise<RandomArticleResponse> => {
  try {
    // Use Wikipedia REST API to get a random page summary
    const url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
    const response = await axiosInstance.get(url);

    const data = response.data;

    return {
      article: data,
    };
  } catch (error: unknown) {
    console.error('Failed to fetch random article:', error);
    return {
      article: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
