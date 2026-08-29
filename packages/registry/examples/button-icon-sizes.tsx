import * as stylex from '@stylexjs/stylex';

import { space } from '@/lib/constants.stylex';

import { Button } from '@/components/ui/button';

export default function ButtonIconSizes() {
  return (
    <div {...stylex.props(styles.row)}>
      <Button size="iconXs" variant="outline" aria-label="Add">
        <svg width="16" height="16" viewBox={`0 0 16 16`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <path d={`M8 3v10M3 8h10`} />
        </svg>
      </Button>
      <Button size="iconSm" variant="outline" aria-label="Add">
        <svg width="16" height="16" viewBox={`0 0 16 16`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <path d={`M8 3v10M3 8h10`} />
        </svg>
      </Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <svg width="16" height="16" viewBox={`0 0 16 16`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <path d={`M8 3v10M3 8h10`} />
        </svg>
      </Button>
      <Button size="iconLg" variant="outline" aria-label="Add">
        <svg width="16" height="16" viewBox={`0 0 16 16`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
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
    gap: space.s2,
  },
});
