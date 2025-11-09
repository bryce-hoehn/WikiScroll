import { Alert } from 'react-native';
import { fetchFeaturedContent } from '../api';
import { FeaturedContent } from '../types/api/featured';

export class FeaturedContentLoader {
  static async loadFeaturedContent(): Promise<FeaturedContent | null> {
    try {
      const content = await fetchFeaturedContent();
      return content.data;
    } catch (error) {
      console.error('Failed to load featured content:', error);
      throw new Error('Failed to load featured content. Please try again later.');
    }
  }

  static showErrorAlert(showAlert: boolean = false) {
    if (showAlert) {
      Alert.alert(
        'Error',
        'Failed to load Wikipedia Main Page content. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  }
}
