import { useCallback, useContext } from 'react';

import { BookmarksContext } from '@/stores/BookmarksContext';
import { RecommendationItem } from '@/types/components';

/**
 * Shared hook for bookmark toggle functionality
 * Eliminates duplicate bookmark toggle logic across components
 * Gracefully handles missing context (e.g., in Portal outside provider tree)
 */
export default function useBookmarkToggle() {
  const bookmarksContext = useContext(BookmarksContext);

  const { addBookmark, removeBookmark, isBookmarked } = bookmarksContext || {
    addBookmark: () => Promise.resolve(),
    removeBookmark: () => Promise.resolve(),
    isBookmarked: () => false
  };

  const handleBookmarkToggle = useCallback(
    async (item: RecommendationItem) => {
      const bookmarked = isBookmarked(item.title);

      try {
        if (bookmarked) {
          await removeBookmark(item.title);
        } else {
          await addBookmark(item.title, item.thumbnail, item.description);
        }
      } catch {
        // Error handling is done by the context
      }
    },
    [addBookmark, removeBookmark, isBookmarked]
  );

  return {
    handleBookmarkToggle,
    isBookmarked
  };
}
