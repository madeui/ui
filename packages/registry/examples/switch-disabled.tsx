import * as stylex from '@stylexjs/stylex';

import { Switch } from '@/components/ui/switch';
import { space, fontSize } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

export default function SwitchDisabled() {
  return (
    <label {...stylex.props(styles.label, styles.disabled)}>
      <Switch disabled /> Disabled
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
  disabled: {
    opacity: 0.5,
  },
});
