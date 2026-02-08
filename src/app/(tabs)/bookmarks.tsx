import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

import { SPACING } from '@/constants/spacing';
import BookmarkCard from '@/features/bookmarks/components/BookmarkCard';
import { useBookmarks } from '@/hooks';
import { Bookmark } from '@/types/bookmarks';

export default function BookmarksScreen() {
  const theme = useTheme();
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
    <>
      <Appbar.Header
        style={{ backgroundColor: theme.colors.surface }}
        mode="center-aligned"
      >
        <Appbar.Content
          title={`Bookmarks (${bookmarks.length})`}
          titleStyle={{
            // MD3: Center-aligned app bars use 22sp title
            // Reference: https://m3.material.io/components/app-bars/overview
            fontWeight: '500', // MD3: Medium weight (500) for app bar titles
            fontSize: 22, // 22sp per MD3 specification
            color: theme.colors.onSurface,
            textAlign: 'center'
          }}
        />
      </Appbar.Header>
      <FlashList
        data={bookmarks}
        renderItem={renderBookmarkCard}
        keyExtractor={(item: Bookmark, index: number) =>
          item?.title
            ? `${item.title}-${item.bookmarkedAt}`
            : `bookmark-${index}`
        }
        {...({ estimatedItemSize: 220 } as any)}
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          paddingVertical: SPACING.base,
          flexGrow: 1
        }}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}
