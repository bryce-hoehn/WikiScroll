import React, { useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { AnimatedFAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LAYOUT, COMPONENT_HEIGHTS } from '../../constants/layout';
import { SPACING } from '../../constants/spacing';
import SearchOverlay from '../search/SearchOverlay';

interface SearchFABProps {
  hasBottomTabBar?: boolean;
}

export default function SearchFAB({ hasBottomTabBar = true }: SearchFABProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= LAYOUT.DESKTOP_BREAKPOINT;
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const handleSearchPress = () => {
    setShowSearchOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowSearchOverlay(false);
  };

  const baseMargin = 16;
  const spacingFromTabBar = 16;
  
  const bottomMargin = hasBottomTabBar && !isLargeScreen
    ? Platform.OS === 'web'
      ? spacingFromTabBar + COMPONENT_HEIGHTS.STANDARD + Math.max(insets.bottom, SPACING.sm)
      : spacingFromTabBar
    : baseMargin + (Platform.OS === 'web' ? Math.max(insets.bottom, SPACING.sm) : insets.bottom);
  
  const rightMargin = Platform.select({
    web: isLargeScreen ? 24 : baseMargin,
    default: baseMargin,
  });

  return (
    <>
      <AnimatedFAB
        icon="magnify"
        label="Search"
        extended={false}
        onPress={handleSearchPress}
        visible={true}
        animateFrom="right"
        iconMode="static"
        style={[
          styles.fabStyle,
          {
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: SPACING.base,
            position: 'absolute',
            bottom: 0,
            right: 0,
            marginBottom: bottomMargin,
            marginRight: rightMargin,
            zIndex: 998,
            elevation: 3,
          },
        ]}
        color={theme.colors.onPrimaryContainer}
        accessibilityLabel="Search Wikipedia"
        accessibilityHint="Opens the search overlay"
      />
      <SearchOverlay
        visible={showSearchOverlay}
        onClose={handleCloseOverlay}
        initialQuery=""
      />
    </>
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: 'absolute',
  },
});

