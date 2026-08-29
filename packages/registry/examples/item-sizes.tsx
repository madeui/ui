import * as stylex from '@stylexjs/stylex';

import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { container } from '@/lib/constants.stylex';

export default function ItemSizes() {
  return (
    <ItemGroup style={styles.group}>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Extra small</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Small</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="md">
        <ItemContent>
          <ItemTitle>Medium</ItemTitle>
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
