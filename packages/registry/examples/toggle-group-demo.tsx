import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup defaultValue={['bold']}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
