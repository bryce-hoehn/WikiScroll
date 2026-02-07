import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';

import { LAYOUT } from '@/constants/layout';
import { SPACING } from '@/constants/spacing';

interface ContentWithSidebarProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

/**
 * Layout component that shows a right sidebar on large screens
 */

export default function ContentWithSidebar({
  children,
  sidebar
}: ContentWithSidebarProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  // Show sidebar on large screens (tablet and desktop)
  const isLargeScreen = width >= LAYOUT.TABLET_BREAKPOINT;

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Main content area */}
      <View
        style={{
          flex: isLargeScreen ? 1 : 1,
          maxWidth: isLargeScreen ? LAYOUT.MAX_CONTENT_WIDTH : '100%',
          backgroundColor: theme.colors.background
        }}
      >
        {children}
      </View>

      {/* Right sidebar - only shown on large screens */}
      {isLargeScreen && (
        <>
          <Divider style={{ width: 1, height: '100%' }} />
          <View
            style={{
              width: LAYOUT.SIDEBAR_WIDTH,
              backgroundColor: theme.colors.surface,
              padding: SPACING.md
            }}
          >
            {sidebar}
          </View>
        </>
      )}
    </View>
  );
}
