import * as stylex from '@stylexjs/stylex';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { space } from '@/lib/constants.stylex';

export default function ToggleGroupSizes() {
  return (
    <div {...stylex.props(styles.col)}>
      <ToggleGroup size="sm" variant="outline" defaultValue={['bold']}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup size="md" variant="outline" defaultValue={['bold']}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup size="lg" variant="outline" defaultValue={['bold']}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

const styles = stylex.create({
  col: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
  },
});
