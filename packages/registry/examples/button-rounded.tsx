import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';

// The style prop merges last — StyleX guarantees it wins over the
// component's own styles. No tailwind-merge, no !important.
export default function ButtonRounded() {
  return <Button style={styles.rounded}>Rounded</Button>;
}

const styles = stylex.create({
  rounded: {
    borderRadius: '9999px',
  },
});
