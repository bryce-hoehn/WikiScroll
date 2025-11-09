import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React from 'react';
import { BookmarksProvider } from '../context/BookmarksContext';
import { FeaturedContentProvider } from '../context/FeaturedContentContext';
import { PreferencesProvider } from '../context/PreferencesContext';
import { ThemeProvider } from '../context/ThemeProvider';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BookmarksProvider>
          <FeaturedContentProvider>
            <PreferencesProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(zCategoryStack)" options={{ headerShown: false }} />
                <Stack.Screen name="(zArticleStack)" options={{ headerShown: false }} />
              </Stack>
            </PreferencesProvider>
          </FeaturedContentProvider>
        </BookmarksProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
