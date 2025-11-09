import type { DataNode, Element } from 'domhandler';
import { parseDocument } from 'htmlparser2';

/**
 * Simple utility to extract wikipedia-link spans from HTML
 * Returns an array of article titles found in wikipedia-link spans
 */
export function extractWikipediaLinks(html: string): string[] {
  if (!html) return [];
  
  try {
    const doc = parseDocument(html);
    const links: string[] = [];
    
    function traverse(nodes: (Element | DataNode)[]) {
      for (const node of nodes) {
        // Check if this is a span with wikipedia-link class
        if (node.type === 'tag' && (node as Element).name === 'span' || (node as Element).name === 'a') {
          const element = node as Element;
          if (element.attribs?.class === 'wikipedia-link' || element.attribs?.rel?.toLowerCase() === "mw:wikilink") {
            // Extract text content from the element
            let title = '';
            
            // Try to get title from attribute first
            if (element.attribs?.title) {
              title = element.attribs.title;
            } else {
              // Extract text content from children
              const textNodes = element.children?.filter(child => child.type === 'text');
              if (textNodes && textNodes.length > 0) {
                title = textNodes.map(textNode => (textNode as any).data).join('').trim();
              }
            }
            
            if (title) {
              links.push(title);
            }
          }
        }
        
        // Recursively traverse children
        if ('children' in node && node.children && Array.isArray(node.children)) {
          traverse(node.children as (Element | DataNode)[]);
        }
      }
    }
    
    traverse(doc.children as (Element | DataNode)[]);
    return links;
  } catch (error) {
    console.error('Error extracting wikipedia links:', error);
    return [];
  }
}
