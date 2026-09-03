import * as stylex from '@stylexjs/stylex';
import { Info } from 'lucide-react';

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
import { icon } from '@/lib/stylex-utils';

export default function ItemDemo() {
  return (
    <ItemGroup style={styles.group}>
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
          <Info {...stylex.props(icon.md)} />
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
