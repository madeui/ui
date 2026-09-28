import * as stylex from '@stylexjs/stylex';

// Site-only color tokens, `light-dark()` pairs like the registry's colors.
// Highlighted tokens carry their own colors (Shiki's --shiki-light/--shiki-dark
// variables, see globals.css); these color what Shiki leaves unstyled.
export const syntax = stylex.defineVars({
  /** Plain code text: the default foreground of the github-light / github-dark themes. */
  foreground: 'light-dark(oklch(0.278 0.012 248.2), oklch(0.918 0.006 255.5))',
});
