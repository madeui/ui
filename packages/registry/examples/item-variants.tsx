import * as stylex from '@stylexjs/stylex';

import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item';
import { container } from '@/lib/constants.stylex';

export default function ItemVariants() {
  return (
    <ItemGroup style={styles.group}>
      <Item variant="default">
        <ItemContent>
          <ItemTitle>Default</ItemTitle>
          <ItemDescription>A borderless row.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Outline</ItemTitle>
          <ItemDescription>A bordered row.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Muted</ItemTitle>
          <ItemDescription>A tinted background row.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}

const styles = stylex.create({
  group: {
    maxWidth: container.xl,
  },
});
