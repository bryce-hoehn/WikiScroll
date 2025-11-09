import { SearchSuggestion } from '../../types/api';
import { axiosInstance, WIKIPEDIA_API_CONFIG } from '../shared';

export const fetchSearchSuggestions = async (
  query: string
): Promise<SearchSuggestion[]> => {
  if (!query.trim()) return [];

  try {
    console.log('Starting search for:', query);

    // Use Wikipedia Action API for search suggestions - increased to 10 results
    const searchUrl = `${WIKIPEDIA_API_CONFIG.BASE_URL}?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=10&format=json&origin=*`;
    
    console.log('Search URL:', searchUrl);

    const searchResponse = await axiosInstance.get(searchUrl);
    const searchData = searchResponse.data;

    console.log('Search data received:', searchData);

    const results = searchData.query?.search || [];
    console.log('Search results count:', results.length);

    if (results.length === 0) return [];

    // Fetch page info for all results to get images and descriptions
    const pageIds = results.map((result: any) => result.pageid).join('|');
    const pageInfoUrl = `${WIKIPEDIA_API_CONFIG.BASE_URL}?action=query&pageids=${pageIds}&prop=pageimages|extracts|description&pithumbsize=200&exintro=1&explaintext=1&format=json&origin=*`;
    
    const pageInfoResponse = await axiosInstance.get(pageInfoUrl);
    const pageInfoData = pageInfoResponse.data;
    const pages = pageInfoData.query?.pages || {};

    return results.map((result: any) => {
      const pageInfo = pages[result.pageid] || {};
      return {
        title: result.title,
        description: pageInfo.description || pageInfo.extract?.substring(0, 150) || result.snippet?.replace(/<[^>]*>/g, '') || '',
        image: pageInfo.thumbnail?.source,
      };
    });
  } catch (error: any) {
    console.error('Failed to fetch search suggestions:', error.response?.status, error.response?.data || error);
    return [];
  }
};
