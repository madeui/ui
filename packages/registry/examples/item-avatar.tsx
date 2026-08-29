import * as stylex from '@stylexjs/stylex';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { container } from '@/lib/constants.stylex';

export default function ItemAvatar() {
  return (
    <ItemGroup style={styles.group}>
      <Item variant="outline">
        <ItemMedia>
          <Avatar>
            <AvatarImage src="https://github.com/madeui.png" alt="@madeui" />
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>madeui</ItemTitle>
          <ItemDescription>Left a comment on your pull request.</ItemDescription>
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
