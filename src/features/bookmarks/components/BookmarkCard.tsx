import { useRouter } from 'expo-router';
import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';

import { TYPOGRAPHY } from '@/constants/typography';
import { useReadingProgress } from '@/hooks';
import { BookmarkCardProps } from '@/types/components';

import ResponsiveImage from '@/components/ui/media/ResponsiveImage';
import { BREAKPOINTS } from '@/constants/breakpoints';
import ReadingProgressIndicator from './ReadingProgressIndicator';

const BookmarkCard = React.memo(function BookmarkCard({
  item,
  onRemoveBookmark,
  selectionMode = false,
  isSelected = false,
  onToggleSelection,
  onLongPress,
  onEdit,
  onTagPress,
  onShowAllTags
}: BookmarkCardProps & {
  onEdit?: () => void;
  onLongPress?: () => void;
  onTagPress?: (tag: string) => void;
  onShowAllTags?: () => void;
}) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { getProgress } = useReadingProgress();
  const readingProgress = getProgress(item.title);

  // Determine if we're on a small screen (mobile)
  const isSmallScreen = width < BREAKPOINTS.lg;

  // Responsive dimensions for horizontal card layout
  // Increased height to accommodate tags, description, and progress bar
  const imageWidth = isSmallScreen ? 100 : 120;
  const cardHeight = isSmallScreen ? 160 : 180;

  const handleCardPress = () => {
    if (selectionMode && onToggleSelection) {
      onToggleSelection();
    } else {
      router.push(`/article/${encodeURIComponent(item.title)}`);
    }
  };

  return (
    <Card
      onPress={handleCardPress}
      style={{
        width: '100%',
        maxWidth: '100%',
        minHeight: cardHeight,
        borderRadius: theme.roundness * 3,
        borderWidth: selectionMode && isSelected ? 2 : 0,
        borderColor:
          selectionMode && isSelected ? theme.colors.primary : 'transparent',
        overflow: 'hidden'
      }}
    >
      <View style={{ flexDirection: 'row', height: cardHeight }}>
        {/* Selection Checkbox */}
        {selectionMode && (
          <View
            style={{
              position: 'absolute',
              top: 6,
              left: 6,
              zIndex: 10,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.roundness
            }}
          >
            <IconButton
              icon={isSelected ? 'check-circle' : 'circle-outline'}
              iconColor={
                isSelected
                  ? theme.colors.primary
                  : theme.colors.onSurfaceVariant
              }
              size={20}
              onPress={(e) => {
                e.stopPropagation();
                onToggleSelection?.();
              }}
              style={{ margin: 0 }}
            />
          </View>
        )}

        {/* Article Image - Left side */}
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
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                No Image
              </Text>
            </View>
          )}
        </View>

        {/* Article Content - Right side */}
        <Card.Content
          style={{
            flex: 1,
            padding: 24,
            justifyContent: 'space-between',
            height: cardHeight,
            minHeight: cardHeight
          }}
        >
          <View style={{ flex: 1, minHeight: 0, overflow: 'visible' }}>
            {/* Title and Actions */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 24
              }}
            >
              <Text
                variant={isSmallScreen ? 'titleSmall' : 'titleMedium'}
                style={{
                  lineHeight:
                    (isSmallScreen
                      ? TYPOGRAPHY.titleSmall
                      : TYPOGRAPHY.titleMedium) * TYPOGRAPHY.lineHeightNormal,
                  color: theme.colors.onSurface,
                  flex: 1,
                  marginRight: 24
                }}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              {!selectionMode && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    flexShrink: 0,
                    marginLeft: 24,
                    paddingTop: 24
                  }}
                >
                  {onEdit && (
                    <IconButton
                      icon="tag"
                      iconColor={theme.colors.onSurfaceVariant}
                      onPress={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                      style={{ margin: 0 }}
                      size={
                        isSmallScreen
                          ? TYPOGRAPHY.bodyMedium
                          : TYPOGRAPHY.bodyLarge
                      }
                      accessibilityLabel={`Edit tags for ${item.title}`}
                      accessibilityHint="Edit bookmark tags"
                    />
                  )}
                  <IconButton
                    icon="bookmark-off"
                    iconColor={theme.colors.error}
                    onPress={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(item.title);
                    }}
                    style={{ margin: 0 }}
                    size={
                      isSmallScreen
                        ? TYPOGRAPHY.bodyMedium
                        : TYPOGRAPHY.bodyLarge
                    }
                    accessibilityLabel={`Remove ${item.title} from bookmarks`}
                    accessibilityHint={`Removes this article from your bookmarks`}
                  />
                </View>
              )}
            </View>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 24,
                  marginBottom: 24,
                  marginTop: 24
                }}
              >
                {item.tags.slice(0, 2).map((tag) => (
                  <Chip
                    key={tag}
                    style={{
                      height: 28,
                      paddingHorizontal: 24,
                      paddingVertical: 0,
                      justifyContent: 'center'
                    }}
                    textStyle={{
                      lineHeight: TYPOGRAPHY.bodySmall
                    }}
                    mode="flat"
                    compact
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      onTagPress?.(tag);
                    }}
                    accessible={true}
                    accessibilityLabel={`Filter by tag: ${tag}`}
                    accessibilityHint="Filters bookmarks by this tag"
                  >
                    {tag}
                  </Chip>
                ))}
                {item.tags.length > 2 && (
                  <Chip
                    style={{
                      height: 28,
                      paddingHorizontal: 24,
                      paddingVertical: 0,
                      justifyContent: 'center'
                    }}
                    textStyle={{
                      lineHeight: TYPOGRAPHY.bodySmall
                    }}
                    mode="flat"
                    compact
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      onShowAllTags?.();
                    }}
                    accessible={true}
                    accessibilityLabel={`Show all ${item.tags.length} tags`}
                    accessibilityHint="Opens a modal showing all tags for this bookmark"
                  >
                    +{item.tags.length - 2}
                  </Chip>
                )}
              </View>
            )}

            {/* Summary */}
            <Text
              variant="bodySmall"
              style={{
                color: theme.colors.onSurfaceVariant,
                lineHeight: isSmallScreen ? 20 : 22,
                fontSize: isSmallScreen ? 12 : 13,
                marginTop: 4,
                marginBottom: readingProgress > 0 ? 8 : 0 // Add spacing before progress bar if it exists
              }}
              numberOfLines={isSmallScreen ? 2 : 3}
            >
              {item.summary || 'No summary available'}
            </Text>

            {/* Reading Progress Indicator */}
            {readingProgress > 0 && (
              <ReadingProgressIndicator readingProgress={readingProgress} />
            )}
          </View>
        </Card.Content>
      </View>
    </Card>
  );
});

export default BookmarkCard;
