import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Chip, IconButton, useTheme } from 'react-native-paper';
import { SPACING } from '../../constants/spacing';
import { TYPOGRAPHY } from '../../constants/typography';
import { Bookmark } from '../../types/bookmarks';

interface BookmarkTagFilterProps {
  bookmarks: Bookmark[];
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
}

export default function BookmarkTagFilter({
  bookmarks,
  selectedTag,
  onTagChange,
}: BookmarkTagFilterProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);

  // Extract unique tags from all bookmarks
  const tags = React.useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach((bookmark) => {
      if (bookmark.tags && bookmark.tags.length > 0) {
        bookmark.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [bookmarks]);

  // Count bookmarks with each tag
  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    tags.forEach((tag) => {
      counts[tag] = bookmarks.filter((b) => b.tags?.includes(tag)).length;
    });
    return counts;
  }, [bookmarks, tags]);

  // Prepare data with "All Tags" option
  const tagData = React.useMemo(() => {
    return [
      { tag: null, label: 'All Tags', count: bookmarks.length },
      ...tags.map((tag) => ({ tag, label: tag, count: tagCounts[tag] })),
    ];
  }, [tags, tagCounts, bookmarks.length]);

  // Calculate pagination for all platforms
  // Estimate available width: screen width minus padding
  const containerPadding = SPACING.md * 2; // 12px on each side = 24px total
  const chipGap = SPACING.xs; // 4px gap between chips
  // Use a conservative estimate to account for variable chip widths (tag names + counts)
  // Chips can be 80-140px wide depending on content, so we use 110px as a safe average
  const estimatedChipWidth = 110;
  const availableWidth = width - containerPadding;
  
  // Calculate tags per page accounting for gaps between chips
  // Formula: availableWidth = (n * chipWidth) + ((n - 1) * gap)
  // Solving for n: n = (availableWidth + gap) / (chipWidth + gap)
  const tagsPerPage = Math.max(1, Math.floor((availableWidth + chipGap) / (estimatedChipWidth + chipGap)));
  
  const totalPages = Math.ceil(tagData.length / tagsPerPage);
  const startIndex = currentPage * tagsPerPage;
  const endIndex = startIndex + tagsPerPage;
  const displayedTags = tagData.slice(startIndex, endIndex);

  // Reset to first page when tagData changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [tagData.length]);

  if (tags.length === 0) {
    return null; // Don't show tag filter if no tags exist
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.tagsRow}>
        {displayedTags.map((item) => (
          <Chip
            key={item.tag || 'all'}
            selected={selectedTag === item.tag}
            onPress={() => onTagChange(item.tag)}
            style={styles.chip}
            textStyle={styles.chipText}
            mode="flat"
            compact
          >
            {item.label} ({item.count})
          </Chip>
        ))}
      </View>
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <IconButton
            icon="chevron-left"
            iconColor={theme.colors.onSurfaceVariant}
            size={24}
            onPress={() => {
              // Loop pagination: go to last page if on first page
              setCurrentPage(currentPage === 0 ? totalPages - 1 : currentPage - 1);
            }}
            accessibilityLabel="Previous page"
            accessibilityHint="Navigate to the previous page of tags"
          />
          <View style={styles.pageIndicators}>
            {Array.from({ length: totalPages }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.pageIndicator,
                  {
                    backgroundColor:
                      currentPage === index
                        ? theme.colors.primary
                        : theme.colors.surfaceVariant,
                  },
                ]}
              />
            ))}
          </View>
          <IconButton
            icon="chevron-right"
            iconColor={theme.colors.onSurfaceVariant}
            size={24}
            onPress={() => {
              // Loop pagination: go to first page if on last page
              setCurrentPage(currentPage === totalPages - 1 ? 0 : currentPage + 1);
            }}
            accessibilityLabel="Next page"
            accessibilityHint="Navigate to the next page of tags"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    height: 32, // MD3: Filter chips are 32dp height
    marginBottom: SPACING.xs,
  },
  chipText: {
    fontSize: TYPOGRAPHY.bodyMedium,
    lineHeight: TYPOGRAPHY.bodyMedium * 1.2,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  pageIndicators: {
    flexDirection: 'row',
    gap: SPACING.xs + 2, // 6dp gap between indicators
    alignItems: 'center',
  },
  pageIndicator: {
    width: 8, // MD3: 8dp width for better touch target
    height: 8, // MD3: 8dp height
    borderRadius: 4, // Circular indicator
  },
});
