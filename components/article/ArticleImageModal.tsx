import { Image } from 'expo-image';
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ArticleImageModalProps {
  visible: boolean;
  selectedImage: { uri: string; alt?: string } | null;
  onClose: () => void;
}

export default function ArticleImageModal({ 
  visible, 
  selectedImage, 
  onClose 
}: ArticleImageModalProps) {
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
        <Appbar.Header style={{ backgroundColor: 'transparent' }}>
          <Appbar.Action 
            icon="close" 
            onPress={onClose}
            color="white"
          />
          <Appbar.Content 
            title={selectedImage?.alt || 'Image'} 
            titleStyle={{ color: 'white' }}
          />
        </Appbar.Header>
        
        <TouchableOpacity 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          onPress={onClose}
          activeOpacity={1}
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.uri }}
              style={{ 
                width: '100%', 
                height: '80%',
                resizeMode: 'contain'
              }}
            />
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}
