/**
 * Type definitions for Wikipedia category-related APIs
 */

import { PageMetadata } from './base';

/**
 * Represents an article within a category
 */
export interface CategoryArticle extends PageMetadata {
  description?: string;
  extract?: string;
  extract_html?: string;
  thumbnail?: string;
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
