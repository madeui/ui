import * as stylex from '@stylexjs/stylex';

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { space } from '@/lib/constants.stylex';

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
          <svg width="8" height="8" viewBox={`0 0 8 8`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={`M1.5 4.2 3.2 5.9 6.5 2.1`} />
          </svg>
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
