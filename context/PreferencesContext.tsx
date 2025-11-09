import React from 'react';
import { useThemeContext } from './ThemeProvider';

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { toggleTheme, isThemeDark } = useThemeContext();
  
  return (
    <PreferencesContext.Provider value={{ toggleTheme, isThemeDark }}>
      {children}
    </PreferencesContext.Provider>
  );
}
