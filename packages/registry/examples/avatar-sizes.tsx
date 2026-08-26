import * as stylex from '@stylexjs/stylex';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AvatarSizes() {
  return (
    <div {...stylex.props(styles.row)}>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="md">
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
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
});
