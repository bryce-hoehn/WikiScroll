import { useQuery } from '@tanstack/react-query';
import { fetchSearchSuggestions } from '../../api';

/**
 * Hook for fetching Wikipedia search suggestions
 */
export default function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => fetchSearchSuggestions(query),
    enabled: !!query && query.length > 2, // Only fetch when query has at least 3 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
