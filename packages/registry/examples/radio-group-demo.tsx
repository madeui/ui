import * as stylex from '@stylexjs/stylex';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { space, fontSize } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

const options = ['Default', 'Comfortable', 'Compact'];

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="Comfortable">
      {options.map((option) => (
        <label key={option} {...stylex.props(styles.label)}>
          <RadioGroupItem value={option} /> {option}
        </label>
      ))}
    </RadioGroup>
  );
}

const styles = stylex.create({
  label: {
    alignItems: 'center',
    color: colors.foreground,
    display: 'flex',
    fontSize: fontSize.sm,
    gap: space.s2,
  },
});
