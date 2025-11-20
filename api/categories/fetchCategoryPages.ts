import { fetchArticleSummaries } from '@/api/articles';
import { actionAxiosInstance, WIKIPEDIA_API_CONFIG } from '@/api/shared';
import { CategoryArticle, CategoryPagesResponse, CategorySubcategory } from '@/types/api';
import { CategoryMember, ImageThumbnail, WikipediaActionApiParams, WikipediaPage, WikipediaQueryResponse } from '@/types/api/base';

export const fetchCategoryPages = async (categoryTitle: string): Promise<CategoryPagesResponse> => {
  try {
    const params: WikipediaActionApiParams = {
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${categoryTitle}`,
      cmtype: 'page|subcat',
      cmlimit: 50,
      format: 'json',
      origin: '*',
    };

    const response = await actionAxiosInstance.get<WikipediaQueryResponse>('', {
      baseURL: WIKIPEDIA_API_CONFIG.BASE_URL,
      params,
    });
    const data = response.data;

    if (!data.query || !data.query.categorymembers || data.query.categorymembers.length === 0) {
      return { articles: [], subcategories: [] };
    }

    const articles: CategoryArticle[] = [];
    const subcategories: CategorySubcategory[] = [];
    const articleMembers: CategoryMember[] = [];

    for (const member of data.query.categorymembers as CategoryMember[]) {
      if (member.ns === 14) {
        subcategories.push({
          title: member.title.replace('Category:', ''),
          description: '',
        });
      } else if (member.ns === 0) {
        articleMembers.push(member);
      }
    }

    if (articleMembers.length > 0) {
      const articleTitles = articleMembers.map((m) => m.title);
      const BATCH_SIZE = 50;
      const batches: string[][] = [];
      
      for (let i = 0; i < articleTitles.length; i += BATCH_SIZE) {
        batches.push(articleTitles.slice(i, i + BATCH_SIZE));
      }

      for (const batch of batches) {
        try {
          const titlesParam = batch.join('|');
          const batchParams: WikipediaActionApiParams = {
            action: 'query',
            prop: 'pageimages|extracts',
            titles: titlesParam,
            piprop: 'thumbnail',
            pithumbsize: 300,
            pilimit: 50,
            exintro: true,
            explaintext: true,
            exlimit: 20,
            format: 'json',
            origin: '*',
          };

          const batchResponse = await actionAxiosInstance.get<WikipediaQueryResponse>('', {
            baseURL: WIKIPEDIA_API_CONFIG.BASE_URL,
            params: batchParams,
          });

          const pages = batchResponse.data.query?.pages;
          if (pages) {
            for (const page of Object.values(pages)) {
              const pageData = page as WikipediaPage & { extract?: string; thumbnail?: ImageThumbnail };
              const member = articleMembers.find((m) => m.pageid === pageData.pageid || m.title === pageData.title);
              if (member) {
                articles.push({
                  title: pageData.title,
                  description: pageData.extract?.substring(0, 150) || '',
                  thumbnail: pageData.thumbnail?.source || '',
                  pageid: pageData.pageid || member.pageid,
                });
              }
            }
          }
        } catch (error) {
          const batchMembers = articleMembers.filter((m) => batch.includes(m.title));
          const batchTitles = batchMembers.map((m) => m.title);
          
          try {
            const fallbackSummaries = await fetchArticleSummaries(batchTitles);
            for (const member of batchMembers) {
              const article = fallbackSummaries[member.title];
              if (article) {
                articles.push({
                  title: article.title,
                  description: article.extract?.substring(0, 150) || article.description || '',
                  thumbnail: article.thumbnail?.source || '',
                  pageid: article.pageid || member.pageid,
                });
              } else {
                articles.push({
                  title: member.title,
                  description: '',
                  thumbnail: '',
                  pageid: member.pageid,
                });
              }
            }
          } catch (fallbackError) {
            for (const member of batchMembers) {
              articles.push({
                title: member.title,
                description: '',
                thumbnail: '',
                pageid: member.pageid,
              });
            }
          }
        }
      }
    }

    return { articles, subcategories };
  } catch (error: unknown) {
    return { articles: [], subcategories: [] };
  }
};
