import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { BookmarksProvider } from '../context/BookmarksContext';
import { FeaturedContentProvider } from '../context/FeaturedContentContext';
import { PreferencesProvider } from '../context/PreferencesContext';
import { ThemeProvider } from '../context/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function Layout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BookmarksProvider>
            <FeaturedContentProvider>
              <PreferencesProvider>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="(zArticleStack)" options={{ headerShown: false }} />
                  <Stack.Screen name="(zCategoryStack)" options={{ headerShown: false }} />
                </Stack>
              </PreferencesProvider>
            </FeaturedContentProvider>
          </BookmarksProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

