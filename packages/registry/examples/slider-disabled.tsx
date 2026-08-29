import * as stylex from '@stylexjs/stylex';

import { Slider } from '@/components/ui/slider';
import { container } from '@/lib/constants.stylex';

export default function SliderDisabled() {
  return <Slider disabled defaultValue={[40]} style={styles.root} />;
}

const styles = stylex.create({
  root: {
    maxWidth: container.sm,
  },
});
