import React, { useCallback } from 'react';
import { FlatList, Image } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

interface RecentArticlesListProps {
  recentVisitedArticles: any[];
  onSuggestionClick: (title: string) => void;
}

export default function RecentArticlesList({ 
  recentVisitedArticles, 
  onSuggestionClick 
}: RecentArticlesListProps) {
  const theme = useTheme();

  const renderRecentItem = useCallback(({ item }: { item: any }) => (
    <List.Item
      title={item.title}
      description={new Date(item.visitedAt).toLocaleDateString()}
      left={props => (
        item.article?.thumbnail?.source ? (
          <Image 
            source={{ uri: item.article.thumbnail.source }} 
            style={{ width: 40, height: 40, borderRadius: 4 }}
            resizeMode="cover"
          />
        ) : (
          <List.Icon {...props} icon="history" />
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
      Recently Viewed
    </Text>
  ), [theme]);

  return (
    <>
      {renderHeader()}
      <FlatList
        data={recentVisitedArticles}
        renderItem={renderRecentItem}
        keyExtractor={(item, index) => `recent-${index}`}
        contentContainerStyle={{ padding: 8 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </>
  );
}
