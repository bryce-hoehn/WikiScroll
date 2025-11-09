import { useFeaturedContent } from '@/context/FeaturedContentContext';
import React from 'react';
import { Card } from 'react-native-paper';
import HtmlRenderer from '../common/HtmlRenderer';
import ResponsiveImage from '../common/ResponsiveImage';

export default function FeaturedImageCard() {
  const { featuredContent } = useFeaturedContent();
  const img = featuredContent?.image;

  if (!img) {
    return null;
  }

  return (
    <Card 
      style={{ width: '100%' }}
    >
      {img.image && (
        <ResponsiveImage 
          source={{ 
            source: img.image.source, 
            width: img.image.width, 
            height: img.image.height 
          }}
          contentFit="cover"
          style={{ borderRadius: 12 }}
        />
      )}
      <Card.Content>
        <HtmlRenderer html={img.description.html} maxLines={6} style={{paddingTop: 6}}/>
      </Card.Content>
    </Card>
  );
}
