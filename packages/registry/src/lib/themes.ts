import * as stylex from '@stylexjs/stylex';

import { colors } from './tokens.stylex';

// Apply to any subtree: <html {...stylex.props(darkTheme)}> or a wrapper div.
export const darkTheme = stylex.createTheme(colors, {
  background: '#0a0a0a',
  foreground: '#fafafa',
  card: '#171717',
  cardForeground: '#fafafa',
  popover: '#171717',
  popoverForeground: '#fafafa',
  primary: '#fafafa',
  primaryForeground: '#171717',
  secondary: '#262626',
  secondaryForeground: '#fafafa',
  muted: '#262626',
  mutedForeground: '#a1a1a1',
  accent: '#262626',
  accentForeground: '#fafafa',
  destructive: '#ff6467',
  destructiveForeground: '#171717',
  border: '#262626',
  input: '#333333',
  ring: '#737373',
  overlay: 'rgba(0, 0, 0, 0.7)',
});
