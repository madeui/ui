import * as stylex from '@stylexjs/stylex';
import { Check } from 'lucide-react';

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { space } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';

export default function AvatarBadgeDemo() {
  return (
    <div {...stylex.props(styles.row)}>
      <Avatar>
        <AvatarImage src="https://github.com/madeui.png" alt="@madeui" />
        <AvatarFallback>MD</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/github.png" alt="@github" />
        <AvatarFallback>GH</AvatarFallback>
        <AvatarBadge>
          <Check {...stylex.props(icon.xxs)} />
        </AvatarBadge>
      </Avatar>
    </div>
  );
}

const styles = stylex.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s6,
  },
});
