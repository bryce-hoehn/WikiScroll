/**
 * Shared application type definitions for Wikipedia Expo
 */

/**
 * Navigation route parameters
 */
export interface ArticleRouteParams {
  title: string;
}

export interface CategoryRouteParams {
  title: string;
}

/**
 * Theme-related types
 */
export interface AppTheme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    onSurface: string;
    onSurfaceVariant: string;
    outlineVariant: string;
    surfaceVariant: string;
    onPrimaryContainer: string;
    primaryContainer: string;
    error: string;
  };
}

/**
 * Storage keys for AsyncStorage
 */
export interface StorageKeys {
  BOOKMARKS: string;
  VISITED_ARTICLES: string;
  THEME_PREFERENCE: string;
}

/**
 * App configuration types
 */
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    userAgent: string;
  };
  ui: {
    cardMargin: number;
    animationDuration: number;
  };
}

/**
 * Error types
 */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Search parameters
 */
export interface SearchParams {
  query: string;
  limit?: number;
  offset?: number;
}

/**
 * Category types
 */
export interface RootCategory {
  name: string;
  icon: string;
}

/**
 * Tab navigation types
 */
export interface TabRoute {
  key: string;
  title: string;
  icon: string;
}
