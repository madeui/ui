import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';

// The style prop merges last — StyleX guarantees it wins over the
// component's own styles. No tailwind-merge, no !important.
const styles = stylex.create({
  pill: { borderRadius: '9999px' },
  wide: { paddingInline: '3rem' },
});

export default function ButtonStyleOverride() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Button style={styles.pill}>Pill</Button>
      <Button variant="outline" style={[styles.pill, styles.wide]}>
        Pill + wide
      </Button>
    </div>
  );
}
