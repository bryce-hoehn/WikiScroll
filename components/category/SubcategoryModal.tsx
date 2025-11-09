import React from 'react';
import { FlatList, View } from 'react-native';
import { List, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { CategorySubcategory } from '../../types/api';

interface SubcategoryModalProps {
  visible: boolean;
  onDismiss: () => void;
  subcategories: CategorySubcategory[];
  onSubcategoryPress: (subcategoryTitle: string) => void;
  title: string;
}

export default function SubcategoryModal({
  visible,
  onDismiss,
  subcategories,
  onSubcategoryPress,
  title,
}: SubcategoryModalProps) {
  const theme = useTheme();

  const renderSubcategoryItem = (subcategory: CategorySubcategory) => (
    <List.Item
      key={subcategory.title}
      title={subcategory.title.replace(/_/g, ' ')}
      left={props => <List.Icon {...props} icon="folder-outline" />}
      onPress={() => {
        onSubcategoryPress(subcategory.title);
        onDismiss();
      }}
      style={{ paddingVertical: 8 }}
    />
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          margin: 20,
          borderRadius: 12,
          maxHeight: '80%',
        }}
      >
        <View style={{ padding: 16 }}>
          <Text variant="titleLarge" style={{ fontWeight: '600', marginBottom: 16 }}>
            Subcategories in "{title}"
          </Text>
          <FlatList
            data={subcategories}
            renderItem={({ item }) => renderSubcategoryItem(item)}
            keyExtractor={(item) => item.title}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </Portal>
  );
}
