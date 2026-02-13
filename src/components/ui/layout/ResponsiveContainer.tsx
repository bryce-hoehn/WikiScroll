import AppSidebar from '@/components/ui/layout/AppSidebar';
import { BREAKPOINTS } from '@/constants/breakpoints';
import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import Header from './Header';
import NavDrawer from './NavDrawer';

export default function ResponsiveContainer({
  children
}: {
  children: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: theme.colors.background
      }}
    >
      {width > BREAKPOINTS.lg && (
        <>
          <NavDrawer />
          <Divider style={{ width: 1, height: '100%' }} />
        </>
      )}
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Header />
        <Divider />
        <View style={{ flex: 1 }}>{children}</View>
      </View>
      {width > BREAKPOINTS.xl && (
        <>
          <Divider style={{ width: 1, height: '100%' }} />
          <AppSidebar />
        </>
      )}
    </View>
  );
}
