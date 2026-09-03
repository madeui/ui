import * as stylex from '@stylexjs/stylex';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { icon } from '@/lib/stylex-utils';

// The trigger's `render` swaps it for a Button — ButtonGroup then fuses both
// the primary action and the trigger into one segmented control.
export default function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button>Deploy</Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon" aria-label="More deploy options" />}>
          <ChevronDown {...stylex.props(icon.sm)} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Deploy to staging</DropdownMenuItem>
          <DropdownMenuItem>Roll back last deploy</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
