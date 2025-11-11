import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { WtfArticleReference } from '../../types/third-party/wtf-article';

interface InlineCitationRendererProps {
  references: WtfArticleReference[];
}

const InlineCitationRenderer = React.memo(function InlineCitationRenderer({ 
  references 
}: InlineCitationRendererProps) {
  const theme = useTheme();

  if (references.length === 0) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
      {references.map((reference, index) => (
        <Text 
          key={`inline-citation-${index}`}
          style={{ 
            color: theme.colors.primary,
            fontWeight: '600',
            fontSize: 12,
            marginRight: 8,
            marginBottom: 4,
            backgroundColor: theme.colors.surfaceVariant,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
          }}
        >
          [{index + 1}]
        </Text>
      ))}
    </View>
  );
});

export default InlineCitationRenderer;
