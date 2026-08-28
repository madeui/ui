import * as stylex from '@stylexjs/stylex';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { space, fontSize, fontWeight } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="ghost" />}>
        @nextjs
      </HoverCardTrigger>
      <HoverCardContent>
        <div {...stylex.props(styles.row)}>
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div {...stylex.props(styles.info)}>
            <span {...stylex.props(styles.name)}>@nextjs</span>
            <span>The React framework — created and maintained by Vercel.</span>
            <span {...stylex.props(styles.muted)}>Joined December 2021</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

const styles = stylex.create({
  row: {
    display: 'flex',
    gap: space.s3,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s1,
  },
  name: {
    fontWeight: fontWeight.semibold,
  },
  muted: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
  },
});
