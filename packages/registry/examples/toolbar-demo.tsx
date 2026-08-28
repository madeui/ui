import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from '@/components/ui/toolbar';

export default function ToolbarDemo() {
  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton render={<Toggle aria-label="Toggle bold" />}>
          Bold
        </ToolbarButton>
        <ToolbarButton render={<Toggle aria-label="Toggle italic" />}>
          Italic
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton render={<Button variant="ghost" size="sm" />}>
        Share
      </ToolbarButton>
    </Toolbar>
  );
}
