import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { BREAKPOINTS } from '@/constants/breakpoints';
import { SPACING } from '@/constants/spacing';
import CategoryItem from '@/features/categories/CategoryItem';

const rootCategories = {
  'Academic disciplines': require('../../assets/images/categories/Academic disciplines.jpg'),
  Behavior: require('../../assets/images/categories/Behavior.jpg'),
  Business: require('../../assets/images/categories/Business.jpg'),
  Communication: require('../../assets/images/categories/Communication.jpg'),
  Concepts: require('../../assets/images/categories/Concepts.png'),
  Culture: require('../../assets/images/categories/Culture.jpg'),
  Economy: require('../../assets/images/categories/Economy.jpg'),
  Education: require('../../assets/images/categories/Education.jpg'),
  Energy: require('../../assets/images/categories/Energy.jpg'),
  Engineering: require('../../assets/images/categories/Engineering.jpg'),
  Entities: require('../../assets/images/categories/Entities.png'),
  'Food and drink': require('../../assets/images/categories/Food and Drink.jpg'),
  Geography: require('../../assets/images/categories/Geography.jpeg'),
  Government: require('../../assets/images/categories/Government.jpg'),
  Humanities: require('../../assets/images/categories/Humanities.jpg'),
  Information: require('../../assets/images/categories/Information.jpg'),
  Knowledge: require('../../assets/images/categories/Knowledge.jpg'),
  Language: require('../../assets/images/categories/Language.jpg'),
  Law: require('../../assets/images/categories/Law.jpg'),
  Life: require('../../assets/images/categories/Life.jpg'),
  Lists: require('../../assets/images/categories/Lists.png'),
  'Mass media': require('../../assets/images/categories/Mass media.jpg'),
  Mathematics: require('../../assets/images/categories/Mathematics.png'),
  Nature: require('../../assets/images/categories/Nature.jpg'),
  People: require('../../assets/images/categories/People.jpg'),
  Philosophy: require('../../assets/images/categories/Philosophy.jpg'),
  Politics: require('../../assets/images/categories/Politics.jpg'),
  Religion: require('../../assets/images/categories/Religion.png'),
  Science: require('../../assets/images/categories/Science.png'),
  Society: require('../../assets/images/categories/Society.jpg'),
  Technology: require('../../assets/images/categories/Technology.jpg'),
  Time: require('../../assets/images/categories/Time.jpg'),
  Universe: require('../../assets/images/categories/Universe.jpg')
} as const;

export default function CategoriesScreen() {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const renderCategoryItem = useCallback(
    ({ item }: { item: [string, any] }) => (
      <CategoryItem
        item={item}
        cardHeight={width > BREAKPOINTS.lg ? 200 : 100}
        theme={theme}
      />
    ),
    [width, theme]
  );

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={Object.entries(rootCategories)}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item[0]}
        numColumns={width > BREAKPOINTS.lg ? 3 : 2}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingVertical: SPACING.sm,
          flexGrow: 1,
          alignSelf: 'center',
          width: '85%'
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
