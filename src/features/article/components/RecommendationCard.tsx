import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Animated, Platform, Pressable, View } from 'react-native';
import {
  Card,
  Icon,
  IconButton,
  Menu,
  ProgressBar,
  Text,
  TouchableRipple,
  useTheme
} from 'react-native-paper';

import { SPACING } from '@/constants/spacing';
import { TYPOGRAPHY } from '@/constants/typography';
import { useReadingProgress, useVisitedArticles } from '@/hooks';
import { RecommendationCardProps } from '@/types/components';
import { copyArticleUrl, shareArticle } from '@/utils/shareUtils';

import ResponsiveImage from '@/components/ui/media/ResponsiveImage';
import useMediaQuery from '@/hooks/useMediaQuery';

const RecommendationCard = React.memo(function RecommendationCard({
  item,
  index,
  isBookmarked,
  onBookmarkToggle,
  onRemove
}: RecommendationCardProps) {
  const theme = useTheme();
  const { visitedArticles } = useVisitedArticles();
  const { getProgress } = useReadingProgress();
  const [isPressed, setIsPressed] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);

  const isVisited = useMemo(
    () => visitedArticles.some((visited) => visited.title === item.title),
    [visitedArticles, item.title]
  );

  const isBookmarkedArticle = isBookmarked(item.title);
  const readingProgress = isBookmarkedArticle ? getProgress(item.title) : 0;

  const windowSize = useMediaQuery();

  let isSmallScreen: boolean = false;

  if (windowSize === 'compact') {
    isSmallScreen = true;
  }

  const handleShare = async (e: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    try {
      await shareArticle(item.title, item.description);
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('Failed to share article:', error);
      }
    }
  };

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    if (!contextMenuVisible) {
      router.push(`/article/${encodeURIComponent(item.title)}`);
    }
  };

  const handleLongPress = () => {
    setContextMenuVisible(true);
  };

  const handleContextMenu = (e: any) => {
    if (Platform.OS === 'web') {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      setContextMenuVisible(true);
    }
  };

  const handleOpenArticle = () => {
    setContextMenuVisible(false);
    router.push(`/article/${encodeURIComponent(item.title)}`);
  };

  const handleContextBookmark = () => {
    setContextMenuVisible(false);
    onBookmarkToggle(item);
  };

  const handleContextShare = async () => {
    setContextMenuVisible(false);
    try {
      await shareArticle(item.title, item.description);
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('Failed to share article:', error);
      }
    }
  };

  const handleContextCopy = async () => {
    setContextMenuVisible(false);
    try {
      await copyArticleUrl(item.title);
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error('Failed to copy article URL:', error);
      }
    }
  };

  const imageWidth = 140;
  const cardHeight = 140;

  return (
    <Animated.View
      style={{
        width: '100%'
      }}
    >
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={`Open recommended article: ${item.title}`}
        accessibilityHint={`Opens the recommended article: ${item.title}. Long press for more options.`}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: '100%',
            borderRadius: theme.roundness * 3,
            overflow: 'hidden'
          }}
        >
          <View style={{ flexDirection: 'row', height: cardHeight }}>
            <View
              style={{
                width: imageWidth,
                height: cardHeight,
                backgroundColor: theme.colors.surfaceVariant,
                position: 'relative'
              }}
            >
              {item.thumbnail ? (
                <ResponsiveImage
                  source={{
                    source: item.thumbnail.source,
                    width: item.thumbnail.width || imageWidth,
                    height: item.thumbnail.height || cardHeight
                  }}
                  contentFit="cover"
                  style={{
                    width: imageWidth,
                    height: cardHeight
                  }}
                  alt={`Thumbnail for ${item.title}`}
                  skipOptimization={true} // Use default thumbnail without optimization
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    No Image
                  </Text>
                </View>
              )}
              {isVisited && (
                <View
                  style={{
                    position: 'absolute',
                    top: SPACING.sm,
                    right: SPACING.sm,
                    backgroundColor: theme.colors.primaryContainer,
                    borderRadius: theme.roundness * 2,
                    paddingHorizontal: SPACING.sm,
                    paddingVertical: SPACING.sm,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SPACING.sm
                  }}
                >
                  <IconButton
                    icon="check-circle"
                    iconColor={theme.colors.onPrimaryContainer}
                    size={TYPOGRAPHY.bodySmall}
                    style={{ margin: 0 }}
                  />
                  <Text
                    variant="labelSmall"
                    style={{ color: theme.colors.onPrimaryContainer }}
                  >
                    Visited
                  </Text>
                </View>
              )}
            </View>

            {/* Article Content - Right side */}
            <Card.Content
              style={{
                flex: 1,
                padding: SPACING.sm,
                paddingBottom: SPACING.sm,
                justifyContent: 'space-between',
                height: cardHeight
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: SPACING.sm
                  }}
                >
                  <Text
                    variant={isSmallScreen ? 'titleSmall' : 'titleMedium'}
                    style={{
                      lineHeight:
                        (isSmallScreen
                          ? TYPOGRAPHY.titleSmall
                          : TYPOGRAPHY.titleMedium) *
                        TYPOGRAPHY.lineHeightNormal,
                      color: theme.colors.onSurface,
                      flex: 1,
                      marginRight: SPACING.sm
                    }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton
                      icon="share-variant"
                      iconColor={theme.colors.onSurfaceVariant}
                      onPress={handleShare}
                      style={{ margin: 0 }}
                      size={
                        isSmallScreen
                          ? TYPOGRAPHY.bodyMedium
                          : TYPOGRAPHY.bodyLarge
                      }
                      accessibilityLabel={`Share ${item.title}`}
                      accessibilityHint="Shares this article with others"
                    />
                    <IconButton
                      icon={
                        isBookmarked(item.title)
                          ? 'bookmark'
                          : 'bookmark-outline'
                      }
                      iconColor={
                        isBookmarked(item.title)
                          ? theme.colors.primary
                          : theme.colors.onSurfaceVariant
                      }
                      onPress={(e) => {
                        if (e && typeof e.stopPropagation === 'function') {
                          e.stopPropagation();
                        }
                        onBookmarkToggle(item);
                      }}
                      style={{ margin: 0 }}
                      size={
                        isSmallScreen
                          ? TYPOGRAPHY.bodyMedium
                          : TYPOGRAPHY.bodyLarge
                      }
                      accessibilityLabel={
                        isBookmarked(item.title)
                          ? `Remove ${item.title} from bookmarks`
                          : `Add ${item.title} to bookmarks`
                      }
                      accessibilityHint={
                        isBookmarked(item.title)
                          ? 'Removes article from bookmarks'
                          : 'Adds article to bookmarks'
                      }
                    />
                    {onRemove && (
                      <TouchableRipple
                        onPress={(e) => {
                          if (e && typeof e.stopPropagation === 'function') {
                            e.stopPropagation();
                          }
                          onRemove(item.title);
                        }}
                        style={{
                          margin: 0,
                          padding: SPACING.sm,
                          borderRadius: theme.roundness * 2
                        }}
                        accessibilityLabel={`Remove ${item.title} from history`}
                        accessibilityHint="Removes this article from your reading history"
                        accessibilityRole="button"
                      >
                        <Icon
                          source="delete-outline"
                          size={
                            isSmallScreen
                              ? TYPOGRAPHY.bodyMedium
                              : TYPOGRAPHY.bodyLarge
                          }
                          color={theme.colors.error}
                        />
                      </TouchableRipple>
                    )}
                  </View>
                </View>

                {isBookmarkedArticle && readingProgress > 0 && (
                  <View style={{ marginBottom: SPACING.sm }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: SPACING.sm
                      }}
                    >
                      <Text
                        variant="labelSmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        Reading progress
                      </Text>
                      <Text
                        variant="labelSmall"
                        style={{ color: theme.colors.primary }}
                      >
                        {readingProgress}%
                      </Text>
                    </View>
                    <ProgressBar
                      progress={readingProgress / 100}
                      color={theme.colors.primary}
                      style={{
                        height: SPACING.sm,
                        borderRadius: theme.roundness * 0.5
                      }}
                    />
                  </View>
                )}

                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    lineHeight:
                      (isSmallScreen
                        ? TYPOGRAPHY.bodyMedium
                        : TYPOGRAPHY.bodyLarge) * TYPOGRAPHY.lineHeightNormal,
                    fontSize: isSmallScreen
                      ? TYPOGRAPHY.bodyMedium
                      : TYPOGRAPHY.bodyLarge,
                    marginBottom: SPACING.sm
                  }}
                  numberOfLines={2}
                >
                  {isSmallScreen
                    ? item.description || item.extract || 'No summary available'
                    : item.extract ||
                      item.description ||
                      'No summary available'}
                </Text>
              </View>
            </Card.Content>
          </View>
        </Card>
      </Pressable>

      {/* Long-press Context Menu */}
      <Menu
        visible={contextMenuVisible}
        onDismiss={() => setContextMenuVisible(false)}
        anchor={
          <View style={{ position: 'absolute', left: -1000, top: -1000 }} />
        }
        contentStyle={{ backgroundColor: theme.colors.surface }}
      >
        <Menu.Item
          onPress={handleOpenArticle}
          leadingIcon="open-in-new"
          title="Open Article"
        />
        <Menu.Item
          onPress={handleContextBookmark}
          leadingIcon={
            isBookmarked(item.title) ? 'bookmark' : 'bookmark-outline'
          }
          title={isBookmarked(item.title) ? 'Remove Bookmark' : 'Add Bookmark'}
        />
        <Menu.Item
          onPress={handleContextCopy}
          leadingIcon="content-copy"
          title="Copy Link"
        />
        <Menu.Item
          onPress={handleContextShare}
          leadingIcon="share-variant"
          title="Share"
        />
      </Menu>
    </Animated.View>
  );
});

export default RecommendationCard;
