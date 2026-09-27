import * as stylex from '@stylexjs/stylex';

// Site-only values: the docs chrome needs them, no registry component does,
// so they stay out of the registry's scales.
export const docs = stylex.defineConsts({
  /** An Example's Preview panel never collapses below this. */
  previewMinHeight: '10rem',
});
