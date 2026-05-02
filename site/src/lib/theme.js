export const THEME_KEY = 'reframe-theme';

/** @returns {'light' | 'dark'} */
export function getThemeFromDocument() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** @param {'light' | 'dark'} mode */
export function applyTheme(mode) {
  const dark = mode === 'dark';
  document.documentElement.classList.toggle('dark', dark);
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    // ignore
  }
}

/** @param {'light' | 'dark'} mode */
export function setTheme(mode) {
  applyTheme(mode);
}
