import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, View } from 'react-native';
import { Appbar, Card, Text, useTheme } from 'react-native-paper';

const rootCategories = {
  'Academic disciplines': 'school',
  'Behavior': 'psychology',
  'Business': 'business-center',
  'Communication': 'chat',
  'Concepts': 'lightbulb',
  'Culture': 'palette',
  'Economy': 'trending-up',
  'Education': 'school',
  'Energy': 'bolt',
  'Engineering': 'build',
  'Entities': 'category',
  'Food and drink': 'restaurant',
  'Geography': 'public',
  'Government': 'account-balance',
  'Health': 'local-hospital',
  'History': 'history',
  'Humanities': 'book',
  'Information': 'info',
  'Knowledge': 'lightbulb',
  'Language': 'translate',
  'Law': 'gavel',
  'Life': 'spa',
  'Lists': 'list',
  'Mass media': 'tv',
  'Mathematics': 'calculate',
  'Nature': 'nature',
  'People': 'people',
  'Philosophy': 'lightbulb',
  'Politics': 'campaign',
  'Religion': 'church',
  'Science': 'science',
  'Society': 'groups',
  'Technology': 'computer',
  'Time': 'schedule',
  'Universe': 'public'
} as const;

export default function CategoriesScreen() {
  const theme = useTheme();

  const renderCategoryItem = ({ item }: { item: [string, string] }) => (
    <Card 
      style={{
        flex: 1,
        margin: 8,
        borderRadius: 12,
        elevation: 1,
        overflow: 'hidden',
      }}
      onPress={() => router.push(`/(zCategoryStack)/${encodeURIComponent(item[0])}`)}
    >
      <View style={{
        height: 96,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceVariant,
      }}>
        <MaterialIcons 
          name={item[1] as any} 
          size={32} 
          color={theme.colors.primary} 
        />
      </View>
      <Card.Content style={{ 
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text 
          variant="titleMedium" 
          style={{ 
            fontWeight: '600',
            color: theme.colors.onSurface,
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          {item[0]}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <>
      {/* App Bar */}
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.surface,
        }}
        mode='center-aligned'
      >
        <Appbar.Content
          title="Categories"
          titleStyle={{
            fontWeight: '700',
            fontSize: 20,
            color: theme.colors.onSurface,
          }}
        />
      </Appbar.Header>

      <FlatList
        data={Object.entries(rootCategories)}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item[0]}
        numColumns={2}
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingVertical: 8,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        windowSize={10}
      />
    </>
  );
}
