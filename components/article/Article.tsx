import { useArticleHtml } from "@/hooks";
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Linking, ScrollView, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import RenderHtml, { HTMLContentModel, HTMLElementModel } from 'react-native-render-html';
import { getArticleClassStyles, getArticleTagStyles } from '../../utils/articleStyles';
import ArticleImageModal from './ArticleImageModal';
import { CaptionRenderer, createDomVisitors, ImageRenderer } from './ArticleRenderers';

interface ArticleProps {
  title?: string;
}

interface ImageModalState {
  visible: boolean;
  selectedImage: { uri: string; alt?: string } | null;
}

export default function Article({ title }: ArticleProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { data: articleHtml, isLoading, error } = useArticleHtml(title || '');
  const [imageModalState, setImageModalState] = useState<ImageModalState>({
    visible: false,
    selectedImage: null
  });

  const handleLinkPress = useCallback((href: string) => {
    // Handle internal Wikipedia links (both relative and absolute)
    if (href.startsWith('/wiki/') || href.includes('wikipedia.org/wiki/')) {
      let articleTitle = '';
      
      // Extract article title from different URL formats
      if (href.startsWith('/wiki/')) {
        // Relative path: /wiki/Article_Title
        articleTitle = href.replace('/wiki/', '');
      } else if (href.includes('wikipedia.org/wiki/')) {
        // Absolute URL: https://en.wikipedia.org/wiki/Article_Title
        const urlParts = href.split('/wiki/');
        if (urlParts.length > 1) {
          articleTitle = urlParts[1];
        }
      }
      
      // Clean up the title (remove anchors, query parameters)
      articleTitle = articleTitle.split('#')[0].split('?')[0];
      
      if (articleTitle) {
        router.push(`/(zArticleStack)/${articleTitle}`);
        return; // Prevent default behavior
      }
    }
    
    // For all other links, open in external browser
    Linking.openURL(href).catch(console.error);
  }, []);

  const tagsStyles = useMemo(() => getArticleTagStyles(theme) as any, [theme]);
  const classesStyles = useMemo(() => getArticleClassStyles(theme) as any, [theme]);

  const renderersProps = useMemo(() => ({
    a: {
      onPress: (event: any, href: string) => {
        handleLinkPress(href);
      },
    }
  }), [handleLinkPress]);

  const handleImagePress = useCallback((image: { uri: string; alt?: string }) => {
    setImageModalState({
      visible: true,
      selectedImage: image
    });
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setImageModalState({
      visible: false,
      selectedImage: null
    });
  }, []);

  const renderers = useMemo(() => ({
    img: (props: any) => <ImageRenderer {...props} onImagePress={handleImagePress} />,
    caption: CaptionRenderer,
  }), [handleImagePress]);

  const customHTMLElementModels = useMemo(() => ({
    caption: HTMLElementModel.fromCustomModel({
      tagName: 'caption',
      contentModel: HTMLContentModel.block
    })
  }), []);

  const domVisitors = useMemo(() => createDomVisitors(), []);


  // Memoize render configuration to prevent unnecessary re-renders
  const renderConfig = useMemo(() => ({
    width,
    tagsStyles,
    classesStyles,
    renderersProps,
    renderers,
    domVisitors,
    customHTMLElementModels
  }), [width, tagsStyles, classesStyles, renderersProps, renderers, domVisitors, customHTMLElementModels]);


  // Render states
  if (!title) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="bodyMedium">No article title provided</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Loading article...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="bodyMedium">Error loading article: {error.message}</Text>
      </View>
    );
  }

  if (!articleHtml) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="bodyMedium">No article content available</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ padding: 16 }}>
          <RenderHtml
            contentWidth={renderConfig.width}
            source={{ html: articleHtml || '' }}
            tagsStyles={renderConfig.tagsStyles}
            classesStyles={renderConfig.classesStyles}
            renderersProps={renderConfig.renderersProps}
            renderers={renderConfig.renderers}
            domVisitors={renderConfig.domVisitors}
            customHTMLElementModels={renderConfig.customHTMLElementModels}
            enableExperimentalMarginCollapsing={true}
            ignoredDomTags={['link', 'meta', 'map']}
          />
        </View>
      </ScrollView>
      <ArticleImageModal
        visible={imageModalState.visible}
        selectedImage={imageModalState.selectedImage}
        onClose={handleCloseImageModal}
      />
    </>
  );
}