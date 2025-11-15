import { FeaturedContentResponse } from '../../types/api';
import { restAxiosInstance, WIKIPEDIA_API_CONFIG } from '../shared';

/**
 * Fetches featured content from Wikipedia using the Featured Feed API
 * with fallback to previous day if current day is not available
 */
export const fetchFeaturedContent = async (): Promise<FeaturedContentResponse> => {
  const tryFetchForDate = async (date: Date): Promise<any> => {
    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('/');

    const url = `/feed/v1/wikipedia/en/featured/${formattedDate}`;
    
    try {
      const response = await restAxiosInstance.get(url, {
        baseURL: WIKIPEDIA_API_CONFIG.WIKIMEDIA_BASE_URL,
        timeout: 10000, // 10 second timeout
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 504 || error.code === 'ECONNABORTED') {
        return null;
      }
      throw error;
    }
  };

  try {
    // Try current day first
    const today = new Date();
    let data = await tryFetchForDate(today);
    
    // If current day fails, try previous day
    if (!data) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      data = await tryFetchForDate(yesterday);
    }
    
    // If both fail, throw the original error
    if (!data) {
      throw new Error('Featured content not available for current or previous day');
    }

    return {
      data,
    };
  } catch (error: any) {
    console.error('Failed to fetch featured content:', error.response?.status, error.response?.data || error);
    throw error;
  }
};
