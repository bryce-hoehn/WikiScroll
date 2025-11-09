import { FeaturedContentResponse } from '../../types/api';
import { axiosInstance, WIKIPEDIA_API_CONFIG } from '../shared';

/**
 * Fetches featured content from Wikipedia using the Featured Feed API
 */
export const fetchFeaturedContent = async (): Promise<FeaturedContentResponse> => {
  try {
    const today = new Date();
    const formattedDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('/');

    const url = `${WIKIPEDIA_API_CONFIG.WIKIMEDIA_BASE_URL}/feed/v1/wikipedia/en/featured/${formattedDate}`;
    
    const response = await axiosInstance.get(url);

    return {
      data: response.data,
    };
  } catch (error: any) {
    console.error('Failed to fetch featured content:', error.response?.status, error.response?.data || error);
    throw error;
  }
};
