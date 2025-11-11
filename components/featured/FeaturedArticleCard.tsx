import { useFeaturedContent } from '@/context/FeaturedContentContext';
import { router } from 'expo-router';
import React from 'react';
import { Card } from 'react-native-paper';
import HtmlRenderer from '../common/HtmlRenderer';
import ResponsiveImage from '../common/ResponsiveImage';

export default function FeaturedArticleCard() {
  const { featuredContent } = useFeaturedContent();
  const article = featuredContent?.tfa;

  if (!article) {
    return null;
  }

  return (
    <Card 
      style={{ width: '100%' }}
      onPress={() => router.push(`/(zArticleStack)/${encodeURIComponent(article.normalizedtitle || article.title)}`)}
    >
      {article.thumbnail && (
        <ResponsiveImage 
          source={{ 
            source: article.thumbnail.source, 
            width: article.thumbnail.width || 400, 
            height: article.thumbnail.height || 300 
          }}
          contentFit="cover"
          style={{ borderRadius: 12 }}
        />
      )}
      <Card.Content>
        <HtmlRenderer html={article.extract_html || ''} maxLines={6} style={{paddingTop: 12}}/>
      </Card.Content>
    </Card>
  );
}
