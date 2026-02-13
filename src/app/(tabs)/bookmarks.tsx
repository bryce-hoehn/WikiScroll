import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { View } from 'react-native';

import { SPACING } from '@/constants/spacing';
import BookmarkCard from '@/features/bookmarks/components/BookmarkCard';
import { useBookmarks } from '@/hooks';
import { Bookmark } from '@/types/bookmarks';

export default function BookmarksScreen() {
  const { bookmarks, removeBookmark } = useBookmarks();

  const handleRemoveBookmark = useCallback(
    async (title: string) => {
      // Store bookmark data for undo
      const bookmarkToDelete = bookmarks.find((b) => b.title === title);

      if (bookmarkToDelete) {
        await removeBookmark(title);
      }
    },
    [bookmarks, removeBookmark]
  );

  const renderBookmarkCard = useCallback(
    ({ item }: { item: Bookmark }) => {
      return (
        <View
          style={{
            marginBottom: SPACING.lg,
            alignSelf: 'center'
          }}
        >
          <BookmarkCard item={item} onRemoveBookmark={handleRemoveBookmark} />
        </View>
      );
    },
    [handleRemoveBookmark]
  );

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={bookmarks}
        renderItem={renderBookmarkCard}
        keyExtractor={(item: Bookmark, index: number) =>
          item?.title
            ? `${item.title}-${item.bookmarkedAt}`
            : `bookmark-${index}`
        }
        style={{ flex: 1 }}
        {...({ estimatedItemSize: 220 } as any)}
        contentContainerStyle={{
          paddingVertical: SPACING.sm,
          flexGrow: 1
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
