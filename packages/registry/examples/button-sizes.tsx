import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';

export default function ButtonSizes() {
  return (
    <div {...stylex.props(styles.row)}>
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
    gap: '0.5rem',
  },
});
