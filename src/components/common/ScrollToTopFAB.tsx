import React from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { AnimatedFAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useReducedMotion } from '@/hooks';
import { SPACING } from '@/constants/spacing';
import { COMPONENT_HEIGHTS, LAYOUT } from '@/constants/layout';

interface ScrollToTopFABProps {
  scrollRef: React.RefObject<any>;
  visible?: boolean;
  hasBottomTabBar?: boolean; // Whether the page has a bottom tab bar
  containerPositioned?: boolean; // Whether the FAB is positioned by its container (disables internal positioning)
}

export default function ScrollToTopFAB({
  scrollRef,
  visible = true,
  hasBottomTabBar = true,
  containerPositioned = false,
}: ScrollToTopFABProps) {
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
      // FlashList
      scrollRef.current.scrollToOffset({ offset: 0, animated: !reducedMotion });
      return;
    }

    // For ScrollView
    if (Platform.OS === 'web') {
      // On web, React Native Web ScrollView wraps a DOM element
      const element = scrollRef.current as any;

      let scrollNode: any = null;

      if (element.getScrollableNode) {
        scrollNode = element.getScrollableNode();
      }

      if (scrollNode) {
        if (typeof scrollNode.scrollTo === 'function') {
          scrollNode.scrollTo({
            top: 0,
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
          return;
        }
        if (typeof scrollNode.scrollTop === 'number') {
          scrollNode.scrollTop = 0;
          return;
        }
      }

      // Fallback: Try React Native's scrollTo method
      if (element.scrollTo) {
        element.scrollTo({ y: 0, animated: !reducedMotion });
      }
    } else {
      // Native platforms
      if (scrollRef.current.scrollTo) {
        scrollRef.current.scrollTo({ y: 0, animated: !reducedMotion });
      }
    }
  };

  // Standard FAB positioning per React Native Paper docs: use margin instead of bottom/right
  // MD3: FAB should be 16dp from edges, and 16dp above bottom tab bar
  const baseMargin = SPACING.base;
  const tabBarContentHeight = COMPONENT_HEIGHTS.STANDARD; // Tab bar content area (not including safe area padding)
  const spacingFromTabBar = SPACING.base;

  // Calculate bottom margin: spacing above tab bar + tab bar content height
  // On Android, the tab bar may be positioned differently, so we use a smaller value
  const bottomMargin =
    hasBottomTabBar && !isLargeScreen
      ? Platform.OS === 'web'
        ? spacingFromTabBar +
          tabBarContentHeight +
          Math.max(insets.bottom, SPACING.sm)
        : spacingFromTabBar
      : baseMargin +
        (Platform.OS === 'web'
          ? Math.max(insets.bottom, SPACING.sm)
          : insets.bottom);

  const rightMargin = Platform.select({
    web: isLargeScreen ? SPACING.lg : baseMargin,
    default: baseMargin,
  });

  return (
    <AnimatedFAB
      icon="arrow-up"
      label="Scroll to top"
      extended={false}
      onPress={scrollToTop}
      visible={visible}
      animateFrom="right"
      iconMode="static"
      style={[
        styles.fabStyle,
        {
          backgroundColor: theme.colors.secondaryContainer,
          borderRadius: SPACING.base, // M3: FAB corner radius is 16dp
          ...(containerPositioned
            ? {
                // When container-positioned, fill the container (no margin needed)
                position: 'absolute',
                bottom: 0,
                right: 0,
                margin: 0,
              }
            : {
                position: 'absolute',
                bottom: 0,
                right: 0,
                marginBottom: bottomMargin,
                marginRight: rightMargin,
              }),
          zIndex: 998, // Lower than toolbar (1000) to ensure toolbar buttons receive touches
          elevation: 3, // M3: FAB elevation is 3dp (increases to 4dp when pressed)
        },
      ]}
      color={theme.colors.onSecondaryContainer}
      accessibilityLabel="Scroll to top"
      accessibilityHint="Scrolls to the top of the page"
    />
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: 'absolute',
  },
});
