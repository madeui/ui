import * as stylex from '@stylexjs/stylex';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { colors, font } from '@/lib/tokens.stylex';

export default function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="a" disabled>
      <label {...stylex.props(styles.label, styles.disabled)}>
        <RadioGroupItem value="a" /> Option A
      </label>
      <label {...stylex.props(styles.label, styles.disabled)}>
        <RadioGroupItem value="b" /> Option B
      </label>
    </RadioGroup>
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
