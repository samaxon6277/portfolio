import React, { createContext, useContext, useEffect } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    document.body.style.backgroundColor = '#FAF8F5';
    document.body.style.color = '#1D1D1F';
    try {
      localStorage.setItem('samaxon_theme', 'light');
    } catch {
      // Ignore
    }
  }, []);

  const toggleTheme = () => {
    // Locked in pure light creamy theme as requested
  };

  const setTheme = () => {
    // Locked in pure light creamy theme as requested
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', isDark: false, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}

