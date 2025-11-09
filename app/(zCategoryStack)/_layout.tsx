import { Stack } from 'expo-router';
import React from 'react';

export default function CategoryStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[title]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
