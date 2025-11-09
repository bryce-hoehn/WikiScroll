import { WtfArticleLink } from '@/types/third-party/wtf-article';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React from 'react';
import { Text, useTheme } from 'react-native-paper';

interface TextWithLinksRendererProps {
  text: string;
  links: WtfArticleLink[];
}

export default function TextWithLinksRenderer({ text, links }: TextWithLinksRendererProps) {
  const theme = useTheme();

  if (!links || links.length === 0) {
    return <Text>{text}</Text>;
  }

  const parts = [];
  let currentText = text;
  
  // Sort links by position to process them in order
  const sortedLinks = [...links].sort((a, b) => 
    text.indexOf(a.text || '') - text.indexOf(b.text || '')
  );

  sortedLinks.forEach((link: any) => {
    const linkIndex = currentText.indexOf(link.text);
    if (linkIndex !== -1) {
      // Add text before the link
      if (linkIndex > 0) {
        parts.push(
          <Text key={`${parts.length}-before`}>
            {currentText.substring(0, linkIndex)}
          </Text>
        );
      }
      
      // Handle link press based on link type
      const handleLinkPress = () => {
        if (link.type === 'external') {
          // For external links, open the raw URL directly
          Linking.openURL(link.page);
        } else {
          // For internal links, navigate to the article
          router.push(`/(zArticleStack)/${link.page}`);
        }
      };
      
      // Add the clickable link
      parts.push(
        <Text 
          key={`${parts.length}-link`}
          style={{ color: theme.colors.primary }}
          onPress={handleLinkPress}
        >
          {link.text}
        </Text>
      );
      
      // Update current text to remaining text after the link
      currentText = currentText.substring(linkIndex + link.text.length);
    }
  });
  
  // Add any remaining text
  if (currentText.length > 0) {
    parts.push(
      <Text key={`${parts.length}-after`}>
        {currentText}
      </Text>
    );
  }
  
  // Add a space at the end of the sentence
  return <Text selectable>{parts}{' '}</Text>;
}
