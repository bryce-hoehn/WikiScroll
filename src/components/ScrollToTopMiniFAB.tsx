import React from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useReducedMotion } from '@/hooks';
import { SPACING } from '@/constants/spacing';
import { COMPONENT_HEIGHTS, LAYOUT } from '@/constants/layout';

interface ScrollToTopMiniFABProps {
  scrollRef: React.RefObject<any>;
  visible?: boolean;
  hasBottomTabBar?: boolean;
}

export default function ScrollToTopMiniFAB({
  scrollRef,
  visible = true,
  hasBottomTabBar = true
}: ScrollToTopMiniFABProps) {
  const theme = useTheme();
  const { reducedMotion } = useReducedMotion();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= LAYOUT.DESKTOP_BREAKPOINT;

  const scrollToTop = () => {
    if (!scrollRef.current) {
      return;
    }

    // For FlashList, we need to use scrollToOffset instead of scrollTo
    if (scrollRef.current.scrollToOffset) {
      scrollRef.current.scrollToOffset({ offset: 0, animated: !reducedMotion });
      return;
    }

    // For ScrollView
    if (Platform.OS === 'web') {
      const element = scrollRef.current as any;
      let scrollNode: any = null;

      if (element.getScrollableNode) {
        scrollNode = element.getScrollableNode();
      }

      if (scrollNode) {
        if (typeof scrollNode.scrollTo === 'function') {
          scrollNode.scrollTo({
            top: 0,
            behavior: reducedMotion ? 'auto' : 'smooth'
          });
          return;
        }
        if (typeof scrollNode.scrollTop === 'number') {
          scrollNode.scrollTop = 0;
          return;
        }
      }

      if (element.scrollTo) {
        element.scrollTo({ y: 0, animated: !reducedMotion });
      }
    } else {
      if (scrollRef.current.scrollTo) {
        scrollRef.current.scrollTo({ y: 0, animated: !reducedMotion });
      }
    }
  };

  const baseMargin = 16;
  const spacingFromTabBar = 16;

  const bottomMargin =
    hasBottomTabBar && !isLargeScreen
      ? Platform.OS === 'web'
        ? spacingFromTabBar +
          COMPONENT_HEIGHTS.STANDARD +
          Math.max(insets.bottom, SPACING.sm)
        : spacingFromTabBar
      : baseMargin +
        (Platform.OS === 'web'
          ? Math.max(insets.bottom, SPACING.sm)
          : insets.bottom);

  const leftMargin = Platform.select({
    web: isLargeScreen ? 24 : baseMargin,
    default: baseMargin
  });

  return (
    <FAB
      icon="arrow-up"
      size="small"
      onPress={scrollToTop}
      visible={visible}
      style={[
        styles.fabStyle,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: SPACING.base,
          position: 'absolute',
          bottom: 0,
          left: 0,
          marginBottom: bottomMargin,
          marginLeft: leftMargin,
          zIndex: 998,
          elevation: 3
        }
      ]}
      color={theme.colors.onSurfaceVariant}
      accessibilityLabel="Scroll to top"
      accessibilityHint="Scrolls to the top of the page"
    />
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: 'absolute'
  }
});
