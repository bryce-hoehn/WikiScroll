import { Share } from 'react-native';

/**
 * Share a Wikipedia article
 * @param title - Article title
 * @param description - Article description (optional)
 * @param url - Article URL (optional, will generate from title if not provided)
 */
export const shareArticle = async (
  title: string,
  description?: string,
  url?: string
): Promise<void> => {
  try {
    const articleUrl = url || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
    
    await Share.share({
      message: articleUrl,
      title: `Share "${title}"`,
    });
  } catch (error) {
    console.error('Error sharing article:', error);
    throw error;
  }
};

/**
 * Check if sharing is available on the current device
 */
export const isSharingAvailable = async (): Promise<boolean> => {
  return true; // React Native Share is always available
};