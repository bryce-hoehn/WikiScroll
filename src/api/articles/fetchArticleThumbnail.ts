import { restAxiosInstance, WIKIPEDIA_API_CONFIG } from '@/api/shared';
import type { ImageThumbnail } from '@/types/api/base';

export const fetchArticleThumbnail = async (
  title: string
): Promise<ImageThumbnail | null> => {
  try {
    const url = `/page/summary/${encodeURIComponent(title)}`;
    const response = await restAxiosInstance.get(url, {
      baseURL: WIKIPEDIA_API_CONFIG.REST_API_BASE_URL
    });

    const data = response.data;

    if (data.thumbnail && data.thumbnail.source) {
      return data.thumbnail;
    }

    return null;
  } catch (error: unknown) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      const status = (error as { response?: { status?: number } }).response
        ?.status;
      // Only log non-404 errors (404 is expected for articles without thumbnails)
      if (status !== 404) {
        console.warn(
          `Thumbnail fetch failed for "${title}" (status: ${status || 'unknown'})`
        );
      }
    }
    return null;
  }
};
