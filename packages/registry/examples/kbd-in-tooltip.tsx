import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { space } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

export default function KbdInTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Save
        </TooltipTrigger>
        <TooltipContent style={styles.content}>
          Save <Kbd style={styles.kbd}>⌘S</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const styles = stylex.create({
  content: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s15,
  },
  kbd: {
    backgroundColor: `color-mix(in srgb, ${colors.background} 20%, transparent)`,
    color: colors.background,
  },
});
