import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Card, Divider, Text, useTheme } from 'react-native-paper';

import { LAYOUT } from '@/constants/layout';
import { SPACING } from '@/constants/spacing';

interface ContentWithSidebarProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

/**
 * Layout component that shows a right sidebar on large screens
 * Similar to Twitter's layout with main content and "What&apos;s happening" section
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
          <Divider style={{ width: 1 }} />
          <View
            style={{
              width: LAYOUT.SIDEBAR_WIDTH,
              backgroundColor: theme.colors.surface,
              padding: SPACING.md
            }}
          >
            {sidebar ? (
              sidebar
            ) : (
              // Default sidebar content if none provided
              <Card>
                <Card.Content>
                  <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                    What&apos;s happening
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Sidebar content goes here
                  </Text>
                </Card.Content>
              </Card>
            )}
          </View>
        </>
      )}
    </View>
  );
}
