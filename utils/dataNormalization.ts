/**
 * Utility functions for normalizing data structures
 */

import { Article } from '../types/api/articles';
import { SearchSuggestion } from '../types/api/search';
import { Bookmark } from '../types/bookmarks';
import { RecommendationItem } from '../types/components';

/**
 * Normalize an Article to RecommendationItem format
 */
export function normalizeArticle(article: Article): RecommendationItem {
  return {
    title: article.title,
    displaytitle: article.titles?.normalized || article.displaytitle || article.title,
    description: article.description || article.extract,
    thumbnail: typeof article.thumbnail === 'string' 
      ? { source: article.thumbnail, width: 0, height: 0 }
      : article.thumbnail,
    pageid: article.pageid,
  };
}

/**
 * Normalize a SearchSuggestion to RecommendationItem format
 */
export function normalizeSearchSuggestion(suggestion: SearchSuggestion): RecommendationItem {
  return {
    title: suggestion.title,
    displaytitle: suggestion.title,
    description: suggestion.description,
    thumbnail: suggestion.image ? { source: suggestion.image } : undefined,
  };
}

/**
 * Normalize a Bookmark to RecommendationItem format
 */
export function normalizeBookmark(bookmark: Bookmark): RecommendationItem {
  return {
    title: bookmark.title,
    displaytitle: bookmark.title,
    description: bookmark.summary,
    thumbnail: bookmark.thumbnail,
  };
}

/**
 * Normalize an array of Articles to RecommendationItem format
 */
export function normalizeArticles(articles: Article[]): RecommendationItem[] {
  return articles.map(normalizeArticle);
}

/**
 * Normalize an array of SearchSuggestions to RecommendationItem format
 */
export function normalizeSearchSuggestions(suggestions: SearchSuggestion[]): RecommendationItem[] {
  return suggestions.map(normalizeSearchSuggestion);
}

/**
 * Normalize an array of Bookmarks to RecommendationItem format
 */
export function normalizeBookmarks(bookmarks: Bookmark[]): RecommendationItem[] {
  return bookmarks.map(normalizeBookmark);
}

/**
 * Generic normalizer that handles any supported type
 */
export function normalizeToRecommendationItem(item: Article | SearchSuggestion | Bookmark): RecommendationItem {
  if ('bookmarkedAt' in item) {
    return normalizeBookmark(item as Bookmark);
  } else if ('image' in item) {
    return normalizeSearchSuggestion(item as SearchSuggestion);
  } else {
    return normalizeArticle(item as Article);
  }
}

/**
 * Generic normalizer for arrays of any supported type
 */
export function normalizeToRecommendationItems(items: (Article | SearchSuggestion | Bookmark)[]): RecommendationItem[] {
  return items.map(normalizeToRecommendationItem);
}
