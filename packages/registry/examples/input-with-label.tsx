import * as stylex from '@stylexjs/stylex';

import { Input } from '@/components/ui/input';
import { colors, font } from '@/lib/tokens.stylex';

export default function InputWithLabel() {
  return (
    <div {...stylex.props(styles.field)}>
      <label htmlFor="email" {...stylex.props(styles.label)}>
        Email
      </label>
      <Input id="email" placeholder="you@example.com" type="email" />
    </div>
  );
}

const styles = stylex.create({
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    width: '20rem',
  },
  label: {
    color: colors.foreground,
    fontFamily: font.sans,
    fontSize: '0.875rem',
    fontWeight: 500,
  },
});
