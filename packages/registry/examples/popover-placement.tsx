import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function PopoverPlacement() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open above
      </PopoverTrigger>
      <PopoverContent side="top" align="start">
        Anchored to the top-start of the trigger.
      </PopoverContent>
    </Popover>
  );
}
