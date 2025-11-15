import React from 'react';
import { ThemeType, useThemeContext } from './ThemeProvider';

interface PreferencesContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const PreferencesContext = React.createContext<PreferencesContextType>({
  currentTheme: 'automatic',
  setTheme: () => {},
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme, setTheme } = useThemeContext();
  
  return (
    <PreferencesContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
}
