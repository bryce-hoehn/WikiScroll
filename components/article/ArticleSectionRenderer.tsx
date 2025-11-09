import { ImageThumbnail } from '@/types';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { WtfArticleListItem, WtfArticleSection } from '../../types/third-party/wtf-article';
import CitationRenderer from './CitationRenderer';
import InlineCitationRenderer from './InlineCitationRenderer';
import MediaPlayer from './MediaPlayer';
import TextWithLinksRenderer from './TextWithLinksRenderer';
import WorksRenderer from './WorksRenderer';

interface ArticleSectionRendererProps {
  section: WtfArticleSection;
  index: number;
  thumbnail?: ImageThumbnail;
  onImagePress: (imageUri: string, alt?: string) => void;
}

// Component to render infobox table
const InfoboxRenderer = React.memo(function InfoboxRenderer({ 
  infoboxes 
}: { 
  infoboxes: any[] 
}) {
  const theme = useTheme();
  const [infoboxExpanded, setInfoboxExpanded] = useState(false);

  if (!infoboxes || infoboxes.length === 0) {
    return null;
  }

  return (
    <List.Accordion
      title="Infobox"
      titleStyle={{ fontSize: 16, fontWeight: '600' }}
      expanded={infoboxExpanded}
      onPress={() => setInfoboxExpanded(!infoboxExpanded)}
      style={{ marginBottom: 16 }}
    >
      <View style={{ 
        backgroundColor: theme.colors.surface, 
        borderRadius: 12, 
        margin: 8,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}>
        {Object.entries(infoboxes[0]).map(([key, value]) => {
          // Skip the 'type' property, image-related properties, and any non-object values
          const skipKeys = ['type', 'image', 'alt', 'caption'];
          if (skipKeys.includes(key) || typeof value !== 'object' || value === null || !(value as any).text) {
            return null;
          }
          
          const valueObj = value as any;
          
          // Capitalize first letter and replace underscores with spaces
          const formattedKey = key.replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          return (
            <View 
              key={`infobox-${key}`}
              style={{ 
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.outlineVariant,
                minHeight: 52,
              }}
            >
              <View 
                style={{ 
                  flex: 1,
                  backgroundColor: theme.colors.surfaceVariant,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  justifyContent: 'center',
                  borderTopLeftRadius: key === Object.keys(infoboxes[0])[1] ? 0 : 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <Text 
                  style={{ 
                    fontWeight: '600',
                    fontSize: 14,
                    color: theme.colors.onSurfaceVariant,
                  }}
                >
                  {formattedKey}
                </Text>
              </View>
              <View 
                style={{ 
                  flex: 2,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  justifyContent: 'center',
                  backgroundColor: theme.colors.surface,
                  borderTopRightRadius: key === Object.keys(infoboxes[0])[1] ? 0 : 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <TextWithLinksRenderer 
                  text={valueObj.text} 
                  links={valueObj.links || []}
                />
              </View>
            </View>
          );
        }).filter(Boolean)}
      </View>
    </List.Accordion>
  );
});

// Component to render paragraphs with optional citations
const ParagraphsRenderer = React.memo(function ParagraphsRenderer({ 
  paragraphs, 
  templates 
}: { 
  paragraphs: any[];
  templates: any[];
}) {
  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }

  return (
    <>
      {paragraphs.map((paragraph: any, i: number) => (
        <View key={i}>
          <Text 
            variant="bodyLarge" 
            selectable
            style={{ 
              marginBottom: 16,
              paddingHorizontal: 16,
              lineHeight: 24
            }}
          >
            {paragraph.sentences?.map((sentence: any) => (
              <TextWithLinksRenderer 
                key={sentence.text} 
                text={sentence.text} 
                links={sentence.links} 
              />
            ))}
          </Text>
          {/* Show inline citations after the paragraph if this section has citation templates */}
          {templates.length > 0 && paragraphs && i === paragraphs.length - 1 && (
            <InlineCitationRenderer templates={templates} />
          )}
        </View>
      ))}
    </>
  );
});

// Component to render lists
const ListsRenderer = React.memo(function ListsRenderer({ 
  lists, 
  sectionTitle 
}: { 
  lists: WtfArticleListItem[][];
  sectionTitle: string;
}) {
  if (!lists || lists.length === 0) {
    return null;
  }

  return (
    <>
      {lists.map((list: WtfArticleListItem[], i: number) => (
        <React.Fragment key={`${sectionTitle}-list-${i}`}>
          {list?.map((li: WtfArticleListItem, j: number) => (
            <List.Item
              key={`${sectionTitle}-list-${i}-item-${j}-${li.text.substring(0, 20)}`}
              title={<TextWithLinksRenderer text={li.text} links={li.links || []} />}
              titleNumberOfLines={6}
              left={(props: any) => <List.Icon {...props} icon="circle-small" />}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
});

const ArticleSectionRenderer = React.memo(function ArticleSectionRenderer({ 
  section, 
  index, 
  thumbnail, 
  onImagePress, 
}: ArticleSectionRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const hasImages = section.images && section.images.length > 0;
  const hasParagraphs = section.paragraphs && section.paragraphs.length > 0;
  const hasContent = hasImages || hasParagraphs;

  const infoboxes = section.infoboxes || [];
  const templates = section.templates || [];
  const paragraphs = section.paragraphs || [];
  const lists = section.lists || [];

  if (index === 0) {
    return (
      <>
        {thumbnail && (
          <TouchableOpacity onPress={() => onImagePress(thumbnail.source)}>
            <Image
              source={{ uri: thumbnail.source }}
              style={{ 
                width: "100%",
                height: 400,
              }}
            />
          </TouchableOpacity>
        )}
        <InfoboxRenderer infoboxes={infoboxes} />
        <ParagraphsRenderer paragraphs={paragraphs} templates={templates} />
        <CitationRenderer templates={templates} />
      </>
    );
  }

  if (!section.title || !section.title.trim() || !hasContent) {
    return null;
  }

  return (
    <List.Accordion
      title={section.title.trim()}
      titleStyle={{ fontSize: 16, fontWeight: '600' }}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
    >
      {section.images && section.images.length > 0 && (
        <MediaPlayer
          media={section.images[0]}
          onImagePress={onImagePress}
        />
      )}
      <ParagraphsRenderer 
        paragraphs={paragraphs} 
        templates={templates} 
      />
      <ListsRenderer 
        lists={lists} 
        sectionTitle={section.title.trim()} 
      />
      <CitationRenderer templates={templates} />
      <WorksRenderer references={section.references || []} />
    </List.Accordion>
  );
});

export default ArticleSectionRenderer;
