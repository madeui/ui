import * as stylex from '@stylexjs/stylex';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { container } from '@/lib/constants.stylex';
import { radius } from '@/lib/tokens.stylex';

export default function AspectRatioDemo() {
  return (
    <div {...stylex.props(styles.frame)}>
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Landscape by Drew Beamer"
          {...stylex.props(styles.image)}
        />
      </AspectRatio>
    </div>
  );
}

const styles = stylex.create({
  frame: {
    width: container.lg,
  },
  image: {
    borderRadius: radius.lg,
    height: '100%',
    objectFit: 'cover',
    width: '100%',
  },
});
