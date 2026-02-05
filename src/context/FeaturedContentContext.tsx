import React, { createContext, ReactNode, useContext, useMemo } from 'react';

import useFeaturedContentHook from '../hooks/content/useFeaturedContent';
import { FeaturedContentContextType } from '../types/api/featured';

const FeaturedContentContext = createContext<
  FeaturedContentContextType | undefined
>(undefined);

interface FeaturedContentProviderProps {
  children: ReactNode;
}

export function FeaturedContentProvider({
  children,
}: FeaturedContentProviderProps) {
  const featuredContentQuery = useFeaturedContentHook();

  const { data, isLoading, error, refetch } = featuredContentQuery;
  const raw = (data as any) ?? null;
  const errorMessage = error?.message || null;

  const contextValue: FeaturedContentContextType = useMemo(
    () => ({
      featuredContent: raw?.data && raw.data.tfa ? raw.data : null,
      isLoading,
      error: errorMessage,
      refreshFeaturedContent: async () => {
        await refetch();
      },
    }),
    [raw, isLoading, errorMessage, refetch],
  );

  return (
    <FeaturedContentContext.Provider value={contextValue}>
      {children}
    </FeaturedContentContext.Provider>
  );
}

export function useFeaturedContent(): FeaturedContentContextType {
  const context = useContext(FeaturedContentContext);
  if (context === undefined) {
    throw new Error(
      'useFeaturedContent must be used within a FeaturedContentProvider',
    );
  }
  return context;
}
