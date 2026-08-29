import * as stylex from '@stylexjs/stylex';

import { space } from '@/lib/constants.stylex';

import { Button } from '@/components/ui/button';

export default function ButtonSizes() {
  return (
    <div {...stylex.props(styles.row)}>
      <Button size="xs" variant="outline">Extra small</Button>
      <Button size="sm" variant="outline">Small</Button>
      <Button size="md" variant="outline">Medium</Button>
      <Button size="lg" variant="outline">Large</Button>
    </div>
  );
}

const styles = stylex.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s2,
  },
});
