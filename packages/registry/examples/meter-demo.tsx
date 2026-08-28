import * as stylex from '@stylexjs/stylex';

import { Meter, MeterLabel, MeterValue } from '@/components/ui/meter';
import { container } from '@/lib/constants.stylex';

export default function MeterDemo() {
  return (
    <Meter value={24} max={64} locale="en-US" style={styles.root}>
      <MeterLabel>Storage used</MeterLabel>
      <MeterValue>{(_, value) => `${value} GB of 64 GB`}</MeterValue>
    </Meter>
  );
}

const styles = stylex.create({
  root: {
    maxWidth: container.sm,
  },
});
