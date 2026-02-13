import React from 'react';
import { View } from 'react-native';

import { SPACING } from '@/constants/spacing';

export default function AppSidebar() {
  return (
    <View
      style={{
        gap: SPACING.sm,
        height: '100%',
        padding: SPACING.sm
      }}
    ></View>
  );
}
