import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Switch } from '@/components/ui/switch';
import { container } from '@/lib/constants.stylex';

export default function ItemDemo() {
  return (
    <ItemGroup {...stylex.props(styles.group)}>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Two-factor authentication</ItemTitle>
          <ItemDescription>
            Add an extra layer of security to your account.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Switch defaultChecked />
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
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
            <path d={`M8 10.5V7M8 5v.01M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0`} />
          </svg>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Update available</ItemTitle>
          <ItemDescription>Version 2.4 is ready to install.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Install
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}

const styles = stylex.create({
  group: {
    maxWidth: container.xl,
  },
});
