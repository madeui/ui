import type { ReactNode } from 'react';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';

import { changelog, prose } from '@/components/site/site.stylex';
import { Badge } from '@/components/ui/badge';
import { breakpoint, fontSize, fontWeight, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';
import type { ChangelogEntry } from '@/site/changelog';

/**
 * One entry on the changelog index: a header (title linking to the entry's
 * page, date, category badge) beside the entry's full body. On phones the
 * header sits above the body, and a rule down the start edge holds the two
 * together.
 */
export function ChangelogUpdate({ entry, children }: { entry: ChangelogEntry; children: ReactNode }) {
  return (
    <article id={entry.id} {...stylex.props(styles.root)}>
      <header {...stylex.props(styles.header)}>
        <Link href={entry.route} {...stylex.props(styles.title)}>
          {entry.title}
        </Link>
        {entry.date === undefined ? null : <p {...stylex.props(styles.date)}>{entry.date}</p>}
        {entry.category === undefined ? null : (
          <div {...stylex.props(styles.tags)}>
            <Badge variant="secondary">{entry.category}</Badge>
          </div>
        )}
      </header>
      <div {...stylex.props(styles.body)}>{children}</div>
    </article>
  );
}

const styles = stylex.create({
  root: {
    borderInlineStartColor: colors.border,
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: { default: stroke.border, [breakpoint.md]: 0 },
    // What bare text in an entry inherits; the body's own elements (the
    // Prose map) set their type.
    color: colors.mutedForeground,
    display: 'grid',
    fontSize: fontSize.sm,
    gap: space.s4,
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [breakpoint.md]: `${changelog.aside} minmax(0, 1fr)` },
    lineHeight: prose.leading,
    marginBlock: space.s8,
    paddingInlineStart: { default: space.s4, [breakpoint.md]: 0 },
  },
  header: {
    borderInlineEndColor: colors.border,
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: { default: 0, [breakpoint.md]: stroke.border },
    paddingInlineEnd: { default: 0, [breakpoint.md]: space.s4 },
  },
  title: {
    color: colors.foreground,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.control,
    textDecorationLine: 'underline',
    textUnderlineOffset: space.s1,
  },
  date: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.control,
    marginBlockStart: space.s1,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s15,
    marginBlockStart: space.s3,
  },
  body: {
    minWidth: 0,
  },
});
