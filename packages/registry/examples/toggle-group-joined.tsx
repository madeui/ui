import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ToggleGroupJoined() {
  return (
    <ToggleGroup variant="outline" spacing="joined" defaultValue={['center']}>
      <ToggleGroupItem value="left" aria-label="Align left">
        Left
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        Center
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
