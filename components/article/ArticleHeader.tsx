import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

interface ArticleHeaderProps {
  title?: string;
  isBookmarked: (title: string) => boolean;
  onBookmarkToggle: () => void;
  onSearchPress: () => void;
  onBackPress: () => void;
  onToggleRenderer?: () => void;
  useCustomParser?: boolean;
  onShare?: () => void;
}

export default function ArticleHeader({
  title,
  isBookmarked,
  onBookmarkToggle,
  onSearchPress,
  onBackPress,
  onToggleRenderer,
  useCustomParser = false,
  onShare
}: ArticleHeaderProps) {
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
      <Appbar.BackAction
        onPress={onBackPress}
        accessibilityLabel="Go back"
        accessibilityHint="Returns to previous screen"
      />
      <Appbar.Content
        title={title || ''}
        titleStyle={{
          fontWeight: '600',
          fontSize: 18
        }}
        accessibilityLabel={`Article: ${title || ''}`}
        accessibilityRole="header"
      />

      {onShare && (
        <Appbar.Action
          icon="share-variant"
          onPress={onShare}
          accessibilityLabel="Share article"
          accessibilityHint="Shares this article with others"
        />
      )}
      <Appbar.Action
        icon={title && isBookmarked(title) ? "bookmark" : "bookmark-outline"}
        iconColor={title && isBookmarked(title) ? theme.colors.primary : theme.colors.onSurfaceVariant}
        onPress={onBookmarkToggle}
        accessibilityLabel={title && isBookmarked(title) ? "Remove bookmark" : "Add bookmark"}
        accessibilityHint={title && isBookmarked(title) ? "Removes article from bookmarks" : "Adds article to bookmarks"}
      />
    </Appbar.Header>
  );
}
