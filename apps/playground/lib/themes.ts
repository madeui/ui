import * as stylex from '@stylexjs/stylex';

import { colors } from './tokens.stylex';

// Light and dark mode live in the tokens themselves: every color in
// `tokens.stylex.ts` is a `light-dark(light, dark)` pair, and the browser
// picks a side from the CSS `color-scheme` of the element. There is no dark
// theme to apply; set the scheme on <html> instead.
//
// `colorScheme` follows the OS by default. `data-theme="light"` or
// `data-theme="dark"` on the same element forces a mode (a manual toggle
// writes that attribute). Apply it to <html>, not a wrapper: dialogs and
// popovers portal to <body> and inherit the scheme from there. Scrollbars and
// native form controls follow it too.
//
//   <html {...stylex.props(colorScheme)}>
//
// Keep `color-scheme` in this CSS rule, never in an inline style: bundlers
// that lower `light-dark()` for older browsers (Next.js, LightningCSS) only
// see `color-scheme` set by stylesheet rules.
//
// `page` gives <body> the page colors from the tokens. It goes on <body>,
// not <html>: while <html> has no background, the body background fills the
// whole viewport, and a StyleX class on <body> wins over `body { background:
// … }` rules in @layer base, below every StyleX rule. Font smoothing is left
// to the app: it is a per-platform rendering choice, not a token.
//
//   <html {...stylex.props(colorScheme)}>
//     <body {...stylex.props(page)}>
const styles = stylex.create({
  colorScheme: {
    colorScheme: {
      default: 'light dark',
      '[data-theme="light"]': 'light',
      '[data-theme="dark"]': 'dark',
    },
  },
  page: {
    backgroundColor: colors.background,
    color: colors.foreground,
  },
});

export const colorScheme = styles.colorScheme;
export const page = styles.page;

// Brand or accent themes are `stylex.createTheme` calls over the same tokens.
// Values can be `light-dark()` pairs too, so a theme works in both modes:
//
//   export const brandTheme = stylex.createTheme(colors, {
//     primary: 'light-dark(oklch(0.55 0.2 260), oklch(0.7 0.16 260))',
//   });
//
// Themes are static by design: StyleX resolves `createTheme` at compile time,
// so add variations by writing more `createTheme` calls here, not by
// computing them at runtime. Apply one theme per element; two themes of the
// same token group on one element do not merge (the last one applied wins
// for the whole group). A theme on a nested element overrides the one above.
