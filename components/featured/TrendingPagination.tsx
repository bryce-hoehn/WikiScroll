import React from 'react';
import { useTheme } from 'react-native-paper';
import { Pagination } from 'react-native-reanimated-carousel';

interface TrendingPaginationProps {
  progress: any;
  data: any[];
  totalPages: number;
  onPageChange: (index: number) => void;
}

export default function TrendingPagination({ 
  progress, 
  data, 
  totalPages, 
  onPageChange 
}: TrendingPaginationProps) {
  const theme = useTheme();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination.Basic
      progress={progress}
      data={data}
      dotStyle={{ 
        backgroundColor: theme.colors.surfaceVariant, 
        borderRadius: 50,
        width: 8,
        height: 8,
      }}
      activeDotStyle={{
        backgroundColor: theme.colors.primary,
        borderRadius: 50,
        width: 8,
        height: 8,
      }}
      containerStyle={{ 
        gap: 8, 
        marginTop: 16,
        marginBottom: 16,
      }}
      onPress={onPageChange}
    />
  );
}
