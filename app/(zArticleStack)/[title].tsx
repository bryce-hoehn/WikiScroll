import { fetchArticleThumbnail } from '@/api/articles/fetchArticleThumbnail';
import { ImageThumbnail } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SearchOverlay } from '../../components';
import ArticleHeader from '../../components/article/ArticleHeader';
import ArticleImageModal from '../../components/article/ArticleImageModal';
import ArticleSectionRenderer from '../../components/article/ArticleSectionRenderer';
import { useArticle, useBookmarks, useVisitedArticles } from '../../hooks';

export default function ArticleScreen() {
  const theme = useTheme();
  const { title } = useLocalSearchParams<{ title: string }>();
  const [showSearch, setShowSearch] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{uri: string; alt?: string} | null>(null);
  const [thumbnail, setThumbnail] = useState<ImageThumbnail>();
  const hasTrackedVisit = useRef(false);
  const { data: article } = useArticle(title as string);
  const { addVisitedArticle } = useVisitedArticles();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  // Fetch thumbnail when title changes
  useEffect(() => {
    const fetchThumbnail = async () => {
      if (title) {
        const thumbnail = await fetchArticleThumbnail(title as string);
        setThumbnail(thumbnail as unknown as ImageThumbnail);
      }
    };

    fetchThumbnail();
  }, [title]);

  // Track article visit when article data is loaded (only once per article)
  useEffect(() => {
    if (article && title && !hasTrackedVisit.current) {
      addVisitedArticle(title as string, article);
      hasTrackedVisit.current = true;
    }
  }, [article, title, addVisitedArticle]);

  // Reset tracking when title changes
  useEffect(() => {
    hasTrackedVisit.current = false;
  }, [title]);
  
  const handleBackPress = () => {
    router.back();
  };

  const handleSearchPress = () => {
    setShowSearch(true);
  };

  const handleSearchClose = () => {
    setShowSearch(false);
  };

  const handleBookmarkToggle = async () => {
    if (!article) return;
    
    const bookmarked = isBookmarked(article.title);
    if (bookmarked) {
      await removeBookmark(article.title);
    } else {
      await addBookmark(article.title, thumbnail, article.description);
    }
  };

  const handleImagePress = (imageUri: string, alt?: string) => {
    setSelectedImage({ uri: imageUri, alt });
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const renderArticleSection = ({ item: section, index }: { item: any; index: number }) => (
    <ArticleSectionRenderer
      section={section}
      index={index}
      thumbnail={thumbnail}
      onImagePress={handleImagePress}
    />
  );

  return (
    <>
      {showSearch ? (
        <SearchOverlay visible={showSearch} onClose={handleSearchClose} />
      ) : (
        <>
          <ArticleHeader
            title={article?.title}
            isBookmarked={isBookmarked}
            onBookmarkToggle={handleBookmarkToggle}
            onSearchPress={handleSearchPress}
            onBackPress={handleBackPress}
          />

          <FlatList
            data={article?.sections || []}
            renderItem={renderArticleSection}
            keyExtractor={(item, index) => `${item.title || 'section'}-${index}`}
            style={{ backgroundColor: theme.colors.background }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingVertical: 8,
            }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={false}
          />
        </>
      )}

      <ArticleImageModal
        visible={showImageModal}
        selectedImage={selectedImage}
        onClose={handleCloseImageModal}
      />
    </>
  );
}
