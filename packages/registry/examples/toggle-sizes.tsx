import * as stylex from '@stylexjs/stylex';

import { Toggle } from '@/components/ui/toggle';
import { space } from '@/lib/constants.stylex';

export default function ToggleSizes() {
  return (
    <div {...stylex.props(styles.row)}>
      <Toggle size="sm" aria-label="Toggle bold">
        Small
      </Toggle>
      <Toggle size="md" aria-label="Toggle bold">
        Medium
      </Toggle>
      <Toggle size="lg" aria-label="Toggle bold">
        Large
      </Toggle>
    </div>
  );
}

const styles = stylex.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s2,
  },
});
