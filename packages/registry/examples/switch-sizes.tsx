import * as stylex from '@stylexjs/stylex';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { space } from '@/lib/constants.stylex';

export default function SwitchSizes() {
  return (
    <div {...stylex.props(styles.row)}>
      <Label>
        <Switch size="sm" defaultChecked />
        Small
      </Label>
      <Label>
        <Switch defaultChecked />
        Medium
      </Label>
    </div>
  );
}

const styles = stylex.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s6,
  },
});
