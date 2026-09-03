import * as stylex from '@stylexjs/stylex';

import { Spinner } from '@/components/ui/spinner';
import { space } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';

export default function SpinnerSizes() {
  return (
    <div {...stylex.props(styles.row)}>
      <Spinner style={icon.xs} />
      <Spinner />
      <Spinner style={icon.lg} />
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
