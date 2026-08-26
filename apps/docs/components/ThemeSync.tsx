import { useEffect } from 'react';

import * as stylex from '@stylexjs/stylex';

import { darkTheme } from '@/lib/themes';

/**
 * Keeps the StyleX dark theme in sync with the docs theme. Inline example
 * previews (and their portaled popups) live in the main document, so the
 * theme class must sit on <html> — mirroring Blume's data-theme attribute.
 */
export default function ThemeSync() {
  useEffect(() => {
    const html = document.documentElement;
    const classes = (stylex.props(darkTheme).className ?? '')
      .split(' ')
      .filter(Boolean);
    const apply = () => {
      const dark = html.dataset.theme === 'dark';
      for (const c of classes) html.classList.toggle(c, dark);
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return null;
}
