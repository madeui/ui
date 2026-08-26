import * as stylex from '@stylexjs/stylex';

import { Checkbox } from '@/components/ui/checkbox';
import { colors, font } from '@/lib/tokens.stylex';

export default function CheckboxDisabled() {
  return (
    <label {...stylex.props(styles.label, styles.disabled)}>
      <Checkbox disabled defaultChecked /> Disabled
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
