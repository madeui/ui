import * as stylex from '@stylexjs/stylex';

// Landing-only values: the marketing page's column, display type and brand
// sizes. No registry component and no docs page uses them.

/** The page column and the measures inside it. */
export const landing = stylex.defineConsts({
  /** The column between the two dashed rails. */
  column: '80rem',
  /** Headline measure: two balanced lines at the display size. */
  headlineMeasure: '18ch',
  /** The hero's sub line. */
  subMeasure: '58ch',
  /** A principle's body text. */
  principleMeasure: '42ch',
  /** The footer's brand blurb. */
  brandMeasure: '36ch',
  /** The search trigger grows into a field from lg. */
  searchWidth: '14rem',
  /** The scenes' fixed stage from lg: every screen is composed to fit it. */
  stage: '46rem',
});

/**
 * The landing's media queries besides the breakpoints: hover effects only
 * where a fine pointer can hover, and motion switched off on request.
 */
export const media = stylex.defineConsts({
  hover: '@media (hover: hover) and (pointer: fine)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
});

/** The hero headline: a display size with no place on the control type scale. */
export const display = stylex.defineConsts({
  size: 'clamp(2.375rem, 5.4vw, 3.75rem)',
  tracking: '-0.04em',
  /** The period after the headline, drawn as a square dot. */
  dot: '0.12em',
  dotGap: '0.04em',
});

/** Tracking of the landing's smaller headings: tight from lg type up, snug at base size. */
export const tracking = stylex.defineConsts({
  tight: '-0.02em',
  snug: '-0.01em',
});

/** Brand marks, by height. */
export const brand = stylex.defineConsts({
  footerLockup: '2.25rem',
  signature: '6rem',
});
