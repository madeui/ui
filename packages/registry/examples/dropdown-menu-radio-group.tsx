import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DropdownMenuRadioGroupExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Text size
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Menu labels are Base UI GroupLabels — they must live inside a
            Group or RadioGroup. */}
        <DropdownMenuRadioGroup defaultValue="md">
          <DropdownMenuLabel>Font size</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioItem value="sm">Small</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="md">Medium</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="lg">Large</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
