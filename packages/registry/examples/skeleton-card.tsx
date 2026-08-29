import * as stylex from '@stylexjs/stylex';

import { Skeleton } from '@/components/ui/skeleton';
import { space, container } from '@/lib/constants.stylex';
import { radius } from '@/lib/tokens.stylex';

export default function SkeletonCard() {
  return (
    <div {...stylex.props(styles.root)}>
      <Skeleton style={styles.image} />
      <Skeleton style={styles.lineWide} />
      <Skeleton style={styles.line} />
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    width: container.card,
  },
  image: {
    borderRadius: radius.lg,
    height: container.xs,
    width: '100%',
  },
  lineWide: {
    height: space.s4,
    width: '100%',
  },
  line: {
    height: space.s4,
    width: '60%',
  },
});
