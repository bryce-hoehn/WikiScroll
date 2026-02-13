import { SPACING } from '@/constants/spacing';
import { useReducedMotion } from '@/hooks';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface SearchResultSkeletonProps {
  index?: number;
}

/**
 * Skeleton loader for search result list items
 * Matches the layout of BaseListWithHeader List.Item
 */
export default function SearchResultSkeleton({
  index = 0
}: SearchResultSkeletonProps) {
  const theme = useTheme();
  const { reducedMotion } = useReducedMotion();
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reducedMotion) {
      fadeAnim.setValue(1);
      shimmerAnim.setValue(0);
      return;
    }

    const useNativeDriver = Platform.OS !== 'web';

    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          useNativeDriver
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          useNativeDriver
        })
      ])
    );
    shimmer.start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      useNativeDriver
    }).start();

    return () => shimmer.stop();
  }, [shimmerAnim, fadeAnim, index, reducedMotion]);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300]
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.7, 0.2]
  });

  const SkeletonBox = ({
    width,
    height,
    borderRadius = theme.roundness * 1, // 4dp equivalent (4dp * 1)
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
      borderRadius,
      backgroundColor: theme.colors.surfaceVariant,
      overflow: 'hidden'
    };

    return (
      <View style={style ? [baseStyle, style] : baseStyle}>
        <Animated.View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: theme.colors.surface,
            transform: [{ translateX: shimmerTranslateX }],
            opacity: shimmerOpacity
          }}
        />
      </View>
    );
  };

  const thumbnailSize = 56; // Match BaseListWithHeader thumbnail size

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View
        style={{
          backgroundColor: theme.colors.elevation.level2,
          marginHorizontal: SPACING.sm,
          marginVertical: SPACING.xs / 2,
          borderRadius: theme.roundness,
          padding: SPACING.sm,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <SkeletonBox
          width={thumbnailSize}
          height={thumbnailSize}
          borderRadius={theme.roundness * 2}
          style={{ marginRight: SPACING.sm }}
        />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBox width="70%" height={16} />
          <SkeletonBox width="90%" height={12} />
        </View>
      </View>
    </Animated.View>
  );
}
