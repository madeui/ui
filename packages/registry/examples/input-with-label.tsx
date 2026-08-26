import * as stylex from '@stylexjs/stylex';

import { Input } from '@/components/ui/input';
import { space, fontSize, fontWeight, container } from '@/lib/constants.stylex';
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
    gap: space.s15,
    width: container.md,
  },
  label: {
    color: colors.foreground,
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
