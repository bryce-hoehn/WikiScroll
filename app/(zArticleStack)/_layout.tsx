import { Stack } from 'expo-router';
import React from 'react';

export default function ArticleStackLayout() {
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
