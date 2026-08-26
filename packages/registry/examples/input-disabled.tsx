import * as stylex from '@stylexjs/stylex';

import { Input } from '@/components/ui/input';

export default function InputDisabled() {
  return (
    <div {...stylex.props(styles.wrap)}>
      <Input placeholder="Disabled" disabled />
    </div>
  );
}

const styles = stylex.create({
  wrap: {
    width: '20rem',
  },
});
