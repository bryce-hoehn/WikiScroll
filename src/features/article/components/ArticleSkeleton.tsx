import { SPACING } from '@/constants/spacing';
import React from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from 'react-native-paper';

/**
 * Skeleton loader component that matches Article layout
 * Provides smooth shimmer animation for better loading experience
 */
export default function ArticleSkeleton() {
  const theme = useTheme();
  // Match Article.tsx padding system - use default padding of 16px
  const defaultPadding = 16;

  const SkeletonBox = ({
    width,
    height,
    borderRadius = undefined,
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
      borderRadius: borderRadius ?? theme.roundness,
      backgroundColor: theme.colors.surfaceVariant,
      overflow: 'hidden'
    };

    return (
      <View style={style ? [baseStyle, style] : baseStyle}>
        <Animated.View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: theme.colors.surface
          }}
        />
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background
      }}
    >
      <View
        style={{
          width: '100%',
          paddingHorizontal: defaultPadding,
          paddingVertical: SPACING.sm
        }}
      >
        {/* Title skeleton */}
        <SkeletonBox
          width="85%"
          height={32}
          style={{ marginBottom: SPACING.md }}
        />
        <SkeletonBox
          width="60%"
          height={24}
          style={{ marginBottom: SPACING.lg }}
        />

        {/* Image skeleton (if article has image) */}
        <SkeletonBox
          width="100%"
          height={200}
          style={{ marginBottom: SPACING.lg, borderRadius: theme.roundness }}
        />

        {/* Intro paragraph skeletons */}
        <SkeletonBox
          width="100%"
          height={16}
          style={{ marginBottom: SPACING.sm }}
        />
        <SkeletonBox
          width="100%"
          height={16}
          style={{ marginBottom: SPACING.sm }}
        />
        <SkeletonBox
          width="95%"
          height={16}
          style={{ marginBottom: SPACING.sm }}
        />
        <SkeletonBox
          width="100%"
          height={16}
          style={{ marginBottom: SPACING.md }}
        />
        <SkeletonBox
          width="90%"
          height={16}
          style={{ marginBottom: SPACING.lg }}
        />

        {/* Section heading skeleton */}
        <SkeletonBox
          width="40%"
          height={28}
          style={{ marginBottom: SPACING.md }}
        />

        {/* Section content skeletons */}
        <SkeletonBox
          width="100%"
          height={16}
          style={{ marginBottom: SPACING.sm }}
        />
        <SkeletonBox
          width="100%"
          height={16}
          style={{ marginBottom: SPACING.sm }}
        />
        <SkeletonBox
          width="98%"
          height={16}
          style={{ marginBottom: SPACING.sm }}
        />
        <SkeletonBox
          width="100%"
          height={16}
          style={{ marginBottom: SPACING.md }}
        />
        <SkeletonBox
          width="92%"
          height={16}
          style={{ marginBottom: SPACING.lg }}
        />

        {/* Another section heading */}
        <SkeletonBox
          width="35%"
          height={28}
          style={{ marginBottom: SPACING.md }}
        />

        {/* More content */}
        <SkeletonBox
          width="100%"
          height={16}
          style={{ marginBottom: SPACING.sm }}
        />
        <SkeletonBox
          width="100%"
          height={16}
          style={{ marginBottom: SPACING.sm }}
        />
        <SkeletonBox
          width="96%"
          height={16}
          style={{ marginBottom: SPACING.sm }}
        />
        <SkeletonBox
          width="100%"
          height={16}
          style={{ marginBottom: SPACING.md }}
        />
      </View>
    </Animated.View>
  );
}
