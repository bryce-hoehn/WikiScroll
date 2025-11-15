import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BookmarkService } from '../services/BookmarkService';
import { ImageThumbnail } from '../types/api/base';
import { Bookmark, BookmarksContextType, OfflineArticle } from '../types/bookmarks';
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

  // Initialize bookmark service
  const bookmarkService = useMemo(() => new BookmarkService(queryClient), [queryClient]);

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
    const success = await bookmarkService.downloadArticle(title, offlineArticles);
    if (success) {
      const updatedOfflineArticles = await BookmarkStorage.loadOfflineArticles();
      setOfflineArticles(updatedOfflineArticles);
    }
    return success;
  }, [bookmarkService, offlineArticles]);

  const addBookmark = useCallback(async (title: string, thumbnail?: ImageThumbnail, summary?: string): Promise<boolean> => {
    const updatedBookmarks = await bookmarkService.addBookmark(
      title,
      bookmarks,
      offlineArticles,
      thumbnail,
      summary
    );
    setBookmarks(updatedBookmarks);
    return true;
  }, [bookmarkService, bookmarks, offlineArticles]);

  const removeBookmark = useCallback(async (title: string): Promise<boolean> => {
    const result = await bookmarkService.removeBookmark(title, bookmarks, offlineArticles);
    setBookmarks(result.bookmarks);
    setOfflineArticles(result.offlineArticles);
    return true;
  }, [bookmarkService, bookmarks, offlineArticles]);

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
    const updatedOfflineArticles = await bookmarkService.downloadAllBookmarks(bookmarks, offlineArticles);
    setOfflineArticles(updatedOfflineArticles);
    return Object.keys(updatedOfflineArticles).length > Object.keys(offlineArticles).length;
  }, [bookmarkService, bookmarks, offlineArticles]);

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
