import { FlashList, FlashListRef } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  Portal,
  Text,
  useTheme
} from 'react-native-paper';

import { fetchArticleSummaries } from '@/api';
import ResponsiveContainer from '@/components/ui/layout/ResponsiveContainer';
import { SPACING } from '@/constants/spacing';
import { RecommendationCard } from '@/features/article';
import {
  useBookmarkToggle,
  useReadingProgress,
  useVisitedArticles
} from '@/hooks';
import { RecommendationItem } from '@/types/components';

const ITEMS_PER_PAGE = 10;

export default function ReadingHistoryScreen() {
  const theme = useTheme();
  const { removeVisitedArticle, clearVisitedArticles, visitedArticles } =
    useVisitedArticles();
  const { clearAllProgress, getProgressData } = useReadingProgress();
  const { handleBookmarkToggle, isBookmarked } = useBookmarkToggle();
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const flashListRef = useRef<FlashListRef<RecommendationItem[]>>(null);

  const articleTitles = useMemo(
    () => visitedArticles.map((visited) => visited.title),
    [visitedArticles]
  );

  const sortedTitlesForKey = useMemo(
    () => [...articleTitles].sort().join('|'),
    [articleTitles]
  );

  const { data: summariesMap } = useQuery({
    queryKey: ['article-summaries-batch', sortedTitlesForKey],
    queryFn: () => fetchArticleSummaries(articleTitles),
    enabled: articleTitles.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });

  // Convert summaries to RecommendationItems, preserving order of visitedArticles
  const articleItems = useMemo(() => {
    if (!summariesMap) return [];

    return visitedArticles
      .map((visited) => {
        const article = summariesMap[visited.title];
        if (article) {
          return {
            title: article.title,
            displaytitle: article.displaytitle || article.title,
            description: article.description,
            extract: article.extract,
            thumbnail: article.thumbnail,
            pageid: article.pageid
          } as RecommendationItem;
        }
        return null;
      })
      .filter((item): item is RecommendationItem => item !== null);
  }, [summariesMap, visitedArticles]);

  // Create pages of 10 items each
  const pages = useMemo(() => {
    const result: RecommendationItem[][] = [];
    for (let i = 0; i < articleItems.length; i += ITEMS_PER_PAGE) {
      result.push(articleItems.slice(i, i + ITEMS_PER_PAGE));
    }
    return result;
  }, [articleItems]);

  // Scroll to page when currentPage changes externally
  useEffect(() => {
    if (flashListRef.current && currentPage !== undefined && pages.length > 0) {
      flashListRef.current.scrollToIndex({
        index: currentPage,
        animated: true
      });
    }
  }, [currentPage, pages.length]);

  const handleResetReadingHistory = () => {
    const isHistoryEmpty = visitedArticles.length === 0;
    if (isHistoryEmpty) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmClearHistory = async () => {
    setShowConfirmDialog(false);
    setIsResetting(true);
    try {
      const progressToRestore: Record<
        string,
        { progress: number; lastReadAt: string; expandedSections?: string[] }
      > = {};

      for (const article of visitedArticles) {
        const progressData = getProgressData(article.title);
        if (progressData) {
          progressToRestore[article.title] = progressData;
        }
      }

      await Promise.all([clearVisitedArticles(), clearAllProgress()]);
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('Failed to clear reading history:', error);
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleRemoveArticle = async (title: string) => {
    await removeVisitedArticle(title);
    if (
      pages.length > 0 &&
      currentPage >= pages.length - 1 &&
      currentPage > 0
    ) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPage = ({
    item: pageItems,
    index: pageIndex
  }: {
    item: RecommendationItem[];
    index: number;
  }) => (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingVertical: SPACING.sm,
        paddingBottom: SPACING.xl,
        alignItems: 'center',
        flexGrow: 1
      }}
      showsVerticalScrollIndicator={true}
    >
      {pageItems.map((articleItem, itemIndex) => (
        <View
          key={`${articleItem.title}-${itemIndex}`}
          style={{
            marginBottom: SPACING.sm,
            alignSelf: 'center'
          }}
        >
          <RecommendationCard
            item={articleItem}
            index={itemIndex}
            isBookmarked={isBookmarked}
            onBookmarkToggle={handleBookmarkToggle}
            onRemove={handleRemoveArticle}
          />
        </View>
      ))}
    </ScrollView>
  );

  return (
    <ResponsiveContainer>
      <ScrollView style={{ flex: 1 }}>
        {/* Clear History Section */}
        <List.Section>
          <List.Subheader>Manage History</List.Subheader>
          <View
            style={{
              paddingHorizontal: SPACING.sm,
              paddingBottom: SPACING.sm
            }}
          >
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                marginBottom: 8,
                lineHeight: 18
              }}
            >
              Permanently delete all reading history and reading progress. This
              will also affect your personalized &quot;For You&quot;
              recommendations.
            </Text>
            <Button
              mode="outlined"
              onPress={handleResetReadingHistory}
              disabled={isResetting || visitedArticles.length === 0}
              loading={isResetting}
              icon="delete-outline"
              textColor={theme.colors.error}
              style={{ marginTop: 8 }}
            >
              {isResetting ? 'Clearing...' : 'Clear History'}
            </Button>
          </View>
        </List.Section>

        <Divider style={{ marginVertical: 8 }} />

        {visitedArticles.length > 0 ? (
          <>
            <View
              style={{
                height: 780
              }}
            >
              <FlashList
                ref={flashListRef}
                data={pages}
                renderItem={renderPage}
                keyExtractor={(_, index) => `page-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                pagingEnabled
                contentContainerStyle={{
                  backgroundColor: theme.colors.background
                }}
                style={{ backgroundColor: theme.colors.background, flex: 1 }}
                ListEmptyComponent={
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: SPACING.sm
                    }}
                  >
                    <Text
                      variant="bodyMedium"
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        textAlign: 'center'
                      }}
                    >
                      Loading articles...
                    </Text>
                  </View>
                }
              />
            </View>

            {/* Page indicators and navigation controls */}
            {pages.length > 1 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: SPACING.sm,
                  gap: SPACING.md
                }}
              >
                <IconButton
                  icon="chevron-left"
                  iconColor={
                    currentPage === 0
                      ? theme.colors.onSurfaceDisabled
                      : theme.colors.onSurfaceVariant
                  }
                  size={24}
                  onPress={() => {
                    if (currentPage > 0) {
                      const newPage = currentPage - 1;
                      setCurrentPage(newPage);
                      flashListRef.current?.scrollToIndex({
                        index: newPage,
                        animated: true
                      });
                    }
                  }}
                  disabled={currentPage === 0}
                  accessibilityLabel="Previous page"
                  accessibilityHint="Navigate to the previous page of articles"
                />

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {pages.map((_, index) => (
                    <View
                      key={index}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: theme.roundness * 1,
                        backgroundColor:
                          index === currentPage
                            ? theme.colors.primary
                            : theme.colors.surfaceVariant
                      }}
                    />
                  ))}
                </View>

                <IconButton
                  icon="chevron-right"
                  iconColor={
                    currentPage === pages.length - 1
                      ? theme.colors.onSurfaceDisabled
                      : theme.colors.onSurfaceVariant
                  }
                  size={24}
                  onPress={() => {
                    if (currentPage < pages.length - 1) {
                      const newPage = currentPage + 1;
                      setCurrentPage(newPage);
                      flashListRef.current?.scrollToIndex({
                        index: newPage,
                        animated: true
                      });
                    }
                  }}
                  disabled={currentPage === pages.length - 1}
                  accessibilityLabel="Next page"
                  accessibilityHint="Navigate to the next page of articles"
                />
              </View>
            )}
          </>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: SPACING.sm,
              minHeight: 400
            }}
          >
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                textAlign: 'center'
              }}
            >
              No reading history yet
            </Text>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Dialog
          visible={showConfirmDialog}
          onDismiss={() => setShowConfirmDialog(false)}
          style={{
            alignSelf: 'center',
            marginHorizontal: SPACING.sm
          }}
        >
          <Dialog.Title>Reset Reading History</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to clear your reading history and reading
              progress? This action cannot be undone and will affect your
              personalized recommendations.
            </Text>
            {visitedArticles.length > 0 && (
              <Text
                variant="bodySmall"
                style={{
                  marginTop: 8,
                  color: theme.colors.onSurfaceVariant
                }}
              >
                This will delete {visitedArticles.length} article
                {visitedArticles.length !== 1 ? 's' : ''} from your history.
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="outlined" onPress={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={confirmClearHistory}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
            >
              Reset
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ResponsiveContainer>
  );
}
