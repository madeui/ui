import * as stylex from '@stylexjs/stylex';

import { Slider } from '@/components/ui/slider';
import { container } from '@/lib/constants.stylex';

export default function SliderRange() {
  return <Slider defaultValue={[25, 75]} style={styles.root} />;
}

const styles = stylex.create({
  root: {
    maxWidth: container.sm,
  },
});
