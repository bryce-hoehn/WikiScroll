/**
 * Type definitions for Wikipedia search-related APIs
 */

import { ImageThumbnail } from './base';

/**
 * Search suggestion from Wikipedia API
 */
export interface SearchSuggestion {
  title: string;
  description?: string;
  image?: string;
}

/**
 * Raw search result from Wikipedia API
 */
export interface RawSearchResult {
  pageid: number;
  title: string;
  snippet?: string;
  ns?: number;
  size?: number;
  wordcount?: number;
  timestamp?: string;
}

/**
 * Page info with images from Wikipedia API
 */
export interface PageInfo {
  pageid: number;
  title: string;
  thumbnail?: ImageThumbnail;
  pageimage?: string;
}

/**
 * Response from fetchSearchSuggestions API
 */
export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
  error?: string;
}

/**
 * Raw API response for search
 */
export interface RawSearchResponse {
  query?: {
    search?: RawSearchResult[];
  };
}

/**
 * Raw API response for page info
 */
export interface RawPageInfoResponse {
  query?: {
    pages?: Record<string, PageInfo>;
  };
}
