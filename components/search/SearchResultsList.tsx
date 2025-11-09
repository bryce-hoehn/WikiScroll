import { Image } from 'expo-image';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { SearchSuggestion } from '../../types';

interface SearchResultsListProps {
  suggestions: SearchSuggestion[];
  onSuggestionClick: (title: string) => void;
}

export default function SearchResultsList({ 
  suggestions, 
  onSuggestionClick 
}: SearchResultsListProps) {
  const theme = useTheme();

  const renderSuggestionItem = useCallback(({ item }: { item: SearchSuggestion }) => (
    <List.Item
      title={item.title}
      description={item.description}
      left={props => (
        item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={{ width: 40, height: 40, borderRadius: 4 }}
            contentFit="cover"
            onError={() => console.log('Failed to load image for:', item.title)}
          />
        ) : (
          <List.Icon {...props} icon="file-document-outline" />
        )
      )}
      onPress={() => onSuggestionClick(item.title)}
    />
  ), [onSuggestionClick]);

  const renderHeader = useCallback(() => (
    <Text 
      variant="titleMedium" 
      style={{ 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        color: theme.colors.onSurfaceVariant,
        fontWeight: '600',
        backgroundColor: theme.colors.surfaceVariant,
        marginBottom: 4
      }}
    >
      Search Results
    </Text>
  ), [theme]);

  return (
    <>
      {renderHeader()}
      <FlatList
        data={suggestions}
        renderItem={renderSuggestionItem}
        keyExtractor={(item, index) => `suggestion-${index}`}
        contentContainerStyle={{ padding: 8 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </>
  );
}
