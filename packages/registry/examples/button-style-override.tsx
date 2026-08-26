import * as stylex from '@stylexjs/stylex';

import { space } from '@/lib/constants.stylex';
import { radius } from '@/lib/tokens.stylex';

import { Button } from '@/components/ui/button';

// The style prop merges last — StyleX guarantees it wins over the
// component's own styles. No tailwind-merge, no !important.
export default function ButtonStyleOverride() {
  return (
    <div {...stylex.props(styles.row)}>
      <Button style={styles.pill}>Pill</Button>
      <Button variant="outline" style={[styles.pill, styles.wide]}>
        Pill + wide
      </Button>
    </div>
  );
}

const styles = stylex.create({
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s2,
  },
  pill: { borderRadius: radius.full },
  wide: { paddingInline: space.s12 },
});
