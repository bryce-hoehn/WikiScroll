import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';

interface ArticleHeaderProps {
  title?: string;
  isBookmarked: (title: string) => boolean;
  onBookmarkToggle: () => void;
  onSearchPress: () => void;
  onBackPress: () => void;
}

export default function ArticleHeader({ 
  title, 
  isBookmarked, 
  onBookmarkToggle, 
  onSearchPress, 
  onBackPress 
}: ArticleHeaderProps) {
  const theme = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
      <Appbar.BackAction onPress={onBackPress} />
      <Appbar.Content 
        title={title || ''} 
        titleStyle={{ 
          fontWeight: '600',
          fontSize: 18
        }}
      />
      <Appbar.Action icon="magnify" onPress={onSearchPress} />
      <Appbar.Action 
        icon={isBookmarked(title || '') ? "bookmark" : "bookmark-outline"}
        iconColor={isBookmarked(title || '') ? theme.colors.primary : theme.colors.onSurfaceVariant}
        onPress={onBookmarkToggle}
      />
    </Appbar.Header>
  );
}
