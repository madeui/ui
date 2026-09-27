import type { ShikiTransformer } from 'shiki';

// Build-time highlighting, shared by the fences in MDX (rehype, see
// source.config.ts) and the Code tab of an Example (components/site/
// component-preview.tsx). Both themes land in CSS variables on every token
// (--shiki-light / --shiki-dark, no default color); globals.css picks one
// through light-dark(), so the page's color-scheme decides. No client
// highlighter.
export const codeThemes = {
  themes: { light: 'github-light', dark: 'github-dark' },
  defaultColor: false,
} as const;

/** Puts the fence's language on `<pre data-language>`: the code block's label. */
export const transformerLanguage: ShikiTransformer = {
  name: 'madeui:language',
  pre(node) {
    node.properties['data-language'] = this.options.lang;
  },
};
