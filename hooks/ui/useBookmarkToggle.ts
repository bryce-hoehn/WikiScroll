import { useCallback } from 'react';
import { useBookmarks } from '../../context/BookmarksContext';
import { RecommendationItem } from '../../types/components';

/**
 * Shared hook for bookmark toggle functionality
 * Eliminates duplicate bookmark toggle logic across components
 */
export default function useBookmarkToggle() {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const handleBookmarkToggle = useCallback(async (item: RecommendationItem) => {
    const bookmarked = isBookmarked(item.title);
    
    if (bookmarked) {
      await removeBookmark(item.title);
    } else {
      await addBookmark(item.title, item.thumbnail, item.description);
    }
  }, [addBookmark, removeBookmark, isBookmarked]);

  return {
    handleBookmarkToggle,
    isBookmarked,
  };
}