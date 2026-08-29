import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { space } from '@/lib/constants.stylex';

const sides = ['top', 'right', 'bottom', 'left'] as const;

export default function HoverCardSides() {
  return (
    <div {...stylex.props(styles.row)}>
      {sides.map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger render={<Button variant="outline" />}>
            {side}
          </HoverCardTrigger>
          <HoverCardContent side={side}>
            Hover card on {side}
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}

const styles = stylex.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s2,
  },
});
