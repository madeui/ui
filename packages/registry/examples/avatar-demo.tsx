import * as stylex from '@stylexjs/stylex';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AvatarDemo() {
  return (
    <div {...stylex.props(styles.row)}>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/madeui.png" alt="@madeui" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  );
}

const styles = stylex.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.75rem',
  },
});
