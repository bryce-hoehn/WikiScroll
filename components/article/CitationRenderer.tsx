import React, { useState } from 'react';
import { View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { WtfArticleTemplate } from '../../types/third-party/wtf-article';

interface CitationRendererProps {
  templates: WtfArticleTemplate[];
}

const CitationRenderer = React.memo(function CitationRenderer({ 
  templates 
}: CitationRendererProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Filter citation templates
  const citationTemplates = templates.filter(template => 
    template.name === 'citation' || template.name === 'cite'
  );

  if (citationTemplates.length === 0) {
    return null;
  }

  return (
    <List.Accordion
      title="References"
      titleStyle={{ fontSize: 16, fontWeight: '600' }}
      expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      style={{ marginTop: 16, marginBottom: 16 }}
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
        {citationTemplates.map((template, index) => (
          <View 
            key={`citation-${index}`}
            style={{ 
              flexDirection: 'row',
              borderBottomWidth: index < citationTemplates.length - 1 ? 1 : 0,
              borderBottomColor: theme.colors.outlineVariant,
              minHeight: 44,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text 
              style={{ 
                fontWeight: '600',
                fontSize: 14,
                color: theme.colors.primary,
                marginRight: 8,
              }}
            >
              [{index + 1}]
            </Text>
            <View style={{ flex: 1 }}>
              {Object.entries(template.data).map(([key, value]) => (
                <Text 
                  key={key}
                  variant="bodyMedium"
                  style={{ 
                    color: theme.colors.onSurfaceVariant,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ fontWeight: '600' }}>
                    {key.replace(/_/g, ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}:
                  </Text>{' '}
                  {String(value)}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </List.Accordion>
  );
});

export default CitationRenderer;
