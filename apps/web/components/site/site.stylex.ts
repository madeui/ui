import * as stylex from '@stylexjs/stylex';

// Site-only values: the docs chrome needs them, no registry component does,
// so they stay out of the registry's scales. Spacing, type sizes that exist
// on the registry scale, colors, radii and breakpoints come from the registry.

export const docs = stylex.defineConsts({
  /** An Example's Preview panel never collapses below this. */
  previewMinHeight: '10rem',
});

/** The docs grid: sidebar | content | ToC, under a sticky header. */
export const layout = stylex.defineConsts({
  header: '4rem',
  sidebar: '17.5rem',
  content: '42rem',
  toc: '17.5rem',
  /** Height of the header lockup (mark + wordmark scale together). */
  logo: '1.75rem',
});

/**
 * The prose type scale, by role. The title and section sizes are the design
 * decision; the rest reuse the registry's fontSize/lineHeight scales.
 */
export const prose = stylex.defineConsts({
  title: '1.875rem',
  section: '1.25rem',
  /** Code blocks: a step below body text so 80 columns fit the content width. */
  code: '0.8125rem',
  /** Inline code, relative to the text around it (body, heading, table). */
  inlineCode: '0.875em',
  /** Reading line height for body text. */
  leading: '1.7',
  /** Headings tighten their tracking as they grow. */
  tracking: '-0.02em',
});

/**
 * The code face. The sans face (Geist) is set on <html> and inherited;
 * Geist Mono is exposed by next/font as this variable on <html> (app/layout.tsx)
 * and applied where code renders.
 */
export const font = stylex.defineConsts({
  mono: 'var(--font-geist-mono), ui-monospace, monospace',
});

/** The translucent sticky header: background mix and blur behind it. */
export const effects = stylex.defineConsts({
  headerAlpha: '90%',
  headerBlur: 'blur(8px)',
});

/** Sticky chrome sits below the registry's popups (z.popup = 50). */
export const layer = stylex.defineConsts({
  sticky: '40',
});
