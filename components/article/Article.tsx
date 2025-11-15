import { useArticleHtml } from "@/hooks";
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Linking, ScrollView, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import RenderHtml, { HTMLContentModel, HTMLElementModel } from 'react-native-render-html';
import { getArticleClassStyles, getArticleTagStyles } from '../../utils/articleStyles';
import ScrollToTopFAB from '../common/ScrollToTopFAB';
import ArticleImageModal from './ArticleImageModal';
import { CaptionRenderer, ImageRenderer, useDomVisitors } from './ArticleRenderers';

// Optimized article content component with performance improvements
const ArticleContent = React.memo(({
  articleHtml,
  renderConfig,
  fontSize
}: {
  articleHtml: string;
  renderConfig: any;
  fontSize: number;
}) => (
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
    ignoredDomTags={['link', 'meta', 'map', 'video', 'audio', 'script', 'style', 'noscript']}
    enableExperimentalBRCollapsing={true}
    defaultTextProps={{selectable: true}}
    // Performance optimizations
    computeEmbeddedMaxWidth={() => renderConfig.width - 32} // Account for padding
    systemFonts={['Arial', 'Courier New', 'Georgia']} // Limit font loading
    // Reduce re-renders
    key={articleHtml?.substring(0, 100)} // Use content-based key for better caching
    baseStyle={{
      userSelect: 'text',
      fontSize: fontSize,
      lineHeight: fontSize * 1.5,
    }}
  />
));
ArticleContent.displayName = 'ArticleContent';

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
  const scrollViewRef = useRef<ScrollView>(null);
  const [fabVisible, setFabVisible] = useState(false);
  const [fontSize] = useState(16); // Base font size

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

  // Optimized: Calculate styles once and reuse them
  const { tagsStyles, classesStyles } = useMemo(() => {
    const baseTagsStyles = getArticleTagStyles(theme);
    const classesStyles = getArticleClassStyles(theme);
    return {
      tagsStyles: baseTagsStyles as any,
      classesStyles: classesStyles as any
    };
  }, [theme]);

  // // Zoom controls
  // const increaseFontSize = useCallback(() => {
  //   setFontSize(prev => Math.min(prev + 2, 24)); // Max 24px
  // }, []);

  // const decreaseFontSize = useCallback(() => {
  //   setFontSize(prev => Math.max(prev - 2, 12)); // Min 12px
  // }, []);

  // const resetFontSize = useCallback(() => {
  //   setFontSize(16); // Reset to default
  // }, []);

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

  // Get DOM visitors from worklet hook
  const domVisitors = useDomVisitors();

  // Optimized: Combine all render-related configurations into a single memo
  const { renderConfig } = useMemo(() => {
    const renderersProps = {
      a: {
        onPress: (event: any, href: string) => {
          handleLinkPress(href);
        },
      }
    };

    const renderers = {
      img: (props: any) => <ImageRenderer {...props} onImagePress={handleImagePress} />,
      caption: CaptionRenderer
    };

    const customHTMLElementModels = {
      caption: HTMLElementModel.fromCustomModel({
        tagName: 'caption',
        contentModel: HTMLContentModel.block
      })
    };

    const renderConfig = {
      width,
      tagsStyles,
      classesStyles,
      renderersProps,
      renderers,
      domVisitors,
      customHTMLElementModels
    };

    return {
      renderersProps,
      renderers,
      customHTMLElementModels,
      renderConfig
    };
  }, [width, tagsStyles, classesStyles, handleLinkPress, handleImagePress, domVisitors]);


  // Render states
  if (!title) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text selectable variant="bodyMedium">No article title provided</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text selectable style={{ marginTop: 16 }}>Loading article...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text selectable variant="bodyMedium">Error loading article: {error.message}</Text>
      </View>
    );
  }

  if (!articleHtml) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text selectable variant="bodyMedium">No article content available</Text>
      </View>
    );
  }

  return (
    <>
      {/* Zoom Controls */}
      {/* <Appbar.Header style={{ backgroundColor: theme.colors.surface, elevation: 2 }}>
        <Appbar.Action
          icon="minus"
          onPress={decreaseFontSize}
          disabled={fontSize <= 12}
          accessibilityLabel="Decrease font size"
          accessibilityHint="Makes the article text smaller"
        />
        <Appbar.Content
          title={`${Math.round((fontSize / 16) * 100)}%`}
          titleStyle={{ textAlign: 'center', fontSize: 14 }}
        />
        <Appbar.Action
          icon="plus"
          onPress={increaseFontSize}
          disabled={fontSize >= 24}
          accessibilityLabel="Increase font size"
          accessibilityHint="Makes the article text larger"
        />
        <Appbar.Action
          icon="format-size"
          onPress={resetFontSize}
          accessibilityLabel="Reset font size"
          accessibilityHint="Resets the article text to default size"
        />
      </Appbar.Header> */}

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={(event) => {
          const yOffset = event.nativeEvent.contentOffset.y;
          setFabVisible(yOffset > 300);
        }}
        scrollEventThrottle={16}
        // Enable pinch-to-zoom and text selection
        minimumZoomScale={1.0}
        maximumZoomScale={3.0}
        bouncesZoom={true}
        pinchGestureEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={{ padding: 16 }}>
          <ArticleContent
            articleHtml={articleHtml || ''}
            renderConfig={renderConfig}
            fontSize={fontSize}
          />
        </View>
      </ScrollView>
      <ScrollToTopFAB scrollRef={scrollViewRef} visible={fabVisible} />
      <ArticleImageModal
        visible={imageModalState.visible}
        selectedImage={imageModalState.selectedImage}
        onClose={handleCloseImageModal}
      />
    </>
  );
}