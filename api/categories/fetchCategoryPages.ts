import { CategoryPage, CategoryPagesResponse } from '../../types/api';
import { fetchArticleByTitle } from '../articles';
import { fetchDescription } from '../articles/fetchDescription';
import { axiosInstance, WIKIPEDIA_API_CONFIG } from '../shared';

export const fetchCategoryPages = async (
  categoryTitle: string
): Promise<CategoryPagesResponse> => {
  try {
    // Category members still requires Action API as REST API doesn't have equivalent
    const url = `${WIKIPEDIA_API_CONFIG.BASE_URL}`;
    const params = {
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${categoryTitle}`,
      cmtype: 'page|subcat',
      cmlimit: 50,
      format: 'json',
      origin: '*'
    };

    const response = await axiosInstance.get(url, { params });
    const data = response.data;

    if (!data.query || !data.query.categorymembers) {
      return { articles: [], subcategories: [] };
    }

    const categoryMembers = data.query.categorymembers;

    // Fetch article summaries using REST API for better performance
    const articlePromises = categoryMembers
      .filter((m: CategoryPage) => m.ns === 0)
      .map(async (m: CategoryPage) => {
        try {
          // Use REST API summary endpoint for thumbnails and descriptions
          const summaryUrl = `/page/summary/${encodeURIComponent(m.title)}`;
          const summaryResponse = await axiosInstance.get(summaryUrl);
          const summaryData = summaryResponse.data;
          
          return {
            title: m.title,
            description: summaryData.description || summaryData.extract?.substring(0, 150) || '',
            thumbnail: summaryData.thumbnail?.source || '',
          };
        } catch (error) {
          console.warn(`Failed to fetch summary for ${m.title}:`, error);
          // Fallback to original methods
          const articleResponse = await fetchArticleByTitle(m.title);
          const article = articleResponse.article;
          const description = await fetchDescription(m.title);
          return {
            title: m.title,
            description: description || article?.description || '',
            thumbnail: '',
          };
        }
      });

    const articles = await Promise.all(articlePromises);

    // Process subcategories with fetchDescription
    const subcategories = await Promise.all(
      categoryMembers
        .filter((m: CategoryPage) => m.ns === 14)
        .map(async (m: CategoryPage) => {
          const subcategoryTitle = m.title.replace(/^Category:/, '');
          const description = await fetchDescription(m.title);
          return {
            title: subcategoryTitle,
            description: description || subcategoryTitle,
          };
        })
    );

    return { articles, subcategories };
  } catch (error: any) {
    console.error(`Failed to fetch category pages for ${categoryTitle}:`, error.response?.status, error.response?.data || error);
    return { articles: [], subcategories: [] };
  }
};
