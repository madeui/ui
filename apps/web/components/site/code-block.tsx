import { isValidElement, type ComponentProps, type ReactNode } from 'react';

import * as stylex from '@stylexjs/stylex';

import { CopyButton } from '@/components/site/copy-button';
import { syntax } from '@/components/site/site-tokens.stylex';
import { font, prose } from '@/components/site/site.stylex';
import { fontSize, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

/** The label a fence's language shows as. */
const languageLabels: Record<string, string> = {
  bash: 'Bash',
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  md: 'Markdown',
  mdx: 'MDX',
  plaintext: 'Text',
  sh: 'Shell',
  shell: 'Shell',
  ts: 'TypeScript',
  tsx: 'TSX',
  txt: 'Text',
  yaml: 'YAML',
  yml: 'YAML',
  zsh: 'Zsh',
};

type CodeBlockProps = Omit<ComponentProps<'pre'>, 'className' | 'style'> & {
  'data-language'?: string;
  /** Flush inside a frame that draws its own border (the Code tab). */
  flush?: boolean;
};

/**
 * A highlighted code block: the `<pre>` Shiki renders at build (fences via
 * rehype, the Code tab via site/shiki.ts), with a language label when the
 * fence names one, and a copy button. Shiki's own class and inline style are
 * dropped: the block styles itself, and each token's colors stay in its
 * --shiki-light / --shiki-dark variables (see globals.css).
 */
export function CodeBlock({ children, 'data-language': language, flush = false }: CodeBlockProps) {
  const label = language === undefined ? undefined : (languageLabels[language] ?? language);
  // Shiki renders <pre><code>…lines…</code></pre>; the block renders its own
  // <code> around the lines, so the prose map's `code` (inline code) never
  // styles a code block.
  const lines: ReactNode = isValidElement<{ children?: ReactNode }>(children) ? children.props.children : children;
  return (
    <figure {...stylex.props(styles.root, flush && styles.flush)}>
      {label === undefined ? null : <figcaption {...stylex.props(styles.label)}>{label}</figcaption>}
      <pre data-language={language} {...stylex.props(styles.pre)}>
        <code {...stylex.props(styles.code)}>{lines}</code>
      </pre>
      <CopyButton style={[styles.copy, label === undefined && styles.copyWithoutLabel]} />
    </figure>
  );
}

const styles = stylex.create({
  root: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    marginBlock: space.s6,
    overflow: 'hidden',
    position: 'relative',
  },
  flush: {
    borderStyle: 'none',
    borderRadius: 0,
    marginBlock: 0,
  },
  label: {
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: stroke.border,
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.control,
    paddingBlock: space.s2,
    paddingInline: space.s4,
  },
  // The type sits on <pre> so the line box follows the code size; <code>
  // repeats the face because the reset gives <code> its own.
  pre: {
    color: syntax.foreground,
    fontFamily: font.mono,
    fontSize: prose.code,
    lineHeight: lineHeight.normal,
    overflowX: 'auto',
    paddingBlock: space.s4,
    paddingInline: space.s5,
  },
  code: {
    fontFamily: font.mono,
  },
  copy: {
    insetInlineEnd: space.s1,
    position: 'absolute',
    top: space.s1,
  },
  copyWithoutLabel: {
    insetInlineEnd: space.s2,
    top: space.s2,
  },
});
