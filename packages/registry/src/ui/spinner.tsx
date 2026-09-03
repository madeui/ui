import * as stylex from '@stylexjs/stylex';
import { LoaderCircle, type LucideProps } from 'lucide-react';

import { icon } from '@/lib/stylex-utils';

export interface SpinnerProps
  extends Omit<LucideProps, 'className' | 'style'> {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

export function Spinner({ style, ...props }: SpinnerProps) {
  return (
    <LoaderCircle
      role="status"
      aria-label="Loading"
      {...props}
      {...stylex.props(icon.md, styles.root, style)}
    />
  );
}

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  root: {
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationName: spin,
    animationTimingFunction: 'linear',
  },
});
