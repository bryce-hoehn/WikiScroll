/**
 * API-related type definitions for Wikipedia Expo
 */

// Export all types from modular files
import { Article } from './articles';
import { ImageThumbnail } from './base';

export * from './articles';
export * from './base';
export * from './categories';
export * from './featured';
export * from './search';

/**
 * Represents a bookmark item
 */
export interface BookmarkItem {
  title: string;
  thumbnail?: ImageThumbnail;
  summary?: string;
  bookmarkedAt: Date;
}

/**
 * Represents a visited article item
 */
export interface VisitedArticleItem {
  title: string;
  visitedAt: string;
  article?: Article;
}
