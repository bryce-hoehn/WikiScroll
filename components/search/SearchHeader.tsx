import React from 'react';
import { Appbar, Searchbar } from 'react-native-paper';

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  onClose: () => void;
}

export default function SearchHeader({ 
  query, 
  onQueryChange, 
  onSearchSubmit, 
  onClose 
}: SearchHeaderProps) {
  return (
    <Appbar.Header>
      <Searchbar
        placeholder="Search Wikipedia"
        value={query}
        onChangeText={onQueryChange}
        onSubmitEditing={onSearchSubmit}
        style={{
          flex: 1,
          marginHorizontal: 16,
        }}
      />
      <Appbar.BackAction onPress={onClose} />
    </Appbar.Header>
  );
}
