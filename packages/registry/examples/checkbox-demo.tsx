import * as stylex from '@stylexjs/stylex';

import { Checkbox } from '@/components/ui/checkbox';
import { colors, font } from '@/lib/tokens.stylex';

export default function CheckboxDemo() {
  return (
    <div {...stylex.props(styles.col)}>
      <label {...stylex.props(styles.label)}>
        <Checkbox defaultChecked /> Accept terms and conditions
      </label>
      <label {...stylex.props(styles.label, styles.disabled)}>
        <Checkbox disabled /> Disabled
      </label>
    </div>
  );
}

const styles = stylex.create({
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
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
