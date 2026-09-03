import * as stylex from '@stylexjs/stylex';
import { House } from 'lucide-react';

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { icon } from '@/lib/stylex-utils';

// The `render` prop swaps the underlying element — here an <a>, so hover and
// focus states apply to the anchor.
export default function ItemLink() {
  return (
    <Item variant="outline" render={<a href="#dashboard" />}>
      <ItemMedia variant="icon">
        <House {...stylex.props(icon.md)} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Dashboard</ItemTitle>
        <ItemDescription>Overview of your account and activity.</ItemDescription>
      </ItemContent>
    </Item>
  );
}
