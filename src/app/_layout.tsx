import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import React from 'react';

import { ThemeProvider } from '@/stores/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes - keep data in cache longer to reduce refetches
      refetchOnWindowFocus: false // Don't refetch when window regains focus - reduces unnecessary requests
    }
  }
});

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
