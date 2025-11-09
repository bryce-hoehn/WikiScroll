/**
 * Type definitions for wtf_wikipedia parsed article data
 * 
 * This represents the structure returned by wtf_wikipedia library
 * which is different from the Wikipedia REST API structure
 */

/**
 * Represents a link within an article sentence from wtf_wikipedia
 */
export interface WtfArticleLink {
  text?: string;
  type: string;
  page: string;
  anchor?: string;
}

/**
 * Represents formatting within an article sentence from wtf_wikipedia
 */
export interface WtfArticleFormatting {
  bold?: string[];
}

/**
 * Represents a sentence within an article paragraph from wtf_wikipedia
 */
export interface WtfArticleSentence {
  text: string;
  links?: WtfArticleLink[];
  formatting?: WtfArticleFormatting;
}

/**
 * Represents a paragraph within an article section from wtf_wikipedia
 */
export interface WtfArticleParagraph {
  sentences?: WtfArticleSentence[];
}

/**
 * Represents an image within an article section from wtf_wikipedia
 */
export interface WtfArticleImage {
  thumb?: string;
  alt?: string;
  caption?: string;
  url?: string;
  file?: string;
}

/**
 * Represents a list item within an article section from wtf_wikipedia
 */
export interface WtfArticleListItem {
  text: string;
  links?: WtfArticleLink[];
}

/**
 * Represents a Wikipedia template from wtf_wikipedia
 */
export interface WtfArticleTemplate {
  name: string;
  data: Record<string, string | number | boolean>;
}

/**
 * Represents a Wikipedia infobox from wtf_wikipedia
 */
export interface WtfArticleInfobox {
  type: string;
  data: Record<string, string | number | boolean>;
}

/**
 * Represents a Wikipedia reference from wtf_wikipedia
 */
export interface WtfArticleReference {
  id?: string;
  title?: string;
  url?: string;
  text?: string;
  author?: string;
  publisher?: string;
  date?: string;
}

/**
 * Represents a section within an article from wtf_wikipedia
 */
export interface WtfArticleSection {
  title?: string;
  depth?: number;
  paragraphs?: WtfArticleParagraph[];
  templates?: WtfArticleTemplate[];
  infoboxes?: WtfArticleInfobox[];
  references?: WtfArticleReference[];
  images?: WtfArticleImage[];
  lists?: WtfArticleListItem[][];
}

/**
 * Represents a full Wikipedia article parsed by wtf_wikipedia
 * 
 * This structure is returned by wtf_wikipedia library and contains
 * detailed parsed content including sections, templates, infoboxes, etc.
 * 
 * Example usage:
 * const doc = await wtf.fetch('Apple Inc.');
 * const article: WtfArticle = doc.json();
 */
export interface WtfArticle {
  title: string;
  pageID?: number;
  wikidata?: string;
  description?: string;
  categories?: string[];
  sections?: WtfArticleSection[];
  infoboxes?: WtfArticleInfobox[];
  references?: WtfArticleReference[];
  coordinates?: {
    lat: number;
    lon: number;
  };
  thumbnail?: import('../api/base').ImageThumbnail;
  // Additional properties that may be present
  [key: string]: unknown;
}

/**
 * Represents the wtf_wikipedia document with methods
 */
export interface WtfDocument {
  title: string;
  sections?: WtfArticleSection[];
  language?: string;
  categories?: string[];
  infoboxes?: WtfArticleInfobox[];
  references?: WtfArticleReference[];
  
  // Methods
  mainImage(): unknown;
  images(): {
    thumbnail(): string;
  }[];
  json(): WtfArticle;
}

/**
 * Represents extended wtf_wikipedia instance methods when plugins are used
 */
export interface WtfWithPlugins {
  fetch(title: string, options?: { lang?: string; "Api-User-Agent"?: string }): Promise<WtfDocument | null>;
  getRandomPage(options?: { lang?: string }): Promise<WtfDocument | null>;
  summary?(
    title: string,
    options?: { lang?: string }
  ): Promise<string | null>;
  classify?(
    title: string,
    options?: { lang?: string }
  ): Promise<{ type: string; score: number } | null>;
}
