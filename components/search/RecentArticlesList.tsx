import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { List, Text, useTheme } from 'react-native-paper';
import { VisitedArticleItem } from '../../types/api';
import { Image } from "expo-image";

interface RecentArticlesListProps {
  recentVisitedArticles: VisitedArticleItem[];
  onSuggestionClick: (title: string) => void;
}

export default function RecentArticlesList({
  recentVisitedArticles,
  onSuggestionClick
}: RecentArticlesListProps) {
  const theme = useTheme();

  const renderRecentItem = useCallback(({ item }: { item: VisitedArticleItem }) => (
    <List.Item
      title={item.title}
      description={new Date(item.visitedAt).toLocaleDateString()}
      left={props => (
        item.article?.thumbnail?.source ? (
          <Image
            source={{ uri: item.article.thumbnail.source }}
            style={{ width: 40, height: 40, borderRadius: 4 }}
            contentFit="cover"
            alt={`Thumbnail for ${item.title}`}
            accessibilityLabel={`Thumbnail for ${item.title}`}
          />
        ) : (
          <List.Icon {...props} icon="history" />
        )
      )}
      onPress={() => onSuggestionClick(item.title)}
      accessibilityLabel={`Open recently viewed article: ${item.title}`}
      accessibilityHint={`Opens the recently viewed article: ${item.title}`}
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
      <FlashList
        data={recentVisitedArticles}
        renderItem={renderRecentItem}
        keyExtractor={(item) => `recent-${item.title}-${item.visitedAt}`}
        contentContainerStyle={{ padding: 8 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </>
  );
}
