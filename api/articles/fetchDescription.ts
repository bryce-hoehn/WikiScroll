import { restAxiosInstance } from '../shared';

export const fetchDescription = async (title: string): Promise<string | null> => {
  try {
    // Use the REST API summary endpoint to get the description
    const response = await restAxiosInstance.get(`/page/summary/${encodeURIComponent(title)}`);
    const summaryData = response.data;
    
    // Return the description or extract from the summary
    return summaryData.description || summaryData.extract || null;
  } catch (error: any) {
    console.error(`Failed to fetch description for "${title}":`, error.response?.status, error.response?.data || error);
    return null;
  }
};
