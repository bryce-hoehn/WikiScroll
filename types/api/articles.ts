/**
 * Type definitions for Wikipedia article-related APIs
 * 
 * These types represent the structure returned by the Wikipedia REST API
 * and should not be confused with wtf_wikipedia parsed data structures.
 */

import { WtfArticle } from '../third-party/wtf-article';
import { ContentUrls } from './base';


/**
 * Represents a full Wikipedia article from the REST API
 * 
 * This structure is returned by Wikipedia's REST API endpoints
 * and contains metadata, summary, and basic article information.
 * 
 * Example endpoints:
 * - /api/rest_v1/page/summary/{title}
 * - /api/rest_v1/page/random/summary
 */
export interface Article {
  type?: string;
  title: string;
  displaytitle?: string;
  normalizedtitle?: string;
  pageid?: number;
  lang?: string;
  dir?: string;
  revision?: string;
  tid?: string;
  timestamp?: string;
  description?: string;
  description_source?: string;
  extract?: string;
  extract_html?: string;
  namespace?: {
    id: number;
    text: string;
  };
  wikibase_item?: string;
  titles?: {
    canonical: string;
    display: string;
    normalized: string;
  };
  thumbnail?: import('./base').ImageThumbnail;
  originalimage?: import('./base').ImageThumbnail;
  content_urls?: ContentUrls;
  views?: number;
}

/**
 * Response from fetchArticleByTitle API
 */
export interface ArticleResponse {
  article: WtfArticle | null;
  error?: string;
}

/**
 * Response from fetchRandomArticle API
 */
export interface RandomArticleResponse {
  article: Article | null;
  error?: string;
}

/**
 * Response from fetchDescription API
 */
export interface ArticleDescriptionResponse {
  description: string | null;
  error?: string;
}

/**
 * Response from fetchArticleThumbnail API
 */
export interface ArticleThumbnailResponse {
  thumbnail: string | null;
  error?: string;
}
