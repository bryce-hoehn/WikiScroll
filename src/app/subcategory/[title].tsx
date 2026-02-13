import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  Appbar,
  Card,
  Icon,
  List,
  Surface,
  Text,
  TouchableRipple,
  useTheme
} from 'react-native-paper';

import StandardEmptyState from '@/components/StandardEmptyState';
import SubcategorySkeleton from '@/components/skeleton/SubcategorySkeleton';
import ResponsiveContainer from '@/components/ui/layout/ResponsiveContainer';
import { SPACING } from '@/constants/spacing';
import { TYPOGRAPHY } from '@/constants/typography';
import { useCategoryMembers } from '@/hooks';
import { CategoryArticle, CategorySubcategory } from '@/types/api';

export default function SubCategories() {
  const theme = useTheme();
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title: string }>();
  const [subcategoriesHorizontal, setSubcategoriesHorizontal] = useState(true);
  const { data, isLoading } = useCategoryMembers(title || '');

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback navigation if there's no screen to go back to
      router.push('/categories');
    }
  };

  const handleArticlePress = (articleTitle: string) => {
    router.push(`/article/${encodeURIComponent(articleTitle)}`);
  };

  const handleSubcategoryPress = (subcategoryTitle: string) => {
    router.push(`/subcategory/${encodeURIComponent(subcategoryTitle)}`);
  };

  const handleImagePress = (imageUri: string, alt: string) => {
    setSelectedImage({ uri: imageUri, alt });
    setImageModalVisible(true);
  };

  // Article item component - must be a component to use hooks
  const ArticleItem = React.memo(
    ({
      article,
      onPress,
      onImagePress
    }: {
      article: CategoryArticle;
      onPress: (title: string) => void;
      onImagePress: (uri: string, alt: string) => void;
    }) => {
      const itemTheme = useTheme();

      return (
        <Card
          style={{
            flex: 1,
            margin: 4,
            overflow: 'hidden'
          }}
          onPress={() => onPress(article.title)}
        >
          {article.thumbnail ? (
            <Pressable
              onPress={(e: any) => {
                e.stopPropagation();
                onImagePress(
                  article.thumbnail!,
                  `Thumbnail for ${article.title}`
                );
              }}
              style={{ height: 120 }}
            >
              <Image
                source={{ uri: article.thumbnail }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </Pressable>
          ) : (
            <Card.Content
              style={{
                height: 120,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Icon
                source="file-document-outline"
                size={48}
                color={itemTheme.colors.onSurfaceVariant}
              />
            </Card.Content>
          )}
          <Card.Content style={{ padding: 12 }}>
            <Text
              variant="bodyMedium"
              numberOfLines={2}
              style={{ fontWeight: '500', marginBottom: 4 }}
            >
              {article.title ? article.title.replace(/_/g, ' ') : 'Untitled'}
            </Text>
            {article.description && article.description.trim() ? (
              <Text
                variant="bodySmall"
                numberOfLines={2}
                style={{ color: itemTheme.colors.onSurfaceVariant }}
              >
                {article.description}
              </Text>
            ) : null}
          </Card.Content>
        </Card>
      );
    }
  );
  ArticleItem.displayName = 'ArticleItem';

  // Subcategory item component - must be a component to use hooks
  const SubcategoryItem = React.memo(
    ({
      subcategory,
      onPress
    }: {
      subcategory: CategorySubcategory;
      onPress: (title: string) => void;
    }) => {
      const itemTheme = useTheme();

      return (
        <Surface
          style={{
            borderRadius: itemTheme.roundness * 3, // 12dp equivalent (4dp * 3)
            margin: 4
          }}
        >
          <List.Item
            key={subcategory.title}
            title={subcategory.title.replace(/_/g, ' ')}
            left={(props) => <List.Icon {...props} icon="folder-outline" />}
            onPress={() => onPress(subcategory.title)}
            style={{ paddingVertical: SPACING.sm }}
          />
        </Surface>
      );
    }
  );
  SubcategoryItem.displayName = 'SubcategoryItem';

  const renderArticleItem = ({ item }: { item: CategoryArticle }) => {
    return (
      <ArticleItem
        article={item}
        onPress={handleArticlePress}
        onImagePress={handleImagePress}
      />
    );
  };

  const renderSubcategoryItem = ({ item }: { item: CategorySubcategory }) => {
    return (
      <SubcategoryItem subcategory={item} onPress={handleSubcategoryPress} />
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontWeight: '500',
              fontSize: TYPOGRAPHY.appBarTitle,
              flex: 1
            }}
          >
            {title?.replace(/_/g, ' ') || 'Category'}
          </Text>
        </View>
        <View>
          <SubcategorySkeleton />
        </View>
      </View>
    );
  }

  const articles = data?.articles || [];
  const subcategories = data?.subcategories || [];

  return (
    <ResponsiveContainer>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Appbar.BackAction onPress={handleBack} />
          <Text
            style={{
              fontWeight: '700',
              fontSize: TYPOGRAPHY.titleLarge,
              flex: 1
            }}
          >
            {title?.replace(/_/g, ' ') || 'Category'}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          {articles.length === 0 && subcategories.length === 0 ? (
            <StandardEmptyState
              icon="folder-open-outline"
              title="No Content Found"
              description="This category does not contain any articles or subcategories."
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                width: '100%'
              }}
            >
              {/* Subcategories Section */}
              {subcategories.length > 0 && (
                <View style={{ padding: SPACING.sm }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 12
                    }}
                  >
                    <Text variant="titleMedium" style={{ flex: 1 }}>
                      Subcategories
                    </Text>
                    <TouchableRipple
                      onPress={() =>
                        setSubcategoriesHorizontal(!subcategoriesHorizontal)
                      }
                      style={{ borderRadius: theme.roundness * 4 }} // 16dp equivalent (4dp * 4)
                    >
                      <Icon
                        source={
                          subcategoriesHorizontal
                            ? 'chevron-down'
                            : 'chevron-up'
                        }
                        size={24}
                        color={theme.colors.onSurface}
                      />
                    </TouchableRipple>
                  </View>
                  <View
                    style={{
                      maxHeight: subcategoriesHorizontal ? undefined : 400
                    }}
                  >
                    <FlashList
                      data={subcategories}
                      renderItem={renderSubcategoryItem}
                      keyExtractor={(item: CategorySubcategory) => item.title}
                      {...({
                        estimatedItemSize: subcategoriesHorizontal ? 200 : 64
                      } as any)}
                      horizontal={subcategoriesHorizontal}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={!subcategoriesHorizontal}
                      scrollEnabled={true}
                      contentContainerStyle={{ paddingRight: SPACING.sm }}
                      key={`subcategories-${subcategoriesHorizontal}`}
                    />
                  </View>
                </View>
              )}

              {/* Articles Section */}
              {articles.length > 0 && (
                <View
                  style={{
                    padding: SPACING.sm,
                    paddingTop: subcategories.length > 0 ? 0 : SPACING.sm,
                    flex: 1
                  }}
                >
                  <Text variant="titleMedium" style={{ marginBottom: 12 }}>
                    Articles
                  </Text>
                  <FlashList
                    data={articles}
                    numColumns={2}
                    renderItem={renderArticleItem}
                    keyExtractor={(item: CategoryArticle) => item.title}
                    {...({ estimatedItemSize: 220 } as any)}
                    contentContainerStyle={{ paddingRight: 16 }}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ResponsiveContainer>
  );
}
