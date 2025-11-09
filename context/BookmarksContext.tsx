import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchArticleByTitle } from '../api';
import { ImageThumbnail } from '../types/api/base';
import { Bookmark, BookmarksContextType, OfflineArticle } from '../types/bookmarks';
import { WtfArticle } from '../types/third-party/wtf-article';
import { BookmarkStorage } from '../utils/bookmarkStorage';

// Create context for bookmarks
const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

/**
 * Provider component for bookmarks context
 */
export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [offlineArticles, setOfflineArticles] = useState<Record<string, OfflineArticle>>({});
  const queryClient = useQueryClient();

  const loadBookmarks = useCallback(async () => {
    const loadedBookmarks = await BookmarkStorage.loadBookmarks();
    setBookmarks(loadedBookmarks);
  }, []);

  const loadOfflineArticles = useCallback(async () => {
    const loadedArticles = await BookmarkStorage.loadOfflineArticles();
    setOfflineArticles(loadedArticles);
  }, []);

  // Load bookmarks and offline articles from storage on mount
  useEffect(() => {
    loadBookmarks();
    loadOfflineArticles();
  }, [loadBookmarks, loadOfflineArticles]);

  const downloadArticle = useCallback(async (title: string): Promise<boolean> => {
    try {
      // Use React Query's cache first, then fetch if needed
      const cachedArticle = queryClient.getQueryData(['article', title]);
      
      let article: WtfArticle | undefined;
      if (cachedArticle) {
        article = cachedArticle as WtfArticle;
      } else {
        // Fetch and cache the article
        const articleResponse = await fetchArticleByTitle(title);
        if (articleResponse.article) {
          article = articleResponse.article as WtfArticle;
          queryClient.setQueryData(['article', title], article);
        }
      }

      if (article) {
        const offlineArticle: OfflineArticle = {
          title: article.title,
          thumbnail: article.thumbnail,
          description: article.description,
          sections: article.sections,
          downloadedAt: new Date().toISOString(),
        };

        const updatedOfflineArticles = {
          ...offlineArticles,
          [title]: offlineArticle
        };
        
        setOfflineArticles(updatedOfflineArticles);
        await BookmarkStorage.saveOfflineArticles(updatedOfflineArticles);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to download article for offline reading:', error);
      return false;
    }
  }, [offlineArticles, queryClient]);

  const addBookmark = useCallback(async (title: string, thumbnail?: ImageThumbnail, summary?: string): Promise<boolean> => {
    try {
      const newBookmark: Bookmark = {
        title,
        thumbnail,
        summary,
        bookmarkedAt: new Date().toISOString(),
      };

      const updatedBookmarks = [newBookmark, ...bookmarks];
      setBookmarks(updatedBookmarks);
      await BookmarkStorage.saveBookmarks(updatedBookmarks);
      
      // Automatically cache article for offline reading (silently in background)
      downloadArticle(title).catch(() => {
        // Silent fail - offline caching is best effort
      });
      
      return true;
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      return false;
    }
  }, [bookmarks, downloadArticle]);

  const removeBookmark = useCallback(async (title: string): Promise<boolean> => {
    try {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.title !== title);
      setBookmarks(updatedBookmarks);
      await BookmarkStorage.saveBookmarks(updatedBookmarks);
      
      // Remove from offline articles if it exists
      if (offlineArticles[title]) {
        const { [title]: removed, ...remainingOfflineArticles } = offlineArticles;
        setOfflineArticles(remainingOfflineArticles);
        await BookmarkStorage.saveOfflineArticles(remainingOfflineArticles);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      return false;
    }
  }, [bookmarks, offlineArticles]);

  const isBookmarked = useCallback((title: string): boolean => {
    return bookmarks.some(bookmark => bookmark.title === title);
  }, [bookmarks]);

  const isArticleDownloaded = useCallback((title: string): boolean => {
    return !!offlineArticles[title];
  }, [offlineArticles]);

  const getOfflineArticle = useCallback((title: string): OfflineArticle | null => {
    return offlineArticles[title] || null;
  }, [offlineArticles]);

  const clearBookmarks = useCallback(async (): Promise<void> => {
    try {
      setBookmarks([]);
      setOfflineArticles({});
      await BookmarkStorage.clearAll();
    } catch (error) {
      console.error('Failed to clear bookmarks:', error);
    }
  }, []);

  const downloadAllBookmarks = useCallback(async (): Promise<boolean> => {
    try {
      const bookmarkTitles = bookmarks.map(bookmark => bookmark.title);
      
      // Fetch articles individually using fetchArticleByTitle
      const fetchedArticles = await Promise.all(
        bookmarkTitles.map(async (title) => {
          try {
            const articleResponse = await fetchArticleByTitle(title);
            return articleResponse.article;
          } catch (error) {
            console.warn(`Failed to fetch article: ${title}`, error);
            return null;
          }
        })
      );
      
      // Process downloaded articles
      const updatedOfflineArticles = { ...offlineArticles };
      let successCount = 0;
      
      fetchedArticles.forEach(article => {
        if (article) {
          const wtfArticle = article as WtfArticle;
          const offlineArticle: OfflineArticle = {
            title: wtfArticle.title,
            thumbnail: wtfArticle.thumbnail,
            description: wtfArticle.description,
            sections: wtfArticle.sections,
            downloadedAt: new Date().toISOString(),
          };
          updatedOfflineArticles[wtfArticle.title] = offlineArticle;
          successCount++;
        }
      });
      
      setOfflineArticles(updatedOfflineArticles);
      await BookmarkStorage.saveOfflineArticles(updatedOfflineArticles);
      
      console.log(`Successfully downloaded ${successCount} out of ${bookmarkTitles.length} bookmarks`);
      return successCount > 0;
    } catch (error) {
      console.error('Failed to download all bookmarks:', error);
      return false;
    }
  }, [bookmarks, offlineArticles]);

  const value: BookmarksContextType = {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearBookmarks,
    loadBookmarks,
    // Offline reading functionality
    offlineArticles,
    isArticleDownloaded,
    getOfflineArticle,
    downloadArticle,
    downloadAllBookmarks,
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
}

/**
 * Hook to use bookmarks context
 */
export function useBookmarks(): BookmarksContextType {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
