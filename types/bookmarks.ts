import { Article } from './api';
import { ImageThumbnail } from './api/base';

export interface Bookmark {
  title: string;
  thumbnail?: ImageThumbnail;
  summary?: string;
  bookmarkedAt: string;
}

export interface OfflineArticle extends Article {
  downloadedAt: string;
}

export interface BookmarksContextType {
  bookmarks: Bookmark[];
  addBookmark: (title: string, thumbnail?: ImageThumbnail, summary?: string) => Promise<boolean>;
  removeBookmark: (title: string) => Promise<boolean>;
  isBookmarked: (title: string) => boolean;
  clearBookmarks: () => Promise<void>;
  loadBookmarks: () => Promise<void>;
  // Offline reading functionality
  offlineArticles: Record<string, OfflineArticle>;
  isArticleDownloaded: (title: string) => boolean;
  getOfflineArticle: (title: string) => OfflineArticle | null;
  downloadArticle: (title: string) => Promise<boolean>;
  downloadAllBookmarks: () => Promise<boolean>;
}
