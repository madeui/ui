import * as stylex from '@stylexjs/stylex';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { space } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';

export default function ButtonIconSizes() {
  return (
    <div {...stylex.props(styles.row)}>
      <Button size="iconXs" variant="outline" aria-label="Add">
        <Plus {...stylex.props(icon.md)} />
      </Button>
      <Button size="iconSm" variant="outline" aria-label="Add">
        <Plus {...stylex.props(icon.md)} />
      </Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <Plus {...stylex.props(icon.md)} />
      </Button>
      <Button size="iconLg" variant="outline" aria-label="Add">
        <Plus {...stylex.props(icon.md)} />
      </Button>
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
