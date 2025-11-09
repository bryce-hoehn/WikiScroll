import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

// Storage keys
const THEME_STORAGE_KEY = 'wikipediaexpo_theme_dark';

interface ThemeContextType {
  isThemeDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create custom dark theme
const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#0A0A0A', // Very dark charcoal, not pure black
    surface: '#121212', // Slightly lighter than background for bottom bar
    onSurface: '#FFFFFF', // Controls card text color (white)
    onSurfaceVariant: '#B0B0B0', // Controls card icon color (softer gray)
    primary: '#29B6F6',
    surfaceVariant: '#1E1E1E', // For cards and elevated surfaces
    outline: '#333333', // Border color
    elevation: {
      level0: 'transparent',
      level1: '#1A1A1A', // Dark gray for cards
      level2: '#242424', // Slightly lighter for higher elevation
      level3: '#2D2D2D',
      level4: '#363636',
      level5: '#3F3F3F',
    }
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isThemeDark, setIsThemeDark] = useState(systemColorScheme === 'dark');

  // Load theme preference from storage on component mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          // Use saved preference if available
          setIsThemeDark(JSON.parse(savedTheme));
        } else {
          // If no saved preference, use system preference
          setIsThemeDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        // Fallback to system preference on error
        setIsThemeDark(systemColorScheme === 'dark');
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const newThemeState = !isThemeDark;
    setIsThemeDark(newThemeState);
    
    // Save theme preference to storage
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newThemeState));
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const theme = isThemeDark ? customDarkTheme : MD3LightTheme;

  return (
    <ThemeContext.Provider value={{ isThemeDark, toggleTheme }}>
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
