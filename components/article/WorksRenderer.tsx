import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

interface WorksRendererProps {
  references: any[];
}

const WorksRenderer = React.memo(function WorksRenderer({ 
  references 
}: WorksRendererProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Filter citation references (works)
  const workReferences = references.filter(ref => 
    ref.template === 'citation' || ref.template === 'cite book'
  );

  if (workReferences.length === 0) {
    return null;
  }

  return (
    <List.Accordion
      title="Works"
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
        {workReferences.map((work, index) => (
          <View 
            key={`work-${index}`}
            style={{ 
              borderBottomWidth: index < workReferences.length - 1 ? 1 : 0,
              borderBottomColor: theme.colors.outlineVariant,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            {/* Title */}
            {work.title && (
              <Text 
                variant="bodyLarge"
                style={{ 
                  fontWeight: '600',
                  color: theme.colors.onSurface,
                  marginBottom: 4,
                }}
              >
                {work.title}
              </Text>
            )}
            
            {/* Author/Editor */}
            {(work.editor || work.author) && (
              <Text 
                variant="bodyMedium"
                style={{ 
                  color: theme.colors.onSurfaceVariant,
                  marginBottom: 2,
                }}
              >
                {work.editor ? `Edited by ${work.editor}` : `By ${work.author}`}
              </Text>
            )}
            
            {/* Publication details */}
            <Text 
              variant="bodySmall"
              style={{ 
                color: theme.colors.onSurfaceVariant,
                marginBottom: 2,
              }}
            >
              {work.year && `${work.year}`}
              {work.location && work.publisher && ` • ${work.location}: ${work.publisher}`}
              {work.location && !work.publisher && ` • ${work.location}`}
              {!work.location && work.publisher && ` • ${work.publisher}`}
            </Text>
            
            {/* URL link if available */}
            {work.url && (
              <Text 
                variant="bodySmall"
                style={{ 
                  color: theme.colors.primary,
                  textDecorationLine: 'underline',
                }}
                onPress={() => Linking.openURL(work.url)}
              >
                View online
              </Text>
            )}
          </View>
        ))}
      </View>
    </List.Accordion>
  );
});

export default WorksRenderer;
