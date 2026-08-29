import * as stylex from '@stylexjs/stylex';

import { Spinner } from '@/components/ui/spinner';
import { space } from '@/lib/constants.stylex';

export default function SpinnerSizes() {
  return (
    <div {...stylex.props(styles.row)}>
      <Spinner width="12" height="12" />
      <Spinner width="16" height="16" />
      <Spinner width="24" height="24" />
      <Spinner width="32" height="32" />
    </div>
  );
}

const styles = stylex.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s4,
  },
});
