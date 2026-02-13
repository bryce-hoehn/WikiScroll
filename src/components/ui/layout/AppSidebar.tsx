import { router } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { SPACING } from '@/constants/spacing';

import SearchBar from '@/components/search/SearchBar';
import TrendingSection from '@/features/discover/components/TrendingSection';

export default function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = async () => {
    if (searchQuery.trim()) {
      const { findBestArticleMatch } =
        await import('@/utils/fuzzyArticleSearch');
      const bestMatch = await findBestArticleMatch(searchQuery.trim());
      if (bestMatch) {
        router.push(`/article/${encodeURIComponent(bestMatch)}`);
      }
    }
  };

  // 20dp gap (24dp - 4dp)
  return (
    <View
      style={{
        gap: SPACING.sm,
        height: '100%',
        padding: 20
      }}
    >
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearchSubmit}
        onIconPress={handleSearchSubmit}
      />

      {/* Trending Articles */}
      <TrendingSection />
    </View>
  );
}
