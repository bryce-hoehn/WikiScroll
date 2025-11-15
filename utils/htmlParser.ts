import { parseDocument } from 'htmlparser2';

export interface ParseHtmlResult {
  elements: any[];
  error: string | null;
}

/**
 * Parse HTML content and return the element structure
 */
export function parseHtml(html: string): ParseHtmlResult {
  if (!html || typeof html !== 'string') {
    return { elements: [], error: 'Invalid HTML input' };
  }

  try {
    const doc = parseDocument(html);
    
    return { elements: [doc], error: null };
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return {
      elements: [],
      error: error instanceof Error ? error.message : 'Unknown parsing error'
    };
  }
}