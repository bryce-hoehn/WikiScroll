import { axiosInstance } from '../shared';

export const fetchArticleThumbnail = async (title: string): Promise<string> => {
  try {
    // Use Wikipedia REST API to fetch page summary including thumbnail
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const response = await axiosInstance.get(url);

    const data = response.data;

    // Check if thumbnail exists in the response
    if (data.thumbnail && data.thumbnail.source) {
      return data.thumbnail; // Return ImageThumbnail
    }

    return '';
  } catch (error: any) {
    console.error(`Error fetching thumbnail for ${title}:`, error.response?.status, error.response?.data || error);
    return '';
  }
};
