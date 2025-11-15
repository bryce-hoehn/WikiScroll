import { useQueryClient } from '@tanstack/react-query';
import { fetchArticleSummary } from '../api';
import { ImageThumbnail } from '../types/api/base';
import { Bookmark, OfflineArticle } from '../types/bookmarks';
import { BookmarkStorage } from '../utils/bookmarkStorage';

/**
 * Service class for bookmark operations
 * Extracts complex logic from BookmarksContext
 */
export class BookmarkService {
  private queryClient: ReturnType<typeof useQueryClient>;

  constructor(queryClient: ReturnType<typeof useQueryClient>) {
    this.queryClient = queryClient;
  }

  /**
   * Download article for offline reading
   */
  async downloadArticle(
    title: string,
    currentOfflineArticles: Record<string, OfflineArticle>
  ): Promise<boolean> {
    try {
      // Use React Query's cache first, then fetch if needed
      const cachedArticle = this.queryClient.getQueryData(['article', title]);
      
      let article: OfflineArticle | undefined;
      if (cachedArticle) {
        article = cachedArticle as OfflineArticle;
      } else {
        // Fetch and cache the article
        const articleResponse = await fetchArticleSummary(title);
        if (articleResponse.article) {
          article = {
            ...articleResponse.article,
            downloadedAt: new Date().toISOString(),
          };
          this.queryClient.setQueryData(['article', title], article);
        }
      }

      if (article) {
        const updatedOfflineArticles = {
          ...currentOfflineArticles,
          [title]: article
        };
        
        await BookmarkStorage.saveOfflineArticles(updatedOfflineArticles);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to download article for offline reading:', error);
      return false;
    }
  }

  /**
   * Add a bookmark and automatically cache for offline reading
   */
  async addBookmark(
    title: string,
    currentBookmarks: Bookmark[],
    currentOfflineArticles: Record<string, OfflineArticle>,
    thumbnail?: ImageThumbnail,
    summary?: string
  ): Promise<Bookmark[]> {
    try {
      const newBookmark: Bookmark = {
        title,
        thumbnail,
        summary,
        bookmarkedAt: new Date().toISOString(),
      };

      const updatedBookmarks = [newBookmark, ...currentBookmarks];
      await BookmarkStorage.saveBookmarks(updatedBookmarks);
      
      // Automatically cache article for offline reading (silently in background)
      this.downloadArticle(title, currentOfflineArticles).catch(() => {
        // Silent fail - offline caching is best effort
      });
      
      return updatedBookmarks;
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      return currentBookmarks;
    }
  }

  /**
   * Remove a bookmark and associated offline article
   */
  async removeBookmark(
    title: string,
    currentBookmarks: Bookmark[],
    currentOfflineArticles: Record<string, OfflineArticle>
  ): Promise<{ bookmarks: Bookmark[]; offlineArticles: Record<string, OfflineArticle> }> {
    try {
      const updatedBookmarks = currentBookmarks.filter(bookmark => bookmark.title !== title);
      await BookmarkStorage.saveBookmarks(updatedBookmarks);
      
      // Remove from offline articles if it exists
      let updatedOfflineArticles = { ...currentOfflineArticles };
      if (currentOfflineArticles[title]) {
        const { [title]: removed, ...remainingOfflineArticles } = currentOfflineArticles;
        updatedOfflineArticles = remainingOfflineArticles;
        await BookmarkStorage.saveOfflineArticles(updatedOfflineArticles);
      }
      
      return { bookmarks: updatedBookmarks, offlineArticles: updatedOfflineArticles };
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      return { bookmarks: currentBookmarks, offlineArticles: currentOfflineArticles };
    }
  }

  /**
   * Download all bookmarks for offline reading
   */
  async downloadAllBookmarks(
    currentBookmarks: Bookmark[],
    currentOfflineArticles: Record<string, OfflineArticle>
  ): Promise<Record<string, OfflineArticle>> {
    try {
      const bookmarkTitles = currentBookmarks.map(bookmark => bookmark.title);
      
      // Fetch articles individually using fetchArticleSummary
      const fetchedArticles = await Promise.all(
        bookmarkTitles.map(async (title) => {
          try {
            const articleResponse = await fetchArticleSummary(title);
            return articleResponse.article;
          } catch (error) {
            console.warn(`Failed to fetch article: ${title}`, error);
            return null;
          }
        })
      );
      
      // Process downloaded articles
      const updatedOfflineArticles = { ...currentOfflineArticles };
      
      fetchedArticles.forEach(article => {
        if (article) {
          const offlineArticle: OfflineArticle = {
            ...article,
            downloadedAt: new Date().toISOString(),
          };
          updatedOfflineArticles[article.title] = offlineArticle;
        }
      });
      
      await BookmarkStorage.saveOfflineArticles(updatedOfflineArticles);
      
      return updatedOfflineArticles;
    } catch (error) {
      console.error('Failed to download all bookmarks:', error);
      return currentOfflineArticles;
    }
  }
}