/**
 * Base type definitions shared across all Wikipedia API types
 * 
 * BASE TYPES vs DOMAIN-SPECIFIC TYPES:
 * 
 * Base types are reusable building blocks that define common structures
 * used across multiple domain-specific types. They provide consistency
 * and reduce duplication throughout the type system.
 * 
 * Examples of base type usage:
 * - ImageThumbnail is used by Article, FeaturedArticle, Bookmark, etc.
 * - ArticleContent provides common article metadata structure
 * - ApiResponse<T> provides consistent API response wrapping
 * 
 * When creating new domain types, consider if they can reuse existing
 * base types rather than defining similar structures from scratch.
 */

/**
 * Common image/thumbnail structure used across multiple APIs
 * 
 * This interface standardizes how images are represented throughout
 * the application, ensuring consistent property names and structure.
 * 
 * Used by: Article, FeaturedArticle, Bookmark, RecommendationItem, etc.
 */
export interface ImageThumbnail {
  source: string;
  width?: number;
  height?: number;
}

/**
 * Common page metadata structure
 */
export interface PageMetadata {
  pageid: number;
  title: string;
  ns?: number;
}

/**
 * Common content structure for articles
 */
export interface ArticleContent {
  title: string;
  description?: string;
  extract?: string;
  extract_html?: string;
  thumbnail?: string;
}

/**
 * Common content URLs structure used across multiple APIs
 * 
 * This interface standardizes how content URLs are represented throughout
 * the application, providing consistent desktop and mobile URL structures.
 * 
 * Used by: Article, FeaturedArticle, etc.
 */
export interface ContentUrls {
  desktop: {
    page: string;
    revisions?: string;
    edit?: string;
    talk?: string;
  };
  mobile: {
    page: string;
    revisions?: string;
    edit?: string;
    talk?: string;
  };
}

/**
 * Common API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status?: number;
}
