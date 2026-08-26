import * as stylex from '@stylexjs/stylex';

import { Switch } from '@/components/ui/switch';
import { space, fontSize } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

export default function SwitchDemo() {
  return (
    <label {...stylex.props(styles.label)}>
      <Switch defaultChecked /> Airplane mode
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
