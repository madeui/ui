import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ToggleGroupVertical() {
  return (
    <ToggleGroup
      orientation="vertical"
      variant="outline"
      spacing="joined"
      defaultValue={['center']}
    >
      <ToggleGroupItem value="top" aria-label="Align top">
        Top
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        Center
      </ToggleGroupItem>
      <ToggleGroupItem value="bottom" aria-label="Align bottom">
        Bottom
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
