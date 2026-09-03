import * as stylex from '@stylexjs/stylex';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { icon } from '@/lib/stylex-utils';

export default function ToggleGroupOutline() {
  return (
    <ToggleGroup variant="outline" defaultValue={['left']}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft {...stylex.props(icon.md)} />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter {...stylex.props(icon.md)} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight {...stylex.props(icon.md)} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
