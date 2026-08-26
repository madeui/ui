import * as stylex from '@stylexjs/stylex';

import { container } from '@/lib/constants.stylex';

import { Input } from '@/components/ui/input';

export default function InputDemo() {
  return (
    <div {...stylex.props(styles.wrap)}>
      <Input placeholder="Email" type="email" />
    </div>
  );
}

const styles = stylex.create({
  wrap: {
    width: container.md,
  },
});
