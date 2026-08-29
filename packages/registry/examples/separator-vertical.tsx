import * as stylex from '@stylexjs/stylex';

import { Separator } from '@/components/ui/separator';
import { space, fontSize } from '@/lib/constants.stylex';
import { font } from '@/lib/tokens.stylex';

export default function SeparatorVertical() {
  return (
    <div {...stylex.props(styles.row)}>
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  );
}

const styles = stylex.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    gap: space.s4,
    height: space.s5,
  },
});
