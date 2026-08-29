import * as stylex from '@stylexjs/stylex';

import { Skeleton } from '@/components/ui/skeleton';
import { space, container } from '@/lib/constants.stylex';
import { radius } from '@/lib/tokens.stylex';

export default function SkeletonList() {
  return (
    <div {...stylex.props(styles.root)}>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} {...stylex.props(styles.row)}>
          <Skeleton style={styles.avatar} />
          <div {...stylex.props(styles.lines)}>
            <Skeleton style={styles.lineWide} />
            <Skeleton style={styles.line} />
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
    width: container.sm,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s3,
  },
  avatar: {
    borderRadius: radius.full,
    flexShrink: 0,
    height: space.s10,
    width: space.s10,
  },
  lines: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: space.s2,
  },
  lineWide: {
    height: space.s4,
    width: '70%',
  },
  line: {
    height: space.s4,
    width: '40%',
  },
});
