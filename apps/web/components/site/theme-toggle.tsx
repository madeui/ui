'use client';

import { useSyncExternalStore } from 'react';

import * as stylex from '@stylexjs/stylex';
import { Moon, Sun } from 'lucide-react';

import { THEME_STORAGE_KEY } from '@/components/site/theme-script';
import { Button } from '@/components/ui/button';
import { icon } from '@/lib/stylex-utils';
import { radius } from '@/lib/tokens.stylex';

// The toggle writes `data-theme` on <html> and localStorage in its click
// handler; the icon reads the attribute through useSyncExternalStore. No
// effect, no cookie: the pre-paint script (theme-script.ts) restores the
// choice on load.

type Theme = 'light' | 'dark';

const CHANGE = 'themechange';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function current(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function subscribe(onChange: () => void) {
  const os = matchMedia(DARK_QUERY);
  window.addEventListener(CHANGE, onChange);
  os.addEventListener('change', onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    os.removeEventListener('change', onChange);
  };
}

function apply(theme: Theme) {
  const root = document.documentElement;
  // Hover transitions would animate every color through the flip: switch
  // them off (globals.css), let the new colors resolve, switch them back on.
  root.dataset.themeSwitching = '';
  root.dataset.theme = theme;
  void getComputedStyle(root).colorScheme;
  delete root.dataset.themeSwitching;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
  window.dispatchEvent(new Event(CHANGE));
}

/** The server knows no theme: the icon slot stays empty until hydration. */
const serverSnapshot = () => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, current, serverSnapshot);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      onClick={() => apply(current() === 'dark' ? 'light' : 'dark')}
      style={styles.round}
    >
      {theme === 'dark' ? (
        <Moon {...stylex.props(icon.md)} />
      ) : theme === 'light' ? (
        <Sun {...stylex.props(icon.md)} />
      ) : (
        <span {...stylex.props(icon.md)} />
      )}
    </Button>
  );
}

const styles = stylex.create({
  round: {
    borderRadius: radius.full,
  },
});
