import { useQuery } from '@tanstack/react-query';

import { fetchCategoryPages } from '@/api';

/**
 * Hook for fetching Wikipedia category pages
 * Categories rarely change, so we use aggressive caching
 */
export default function useCategoryMembers(category: string) {
  return useQuery({
    queryKey: ['category-pages', category],
    queryFn: () => fetchCategoryPages(category),
    enabled: !!category,
    staleTime: 60 * 60 * 1000, // 1 hour - categories rarely change
    gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep in cache for a day
    retry: 2,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
}
