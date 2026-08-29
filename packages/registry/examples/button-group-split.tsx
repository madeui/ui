import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// The trigger's `render` swaps it for a Button — ButtonGroup then fuses both
// the primary action and the trigger into one segmented control.
export default function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button>Deploy</Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon" aria-label="More deploy options" />}>
          <svg
            width="14"
            height="14"
            viewBox={`0 0 14 14`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d={`m3.5 5.5 3.5 3.5 3.5-3.5`} />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Deploy to staging</DropdownMenuItem>
          <DropdownMenuItem>Roll back last deploy</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
