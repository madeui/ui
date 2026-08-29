import * as stylex from '@stylexjs/stylex';

import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { container } from '@/lib/constants.stylex';

export default function ProgressLabelExample() {
  return (
    <Progress value={72} locale="en-US" style={styles.root}>
      <ProgressLabel>Storage used</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

const styles = stylex.create({
  root: {
    maxWidth: container.sm,
  },
});
