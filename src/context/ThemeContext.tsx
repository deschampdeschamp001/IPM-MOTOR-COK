import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDominantColor, applyDominantColor, subscribeToDominantColor, DEFAULT_DOMINANT_COLOR } from '../lib/themeColor';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  dominantColor: string;
  setDominantColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('ipm_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return 'light'; // Default light luxury mode as requested
  });

  const [dominantColor, setDominantColorState] = useState<string>(() => getDominantColor());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('ipm_theme', theme);
  }, [theme]);

  // Initialize and subscribe to dominant color changes
  useEffect(() => {
    applyDominantColor(dominantColor);
    const unsubscribe = subscribeToDominantColor((newColor) => {
      setDominantColorState(newColor);
    });
    return () => unsubscribe();
  }, [dominantColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setDominantColor = (color: string) => {
    setDominantColorState(color);
    applyDominantColor(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark', dominantColor, setDominantColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
