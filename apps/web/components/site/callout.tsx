import type { ReactNode } from 'react';

import * as stylex from '@stylexjs/stylex';
import { Info } from 'lucide-react';

import { fontSize, fontWeight, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, radius } from '@/lib/tokens.stylex';

interface CalloutProps {
  /** Only `info` exists in the content today; every type renders alike. */
  type?: string;
  title?: string;
  children?: ReactNode;
}

/** `<Callout type title>` in the docs content: an aside next to the prose. */
export function Callout({ title, children }: CalloutProps) {
  return (
    <aside {...stylex.props(styles.root)}>
      <Info {...stylex.props(icon.md, styles.icon)} />
      <div {...stylex.props(styles.body)}>
        {title === undefined ? null : <p {...stylex.props(styles.title)}>{title}</p>}
        {children}
      </div>
    </aside>
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'flex-start',
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.mutedForeground,
    display: 'flex',
    fontSize: fontSize.sm,
    gap: space.s2,
    lineHeight: lineHeight.normal,
    marginBlock: space.s5,
    paddingBlock: space.s3,
    paddingInline: space.s4,
  },
  icon: {
    marginTop: space.s05,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
  },
  title: {
    color: colors.foreground,
    fontWeight: fontWeight.semibold,
  },
});
