import type { ComponentProps, ReactNode } from 'react';

import * as stylex from '@stylexjs/stylex';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

import { Callout } from '@/components/site/callout';
import { CodeBlock } from '@/components/site/code-block';
import { ComponentPreview } from '@/components/site/component-preview';
import { font, layout, prose } from '@/components/site/site.stylex';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fontSize, fontWeight, lineHeight, space } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

type Props<T extends keyof React.JSX.IntrinsicElements> = Omit<ComponentProps<T>, 'className' | 'style'>;

/**
 * A section heading with its anchor: the whole heading text links to its own
 * id, so the anchor URL can be copied from any heading. Ids come from the
 * content pipeline (GitHub-style slugs).
 */
function heading(Tag: 'h2' | 'h3' | 'h4', level: stylex.StyleXStyles) {
  return function Heading({ id, children, ...props }: Props<typeof Tag>) {
    return (
      <Tag id={id} {...props} {...stylex.props(styles.heading, level)}>
        {id === undefined ? children : (
          <a href={`#${id}`} {...stylex.props(styles.anchor)}>
            {children}
          </a>
        )}
      </Tag>
    );
  };
}

/** Links inside the site navigate client-side; everything else is a plain link. */
function ProseLink({ href = '', children, ...props }: Props<'a'>) {
  if (href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link href={href} {...props} {...stylex.props(styles.link)}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...props} {...stylex.props(styles.link)}>
      {children}
    </a>
  );
}

/** The page title and its lead, above the MDX body. */
export function PageTitle({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return (
    <>
      <h1 {...stylex.props(styles.title)}>{title}</h1>
      {description ? <p {...stylex.props(styles.lead)}>{description}</p> : null}
    </>
  );
}

const styles = stylex.create({
  title: {
    color: colors.foreground,
    fontSize: prose.title,
    fontWeight: fontWeight.semibold,
    letterSpacing: prose.tracking,
    lineHeight: lineHeight.tight,
  },
  lead: {
    color: colors.mutedForeground,
    fontSize: fontSize.base,
    lineHeight: prose.leading,
    marginBlockStart: space.s2,
  },
  heading: {
    color: colors.foreground,
    fontWeight: fontWeight.semibold,
    letterSpacing: prose.tracking,
    lineHeight: lineHeight.snug,
    // In-page links land below the sticky header.
    scrollMarginTop: `calc(${layout.header} + ${space.s6})`,
  },
  h2: {
    fontSize: prose.section,
    marginBlockEnd: space.s4,
    marginBlockStart: space.s12,
  },
  h3: {
    fontSize: fontSize.lg,
    marginBlockEnd: space.s3,
    marginBlockStart: space.s8,
  },
  h4: {
    fontSize: fontSize.base,
    marginBlockEnd: space.s2,
    marginBlockStart: space.s6,
  },
  anchor: {
    color: 'inherit',
    textDecorationLine: { default: 'none', ':hover': 'underline' },
    textUnderlineOffset: space.s1,
  },
  paragraph: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: prose.leading,
    marginBlock: space.s4,
  },
  link: {
    color: colors.foreground,
    fontWeight: fontWeight.medium,
    textDecorationLine: 'underline',
    textUnderlineOffset: space.s1,
  },
  list: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: prose.leading,
    marginBlock: space.s4,
    paddingInlineStart: space.s6,
  },
  bullets: {
    listStyleType: 'disc',
  },
  numbers: {
    listStyleType: 'decimal',
  },
  item: {
    marginBlock: space.s1,
    paddingInlineStart: space.s1,
  },
  strong: {
    color: colors.foreground,
    fontWeight: fontWeight.semibold,
  },
  inlineCode: {
    backgroundColor: colors.muted,
    borderRadius: radius.xs,
    color: colors.foreground,
    fontFamily: font.mono,
    fontSize: prose.inlineCode,
    fontWeight: fontWeight.medium,
    paddingBlock: space.s05,
    paddingInline: space.s1,
  },
  rule: {
    borderColor: colors.border,
    marginBlock: space.s8,
  },
  table: {
    fontSize: fontSize.sm,
    marginBlock: space.s6,
  },
  cell: {
    whiteSpace: 'normal',
  },
});

/**
 * The Prose element map: what the docs content's elements and its two MDX
 * components render as. Code blocks, Examples and Callouts style themselves.
 */
export const proseComponents: MDXComponents = {
  h2: heading('h2', styles.h2),
  h3: heading('h3', styles.h3),
  h4: heading('h4', styles.h4),
  p: (props: Props<'p'>) => <p {...props} {...stylex.props(styles.paragraph)} />,
  a: ProseLink,
  ul: (props: Props<'ul'>) => <ul {...props} {...stylex.props(styles.list, styles.bullets)} />,
  ol: (props: Props<'ol'>) => <ol {...props} {...stylex.props(styles.list, styles.numbers)} />,
  li: (props: Props<'li'>) => <li {...props} {...stylex.props(styles.item)} />,
  strong: (props: Props<'strong'>) => <strong {...props} {...stylex.props(styles.strong)} />,
  code: (props: Props<'code'>) => <code {...props} {...stylex.props(styles.inlineCode)} />,
  hr: (props: Props<'hr'>) => <hr {...props} {...stylex.props(styles.rule)} />,
  table: (props: Props<'table'>) => (
    <div {...stylex.props(styles.table)}>
      <Table {...props} />
    </div>
  ),
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: (props: Props<'td'>) => <TableCell {...props} style={styles.cell} />,
  pre: CodeBlock,
  Component: ComponentPreview,
  Callout,
};
