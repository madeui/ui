import * as stylex from '@stylexjs/stylex';

import { Separator } from '@/components/ui/separator';
import { space, fontSize, fontWeight } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

export default function SeparatorDemo() {
  return (
    <div {...stylex.props(styles.root)}>
      <div>
        <div {...stylex.props(styles.title)}>Base UI Primitives</div>
        <div {...stylex.props(styles.muted)}>An open-source UI component library.</div>
      </div>
      <Separator />
      <div {...stylex.props(styles.row)}>
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    gap: space.s4,
  },
  title: {
    fontWeight: fontWeight.medium,
  },
  muted: {
    color: colors.mutedForeground,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s4,
    height: space.s5,
  },
});
