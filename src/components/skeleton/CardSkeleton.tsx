import React from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { LAYOUT } from '@/constants/layout';
import { SPACING } from '@/constants/spacing';

interface CardSkeletonProps {
  index?: number;
}

/**
 * Skeleton loader component that matches RecommendationCard layout
 * Provides smooth shimmer animation for better loading experience
 */
export default function CardSkeleton({ index = 0 }: CardSkeletonProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  // Determine if we're on a small screen (mobile)
  const isSmallScreen = width < LAYOUT.TABLET_BREAKPOINT;

  const SkeletonBox = ({
    width,
    height,
    borderRadius = undefined, // Will use theme.roundness if not provided
    style
  }: {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: React.ComponentProps<typeof View>['style'];
  }) => {
    const baseStyle: React.ComponentProps<typeof View>['style'] = {
      width: width as React.ComponentProps<typeof View>['style'] extends {
        width?: infer W;
      }
        ? W
        : never,
      height,
      borderRadius: borderRadius ?? theme.roundness, // Use theme roundness as default
      backgroundColor: theme.colors.surfaceVariant,
      overflow: 'hidden'
    };

    return (
      <View style={style ? [baseStyle, style] : baseStyle}>
        <Animated.View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: theme.colors.elevation.level2
          }}
        />
      </View>
    );
  };

  // Responsive dimensions to match horizontal RecommendationCard
  const imageWidth = isSmallScreen ? 100 : 140;
  const cardHeight = isSmallScreen ? 120 : 140;

  return (
    <Animated.View
      style={{
        marginBottom: SPACING.sm
      }}
    >
      <View
        style={{
          borderRadius: theme.roundness, // Use theme roundness
          backgroundColor: theme.colors.elevation.level2,
          // No border - MD3 recommends using elevation for depth instead of borders
          // For skeleton loaders, we rely on background color contrast
          overflow: 'hidden'
          // Note: View components don't support elevation prop, but skeleton loaders
          // don't need elevation since they're temporary loading states
        }}
      >
        <View style={{ flexDirection: 'row', height: cardHeight }}>
          {/* Image skeleton - Left side */}
          <SkeletonBox
            width={imageWidth}
            height={cardHeight}
            borderRadius={0}
          />

          {/* Content skeleton - Right side */}
          <View
            style={{
              flex: 1,
              padding: isSmallScreen ? SPACING.md : SPACING.sm,
              justifyContent: 'space-between'
            }}
          >
            {/* Title and buttons skeleton */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: isSmallScreen ? 6 : SPACING.sm
              }}
            >
              <SkeletonBox
                width="70%"
                height={isSmallScreen ? 16 : 20}
                style={{ marginRight: SPACING.sm }}
              />
              <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
                <SkeletonBox
                  width={isSmallScreen ? 28 : 32}
                  height={isSmallScreen ? 28 : 32}
                  borderRadius={isSmallScreen ? 14 : theme.roundness}
                />
                <SkeletonBox
                  width={isSmallScreen ? 28 : 32}
                  height={isSmallScreen ? 28 : 32}
                  borderRadius={isSmallScreen ? 14 : theme.roundness}
                />
              </View>
            </View>
            <SkeletonBox
              width="85%"
              height={isSmallScreen ? 14 : 18}
              style={{ marginBottom: isSmallScreen ? 6 : SPACING.sm }}
            />

            {/* Description skeleton */}
            <SkeletonBox
              width="100%"
              height={isSmallScreen ? 12 : 14}
              style={{ marginBottom: SPACING.xs }}
            />
            <SkeletonBox width="90%" height={isSmallScreen ? 12 : 14} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
