import React from 'react';
import { Platform, View } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

interface BookmarkSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function BookmarkSearchBar({
  searchQuery,
  onSearchChange
}: BookmarkSearchBarProps) {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Searchbar
        placeholder="Search bookmarks..."
        onChangeText={onSearchChange}
        value={searchQuery}
        mode="bar"
        style={{
          elevation: Platform.select({ android: 2, ios: 0, web: 2 }),
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: theme.roundness * 3,
          minHeight: 56,
          height: 56
        }}
        iconColor={theme.colors.onSurfaceVariant}
        accessibilityLabel="Search bookmarks"
        accessibilityRole="search"
        accessibilityHint={
          searchQuery && searchQuery.length > 0
            ? `Searching for "${searchQuery}". Results will filter as you type.`
            : 'Enter search terms to filter your bookmarks'
        }
      />
    </View>
  );
}
