import * as stylex from '@stylexjs/stylex';

import { Badge } from '@/components/ui/badge';

export default function BadgeVariants() {
  return (
    <div {...stylex.props(styles.row)}>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
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
