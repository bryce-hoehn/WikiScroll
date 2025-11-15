import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import themesData from '../themes.json';

// Storage keys
const THEME_STORAGE_KEY = 'wikipediaexpo_theme_preference';

// Theme types
export type ThemeType = 'automatic' | 'light' | 'dark' | 'light-medium-contrast' | 'light-high-contrast' | 'dark-medium-contrast' | 'dark-high-contrast';

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to convert JSON theme to MD3 theme format
const createMD3Theme = (scheme: any, isDark: boolean) => {
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: scheme.primary,
      onPrimary: scheme.onPrimary,
      primaryContainer: scheme.primaryContainer,
      onPrimaryContainer: scheme.onPrimaryContainer,
      secondary: scheme.secondary,
      onSecondary: scheme.onSecondary,
      secondaryContainer: scheme.secondaryContainer,
      onSecondaryContainer: scheme.onSecondaryContainer,
      tertiary: scheme.tertiary,
      onTertiary: scheme.onTertiary,
      tertiaryContainer: scheme.tertiaryContainer,
      onTertiaryContainer: scheme.onTertiaryContainer,
      error: scheme.error,
      onError: scheme.onError,
      errorContainer: scheme.errorContainer,
      onErrorContainer: scheme.onErrorContainer,
      background: scheme.background,
      onBackground: scheme.onBackground,
      surface: scheme.surface,
      onSurface: scheme.onSurface,
      surfaceVariant: scheme.surfaceVariant,
      onSurfaceVariant: scheme.onSurfaceVariant,
      outline: scheme.outline,
      outlineVariant: scheme.outlineVariant,
      shadow: scheme.shadow,
      scrim: scheme.scrim,
      inverseSurface: scheme.inverseSurface,
      inverseOnSurface: scheme.inverseOnSurface,
      inversePrimary: scheme.inversePrimary,
      elevation: {
        level0: 'transparent',
        level1: scheme.surfaceContainerLowest || (isDark ? '#1D2024' : '#F3F3FA'),
        level2: scheme.surfaceContainerLow || (isDark ? '#282A2F' : '#EDEDF4'),
        level3: scheme.surfaceContainer || (isDark ? '#33353A' : '#E7E8EE'),
        level4: scheme.surfaceContainerHigh || (isDark ? '#37393E' : '#E2E2E9'),
        level5: scheme.surfaceContainerHighest || (isDark ? '#3C3E43' : '#DCDCE3'),
      },
    },
  };
};

// Create themes from JSON data (static - created once)
const themes = {
  'light': createMD3Theme(themesData.schemes.light, false),
  'light-medium-contrast': createMD3Theme(themesData.schemes['light-medium-contrast'], false),
  'light-high-contrast': createMD3Theme(themesData.schemes['light-high-contrast'], false),
  'dark': createMD3Theme(themesData.schemes.dark, true),
  'dark-medium-contrast': createMD3Theme(themesData.schemes['dark-medium-contrast'], true),
  'dark-high-contrast': createMD3Theme(themesData.schemes['dark-high-contrast'], true),
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('automatic');

  // Load theme preference from storage on component mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          // Use saved preference if available
          setCurrentTheme(savedTheme as ThemeType);
        } else {
          // If no saved preference, default to automatic
          setCurrentTheme('automatic');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        // Fallback to dark theme on error
        setCurrentTheme('dark');
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  const setTheme = async (theme: ThemeType) => {
    setCurrentTheme(theme);
    
    // Save theme preference to storage
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Determine the actual theme to use (handle automatic mode)
  const effectiveTheme = currentTheme === 'automatic'
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : currentTheme;
  
  const theme = themes[effectiveTheme];

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
