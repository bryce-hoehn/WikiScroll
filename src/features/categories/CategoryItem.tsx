import { SPACING } from '@/constants/spacing';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Card, MD3Theme, Text } from 'react-native-paper';

export default function CategoryItem({
  item,
  cardHeight,
  theme
}: {
  item: [string, any];
  cardHeight: number;
  theme: MD3Theme;
}) {
  return (
    <Card
      style={{
        flex: 1,
        margin: SPACING.sm,
        borderRadius: theme.roundness * 3,
        overflow: 'hidden'
      }}
      onPress={() => router.push(`/subcategory/${encodeURIComponent(item[0])}`)}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${item[0]} category`}
      accessibilityHint={`Opens articles in the ${item[0]} category`}
    >
      <ImageBackground
        source={item[1]}
        style={{
          height: cardHeight,
          width: '100%',
          borderRadius: theme.roundness * 3
        }}
        alt={`${item[0]} category image`}
        accessibilityLabel={`${item[0]} category`}
        accessibilityHint={`Image representing the ${item[0]} category`}
      >
        <View
          style={{
            backgroundColor: '#000000c0',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            variant="titleLarge"
            style={{
              fontWeight: '700',
              color: '#FFFFFF', // Always white for contrast with image background,
              textAlign: 'center',
              paddingHorizontal: SPACING.sm
            }}
            numberOfLines={2}
            accessibilityRole="text"
          >
            {item[0]}
          </Text>
        </View>
      </ImageBackground>
    </Card>
  );
}
