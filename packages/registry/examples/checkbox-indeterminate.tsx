import * as stylex from '@stylexjs/stylex';

import { Checkbox } from '@/components/ui/checkbox';
import { space, fontSize } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

export default function CheckboxIndeterminate() {
  return (
    <label {...stylex.props(styles.label)}>
      <Checkbox indeterminate /> Select all
    </label>
  );
}

const styles = stylex.create({
  label: {
    alignItems: 'center',
    color: colors.foreground,
    display: 'flex',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    gap: space.s2,
  },
});
