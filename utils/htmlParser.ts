import type { DataNode, Element } from 'domhandler';
import { parseDocument } from 'htmlparser2';

export interface ParseHtmlResult {
  elements: (Element | DataNode)[];
  error: string | null;
}

/**
 * Function that parses HTML content and returns the raw element structure
 * This can be used to get the parsed elements for custom rendering or analysis
 */
export function parseHtml(html: string): ParseHtmlResult {
  if (!html) {
    return { elements: [], error: null };
  }

  try {
    const doc = parseDocument(html);
    return { elements: doc.children as (Element | DataNode)[], error: null };
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return { 
      elements: [], 
      error: error instanceof Error ? error.message : 'Unknown parsing error' 
    };
  }
}
