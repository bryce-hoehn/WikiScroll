import BookmarkCard from '@/components/bookmarks/BookmarkCard';
import BookmarksEmptyState from '@/components/bookmarks/BookmarksEmptyState';
import { useBookmarks } from '@/hooks';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

const CARD_MARGIN = 16;

export default function BookmarksScreen() {
  const theme = useTheme();
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();

  const handleRemoveBookmark = useCallback(async (title: string) => {
    await removeBookmark(title);
  }, [removeBookmark]);

  const handleClearAllBookmarks = useCallback(() => {
    if (bookmarks.length === 0) return;
    
    // Web-compatible alert using window.confirm
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm('Are you sure you want to clear all your bookmarks? This action cannot be undone.');
      if (confirmed) {
        clearBookmarks();
      }
    } else {
      // Native alert for mobile
      Alert.alert(
        'Clear All Bookmarks',
        'Are you sure you want to clear all your bookmarks? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Clear All',
            style: 'destructive',
            onPress: () => clearBookmarks(),
          },
        ]
      );
    }
  }, [bookmarks.length, clearBookmarks]);

  const renderBookmarkCard = useCallback(({ item }: { item: any }) => (
    <BookmarkCard
      item={item}
      onRemoveBookmark={handleRemoveBookmark}
    />
  ), [handleRemoveBookmark]);

  const renderEmptyState = useCallback(() => (
    <BookmarksEmptyState />
  ), []);

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.surface,
        }}
        mode='center-aligned'
      >
        <Appbar.Content
          title={`Bookmarks (${bookmarks.length})`}
          titleStyle={{
            fontWeight: '700',
            fontSize: 20,
            color: theme.colors.onSurface,
          }}
        />
        {bookmarks.length > 0 && (
          <Appbar.Action
            icon="delete-sweep"
            color={theme.colors.error}
            onPress={handleClearAllBookmarks}
          />
        )}
      </Appbar.Header>

      <FlashList
        data={bookmarks}
        renderItem={renderBookmarkCard}
        keyExtractor={(item) => item.title + item.bookmarkedAt}
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          paddingVertical: CARD_MARGIN,
          paddingHorizontal: CARD_MARGIN,
          flexGrow: 1,
          ...(bookmarks.length === 0 && { justifyContent: 'center' })
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </>
  );
}
