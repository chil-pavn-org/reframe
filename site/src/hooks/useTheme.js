import { useCallback, useEffect, useState } from 'react';
import { getThemeFromDocument, setTheme, THEME_KEY } from '../lib/theme';

export function useTheme() {
  const [theme, setThemeState] = useState(() =>
    typeof document !== 'undefined' ? getThemeFromDocument() : 'light'
  );

  useEffect(() => {
    setThemeState(getThemeFromDocument());
  }, []);

  const updateTheme = useCallback((mode) => {
    setTheme(mode);
    setThemeState(mode);
  }, []);

  const toggle = useCallback(() => {
    updateTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, updateTheme]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== THEME_KEY || e.newValue == null) return;
      if (e.newValue === 'light' || e.newValue === 'dark') {
        setThemeState(e.newValue);
        document.documentElement.classList.toggle('dark', e.newValue === 'dark');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { theme, setTheme: updateTheme, toggle, isDark: theme === 'dark' };
}
