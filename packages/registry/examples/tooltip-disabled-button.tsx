import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function TooltipDisabledButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<span {...stylex.props(styles.trigger)} />}>
          <Button variant="outline" disabled>
            Submit
          </Button>
        </TooltipTrigger>
        <TooltipContent>Complete the form to submit</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const styles = stylex.create({
  // Disabled native buttons don't fire pointer events, so the tooltip
  // trigger has to be the wrapping span instead of the button itself.
  trigger: {
    display: 'inline-block',
  },
});
