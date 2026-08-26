import * as stylex from '@stylexjs/stylex';

import { Input } from '@/components/ui/input';

export default function InputDemo() {
  return (
    <div {...stylex.props(styles.col)}>
      <Input placeholder="Email" type="email" />
      <Input placeholder="Disabled" disabled />
    </div>
  );
}

const styles = stylex.create({
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '20rem',
  },
});
