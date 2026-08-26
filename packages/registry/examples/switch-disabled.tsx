import * as stylex from '@stylexjs/stylex';

import { Switch } from '@/components/ui/switch';
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
    fontSize: '0.875rem',
    gap: '0.5rem',
  },
  disabled: {
    opacity: 0.5,
  },
});
