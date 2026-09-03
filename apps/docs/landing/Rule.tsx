import * as stylex from '@stylexjs/stylex';

import { stroke } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

// A section rule: one hairline across the column.
export function Rule({ style }: { style?: stylex.StyleXStyles }) {
  return <div role="presentation" {...stylex.props(styles.rule, style)} />;
}

const styles = stylex.create({
  rule: {
    borderTopColor: colors.border,
    borderTopStyle: 'solid',
    borderTopWidth: stroke.border,
    height: 0,
    width: '100%',
  },
});
