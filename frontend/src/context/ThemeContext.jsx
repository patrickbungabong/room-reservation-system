import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'room-reservation-theme';

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
