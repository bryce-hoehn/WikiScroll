import { ArticleResponse } from '../../types/api';
import { WtfDocument } from '../../types/third-party/wtf-article';
import { wtfWithPlugins } from '../shared';

/**
 * Fetch a Wikipedia article by title using axios and wtf_wikipedia
 */
export const fetchArticleByTitle = async (title: string): Promise<ArticleResponse> => {
  try {
    // Parse the HTML using wtf_wikipedia with plugins
    const article = (await wtfWithPlugins.fetch(title)) as unknown as WtfDocument | null;

    // Return the JSON representation
    if (article) {
      const articleData = article.json();
      return { article: articleData };
    }
    
    return { article: null };
  } catch (error: any) {
    console.error('Failed to fetch article:', title, error.response?.status, error.response?.data);
    return { article: null, error: error.message };
  }
};
