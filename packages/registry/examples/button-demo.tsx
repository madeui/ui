import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';

export default function ButtonDemo() {
  return (
    <div {...stylex.props(styles.row)}>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}

const styles = stylex.create({
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
});
