import * as stylex from '@stylexjs/stylex';

// Design tokens — the single file users edit to retheme their app.
// Familiar semantic names (background, foreground, muted, accent, ...).
//
// Each color is a `light-dark(light, dark)` pair: the browser picks a side
// from the CSS `color-scheme` in scope, which `colorScheme` in `themes.ts`
// sets on <html>. Edit both sides when you change a color.
//
// Colors use oklch (perceptually uniform; easy to shift lightness/chroma).
// Avoid legacy comma syntax like `rgba(0, 0, 0, 0.5)` — the shadcn CLI's
// transformer mangles comma number lists; `oklch(0% 0 0deg / 50%)` is safe.
//
// There is no font token: components inherit the page's font. Set
// `font-family` on <html> (popups portal to <body> and inherit it too).

export const colors = stylex.defineVars({
  background: 'light-dark(oklch(1 0 0), oklch(0.145 0 0))',
  foreground: 'light-dark(oklch(0.145 0 0), oklch(0.985 0 0))',
  card: 'light-dark(oklch(1 0 0), oklch(0.205 0 0))',
  cardForeground: 'light-dark(oklch(0.145 0 0), oklch(0.985 0 0))',
  popover: 'light-dark(oklch(1 0 0), oklch(0.205 0 0))',
  popoverForeground: 'light-dark(oklch(0.145 0 0), oklch(0.985 0 0))',
  primary: 'light-dark(oklch(0.205 0 0), oklch(0.922 0 0))',
  primaryForeground: 'light-dark(oklch(0.985 0 0), oklch(0.205 0 0))',
  secondary: 'light-dark(oklch(0.97 0 0), oklch(0.269 0 0))',
  secondaryForeground: 'light-dark(oklch(0.205 0 0), oklch(0.985 0 0))',
  muted: 'light-dark(oklch(0.97 0 0), oklch(0.269 0 0))',
  mutedForeground: 'light-dark(oklch(0.556 0 0), oklch(0.708 0 0))',
  accent: 'light-dark(oklch(0.97 0 0), oklch(0.269 0 0))',
  accentForeground: 'light-dark(oklch(0.205 0 0), oklch(0.985 0 0))',
  destructive: 'light-dark(oklch(0.577 0.245 27.325), oklch(0.704 0.191 22.216))',
  destructiveForeground: 'light-dark(oklch(0.985 0 0), oklch(0.205 0 0))',
  border: 'light-dark(oklch(0.922 0 0), oklch(0.269 0 0))',
  input: 'light-dark(oklch(0.922 0 0), oklch(0.325 0 0))',
  ring: 'light-dark(oklch(0.708 0 0), oklch(0.556 0 0))',
  overlay: 'light-dark(oklch(0% 0 0deg / 50%), oklch(0% 0 0deg / 70%))',
  // Categorical series palette for charts (chart.tsx maps these onto the
  // chart library's palette variables). Six slots, in assignment order.
  chart1: 'light-dark(oklch(0.646 0.222 41.116), oklch(0.488 0.243 264.376))',
  chart2: 'light-dark(oklch(0.6 0.118 184.704), oklch(0.696 0.17 162.48))',
  chart3: 'light-dark(oklch(0.398 0.07 227.392), oklch(0.769 0.188 70.08))',
  chart4: 'light-dark(oklch(0.828 0.189 84.429), oklch(0.627 0.265 303.9))',
  chart5: 'light-dark(oklch(0.769 0.188 70.08), oklch(0.645 0.246 16.439))',
  chart6: 'light-dark(oklch(0.55 0.2 300), oklch(0.7 0.15 200))',
});

export const radius = stylex.defineVars({
  // Small chrome that would read as a pill at the next step up: the resize
  // handle's grip, and anything else narrower than 2x this radius.
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.625rem',
  xl: '0.75rem',
  full: '9999px',
});

// Shadows stay hex-alpha: the CLI parses shadow shorthands separately and
// mangles oklch() inside them.
export const shadow = stylex.defineVars({
  sm: '0 1px 2px #0000000d',
  md: '0 4px 8px -2px #0000001a',
  lg: '0 10px 20px -5px #00000026',
});
