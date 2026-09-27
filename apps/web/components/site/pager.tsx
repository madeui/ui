import * as stylex from '@stylexjs/stylex';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { breakpoint, duration, fontSize, fontWeight, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, radius } from '@/lib/tokens.stylex';
import type { NavLink } from '@/site/nav';

/** Previous / next cards over the flattened sidebar of the page's tab. */
export function Pager({ prev, next }: { prev?: NavLink; next?: NavLink }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Pagination" {...stylex.props(styles.root)}>
      {prev ? (
        <Link href={prev.route} {...stylex.props(styles.card)}>
          <ArrowLeft {...stylex.props(icon.md, styles.arrow)} />
          <span {...stylex.props(styles.text)}>
            <span {...stylex.props(styles.hint)}>Previous</span>
            <span {...stylex.props(styles.title)}>{prev.title}</span>
          </span>
        </Link>
      ) : null}
      {next ? (
        <Link href={next.route} {...stylex.props(styles.card, styles.next)}>
          <span {...stylex.props(styles.text)}>
            <span {...stylex.props(styles.hint)}>Next</span>
            <span {...stylex.props(styles.title)}>{next.title}</span>
          </span>
          <ArrowRight {...stylex.props(icon.md, styles.arrow)} />
        </Link>
      ) : null}
    </nav>
  );
}

const styles = stylex.create({
  root: {
    borderTopColor: colors.border,
    borderTopStyle: 'solid',
    borderTopWidth: stroke.border,
    display: 'grid',
    gap: space.s4,
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [breakpoint.md]: 'repeat(2, minmax(0, 1fr))' },
    marginBlockStart: space.s12,
    paddingBlockStart: space.s6,
  },
  card: {
    alignItems: 'center',
    borderColor: { default: colors.border, ':hover': colors.ring },
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.foreground,
    display: 'flex',
    gap: space.s3,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    paddingBlock: space.s3,
    paddingInline: space.s4,
    textDecorationLine: 'none',
    transitionDuration: duration.fast,
    transitionProperty: 'border-color',
  },
  next: {
    gridColumnStart: { default: null, [breakpoint.md]: 2 },
    justifyContent: 'flex-end',
    textAlign: 'end',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
  },
  hint: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  },
  arrow: {
    color: colors.mutedForeground,
  },
});
