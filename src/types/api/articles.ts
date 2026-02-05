/**
 * Type definitions for Wikipedia article-related APIs
 *
 * These types represent the structure returned by the Wikipedia REST API
 * and should not be confused with wtf_wikipedia parsed data structures.
 */

import { WikipediaPageBase } from './base';

/**
 * Represents a Wikipedia article summary from the REST API
 *
 * This structure is returned by Wikipedia's summary endpoints
 * and contains metadata, summary, and basic article information.
 *
 * Example endpoints:
 * - /api/rest_v1/page/summary/{title}
 * - /api/rest_v1/page/random/summary
 */
export interface Article extends WikipediaPageBase {
  extract?: string;
  extract_html?: string;
  views?: number;
  html?: string;
}

/**
 * Generic response interface for article-related APIs
 */
export interface ArticleResponse<T = Article> {
  article: T | null;
  error?: string;
}
