import { wtfWithPlugins } from '../shared';

export const fetchDescription = async (title: string): Promise<string | null> => {
  try {
    // Parse the HTML with wtf_wikipedia
    const doc = wtfWithPlugins(title) as any;
    if (!doc) return null;

    // Try summary plugin
    if (typeof doc.summary === 'function') {
      const summary = await doc.summary();
      if (summary) return summary;
    }

    // Fallback to classification plugin
    if (typeof doc.classify === 'function') {
      const classification = await doc.classify();
      if (classification?.type) {
        return `A ${classification.type.toLowerCase()}${
          classification.score > 0.7 ? ' (high confidence)' : ''
        }`;
      }
    }

    return null;
  } catch (error: any) {
    console.error(`Failed to fetch description for "${title}":`, error.response?.status, error.response?.data || error);
    return null;
  }
};
