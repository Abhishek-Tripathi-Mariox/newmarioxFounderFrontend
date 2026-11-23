// Light / dark / system theme, stored per browser. The partner stylesheet reads .pp-root[data-theme]
// (in the Next app this was :root[data-theme]; scoping it keeps the internal portal untouched).
import { useEffect, useState } from 'react';

export const THEME_KEY = 'mariox.theme';
const THEME_EVENT = 'mariox-theme';

export function getTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'light' || t === 'dark' ? t : 'system';
  } catch {
    return 'system';
  }
}

export function setTheme(t) {
  try {
    if (t === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, t);
  } catch {
    // Private mode / blocked storage: the choice still applies to this page view.
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: t }));
}

/**
 * The current theme choice, kept in sync with setTheme() calls from anywhere in the app.
 * Read synchronously on first render, so the saved theme applies before first paint (no flash).
 */
export function useTheme() {
  const [theme, set] = useState(getTheme);
  useEffect(() => {
    const sync = (e) => set(e.detail ?? getTheme());
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);
  return theme;
}
