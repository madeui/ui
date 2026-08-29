import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from '@/components/ui/toolbar';

export default function ToolbarWithToggleGroup() {
  return (
    <Toolbar>
      <ToggleGroup variant="outline" spacing="joined" defaultValue={['left']}>
        <ToolbarButton render={<ToggleGroupItem value="left" aria-label="Align left" />}>
          <svg
            width="16"
            height="16"
            viewBox={`0 0 16 16`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
          >
            <path d={`M2 4h12M2 8h8M2 12h10`} />
          </svg>
        </ToolbarButton>
        <ToolbarButton render={<ToggleGroupItem value="center" aria-label="Align center" />}>
          <svg
            width="16"
            height="16"
            viewBox={`0 0 16 16`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
          >
            <path d={`M2 4h12M4 8h8M3 12h10`} />
          </svg>
        </ToolbarButton>
        <ToolbarButton render={<ToggleGroupItem value="right" aria-label="Align right" />}>
          <svg
            width="16"
            height="16"
            viewBox={`0 0 16 16`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
          >
            <path d={`M2 4h12M6 8h8M4 12h10`} />
          </svg>
        </ToolbarButton>
      </ToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton render={<Button variant="ghost" size="sm" />}>
        Export
      </ToolbarButton>
    </Toolbar>
  );
}
