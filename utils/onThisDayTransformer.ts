/**
 * Utility functions for transforming "On This Day" data
 * Extracts complex data transformation logic from SearchScreen
 */

import { OnThisDayItem } from '../types/api/featured';

interface TransformedOnThisDayItem extends OnThisDayItem {
  text: string;
}

/**
 * Transform On This Day facts by replacing normalized titles with display titles
 */
export function transformOnThisDayFacts(onThisDayData: OnThisDayItem[]): TransformedOnThisDayItem[] {
  if (!onThisDayData || !Array.isArray(onThisDayData)) {
    return [];
  }

  return onThisDayData.map((fact: OnThisDayItem) => {
    // Make a shallow copy to avoid mutating original data
    const newFact: TransformedOnThisDayItem = { ...fact, text: fact.text };
    
    if (fact.pages) {
      fact.pages.forEach((page) => {
        if (page.normalizedtitle && page.displaytitle) {
          newFact.text = newFact.text.replace(page.normalizedtitle, page.displaytitle);
        }
      });
    }
    
    return newFact;
  });
}