import { JSX } from 'react';
import { View } from 'react-native';
import { ProgressBar, Text, useTheme } from 'react-native-paper';

interface ReadingProgressIndicatorProps {
  readingProgress: number;
}

export default function ReadingProgressIndicator({
  readingProgress
}: ReadingProgressIndicatorProps): JSX.Element {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: 4, marginTop: 0 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2
        }}
      >
        <Text
          variant="labelSmall"
          style={{
            color: theme.colors.onSurfaceVariant
          }}
        >
          Progress
        </Text>
        <Text
          variant="labelSmall"
          style={{
            color: theme.colors.primary,
            fontWeight: '600'
          }}
        >
          {readingProgress}%
        </Text>
      </View>
      <ProgressBar
        progress={readingProgress / 100}
        color={theme.colors.primary}
        style={{ height: 2, borderRadius: theme.roundness * 0.5 }}
      />
    </View>
  );
}
