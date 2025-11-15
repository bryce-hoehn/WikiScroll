import { useFeaturedContent } from '@/context/FeaturedContentContext';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import ArticleImageModal from '../article/ArticleImageModal';
import HtmlRenderer from '../common/HtmlRenderer';
import ResponsiveImage from '../common/ResponsiveImage';

export default function FeaturedImageCard() {
  const { featuredContent } = useFeaturedContent();
  const img = featuredContent?.image;
  const [imageModalVisible, setImageModalVisible] = useState(false);

  if (!img) {
    return null;
  }

  return (
    <>
      <Card
        style={{ width: '100%' }}
      >
        {img.image && (
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <ResponsiveImage
              source={{
                source: img.image.source,
                width: img.image.width,
                height: img.image.height
              }}
              contentFit="cover"
              style={{ borderRadius: 12 }}
            />
          </TouchableOpacity>
        )}
        <Card.Content>
          <HtmlRenderer html={img.description.html} maxLines={6} style={{paddingTop: 12}}/>
        </Card.Content>
      </Card>

      <ArticleImageModal
        visible={imageModalVisible}
        selectedImage={{ uri: img.image.source, alt: img.title || 'Featured Picture' }}
        onClose={() => setImageModalVisible(false)}
      />
    </>
  );
}
