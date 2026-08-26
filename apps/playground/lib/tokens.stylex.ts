import * as stylex from '@stylexjs/stylex';

// Design tokens — the single file users edit to retheme their app.
// Familiar semantic names (background, foreground, muted, accent, ...).
// Values are the light theme; `themes.ts` overrides them per theme.

export const colors = stylex.defineVars({
  background: '#ffffff',
  foreground: '#0a0a0a',
  card: '#ffffff',
  cardForeground: '#0a0a0a',
  popover: '#ffffff',
  popoverForeground: '#0a0a0a',
  primary: '#171717',
  primaryForeground: '#fafafa',
  secondary: '#f5f5f5',
  secondaryForeground: '#171717',
  muted: '#f5f5f5',
  mutedForeground: '#737373',
  accent: '#f5f5f5',
  accentForeground: '#171717',
  destructive: '#e7000b',
  destructiveForeground: '#fafafa',
  border: '#e5e5e5',
  input: '#e5e5e5',
  ring: '#a1a1a1',
  overlay: '#00000080',
});

export const radius = stylex.defineVars({
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.625rem',
  xl: '0.75rem',
  full: '9999px',
});

export const font = stylex.defineVars({
  sans: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
});

export const shadow = stylex.defineVars({
  sm: '0 1px 2px #0000000d',
  md: '0 4px 8px -2px #0000001a',
  lg: '0 10px 20px -5px #00000026',
});
