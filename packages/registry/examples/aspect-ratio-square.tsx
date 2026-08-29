import * as stylex from '@stylexjs/stylex';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { container } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

export default function AspectRatioSquare() {
  return (
    <div {...stylex.props(styles.frame)}>
      <AspectRatio ratio={1 / 1}>
        <div {...stylex.props(styles.placeholder)} />
      </AspectRatio>
    </div>
  );
}

const styles = stylex.create({
  frame: {
    width: container.xs,
  },
  placeholder: {
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
    height: '100%',
    width: '100%',
  },
});
