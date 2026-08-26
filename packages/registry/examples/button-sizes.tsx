import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';

export default function ButtonSizes() {
  return (
    <div {...stylex.props(styles.row)}>
      <Button size="sm" variant="outline">Small</Button>
      <Button size="md" variant="outline">Medium</Button>
      <Button size="lg" variant="outline">Large</Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <svg width="16" height="16" viewBox={`0 0 16 16`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d={`M8 3v10M3 8h10`} />
        </svg>
      </Button>
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
