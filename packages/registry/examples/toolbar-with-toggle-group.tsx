import * as stylex from '@stylexjs/stylex';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from '@/components/ui/toolbar';
import { icon } from '@/lib/stylex-utils';

export default function ToolbarWithToggleGroup() {
  return (
    <Toolbar>
      <ToggleGroup variant="outline" spacing="joined" defaultValue={['left']}>
        <ToolbarButton render={<ToggleGroupItem value="left" aria-label="Align left" />}>
          <AlignLeft {...stylex.props(icon.md)} />
        </ToolbarButton>
        <ToolbarButton render={<ToggleGroupItem value="center" aria-label="Align center" />}>
          <AlignCenter {...stylex.props(icon.md)} />
        </ToolbarButton>
        <ToolbarButton render={<ToggleGroupItem value="right" aria-label="Align right" />}>
          <AlignRight {...stylex.props(icon.md)} />
        </ToolbarButton>
      </ToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton render={<Button variant="ghost" size="sm" />}>
        Export
      </ToolbarButton>
    </Toolbar>
  );
}
