import * as stylex from '@stylexjs/stylex';

import { Skeleton } from '@/components/ui/skeleton';
import { space, container } from '@/lib/constants.stylex';
import { radius } from '@/lib/tokens.stylex';

export default function SkeletonDemo() {
  return (
    <div {...stylex.props(styles.root)}>
      <Skeleton style={styles.avatar} />
      <div {...stylex.props(styles.lines)}>
        <Skeleton style={styles.lineWide} />
        <Skeleton style={styles.line} />
      </div>
    </div>
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s4,
  },
  avatar: {
    borderRadius: radius.full,
    height: space.s12,
    width: space.s12,
  },
  lines: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
  },
  lineWide: {
    height: space.s4,
    width: container.xs,
  },
  line: {
    height: space.s4,
    width: space.s16,
  },
});
