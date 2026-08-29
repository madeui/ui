import * as stylex from '@stylexjs/stylex';

import { Meter, MeterLabel, MeterValue } from '@/components/ui/meter';
import { container } from '@/lib/constants.stylex';

export default function MeterCustomRange() {
  return (
    <Meter value={72} min={30} max={90} locale="en-US" style={styles.root}>
      <MeterLabel>CPU temperature</MeterLabel>
      <MeterValue>{(_, value) => `${value}°C`}</MeterValue>
    </Meter>
  );
}

const styles = stylex.create({
  root: {
    maxWidth: container.sm,
  },
});
