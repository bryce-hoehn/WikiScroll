/**
 * Type definitions for Wikipedia category-related APIs
 */

import { ArticleContent } from './base';

/**
 * Represents a simplified category entry returned from the API
 */
export interface CategoryPage {
  title: string;
  pageid?: number;
  ns?: number;
}

/**
 * Represents a category member (article or subcategory)
 */
export interface CategoryMember {
  pageid: number;
  title: string;
  ns: number;
}

/**
 * Represents an article within a category
 */
export interface CategoryArticle extends ArticleContent {
  pageid: number;
}

/**
 * Represents a subcategory within a category
 */
export interface CategorySubcategory {
  title: string;
  description?: string;
}

/**
 * Response from fetchCategoryPages API
 */
export interface CategoryPagesResponse {
  articles: CategoryArticle[];
  subcategories: CategorySubcategory[];
  error?: string;
}
