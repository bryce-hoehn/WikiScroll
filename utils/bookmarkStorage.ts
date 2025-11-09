import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark, OfflineArticle } from '../types/bookmarks';

const BOOKMARKS_KEY = 'bookmarked_articles';
const OFFLINE_ARTICLES_KEY = 'offline_articles';

export class BookmarkStorage {
  static async loadBookmarks(): Promise<Bookmark[]> {
    try {
      const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      return [];
    }
  }

  static async saveBookmarks(bookmarks: Bookmark[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return true;
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
      return false;
    }
  }

  static async loadOfflineArticles(): Promise<Record<string, OfflineArticle>> {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_ARTICLES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load offline articles:', error);
      return {};
    }
  }

  static async saveOfflineArticles(articles: Record<string, OfflineArticle>): Promise<boolean> {
    try {
      await AsyncStorage.setItem(OFFLINE_ARTICLES_KEY, JSON.stringify(articles));
      return true;
    } catch (error) {
      console.error('Failed to save offline articles:', error);
      return false;
    }
  }

  static async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
      await AsyncStorage.removeItem(OFFLINE_ARTICLES_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear bookmarks:', error);
      return false;
    }
  }
}
