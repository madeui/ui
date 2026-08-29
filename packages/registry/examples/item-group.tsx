import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Item, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { container } from '@/lib/constants.stylex';

const activity = [
  { title: 'Deploy succeeded', description: 'Production · 2 minutes ago' },
  { title: 'New comment', description: 'On issue #482 · 1 hour ago' },
  { title: 'Build failed', description: 'staging branch · yesterday' },
];

export default function ItemGroupExample() {
  return (
    <ItemGroup style={styles.group}>
      {activity.map((entry, index) => (
        <React.Fragment key={entry.title}>
          <Item>
            <ItemContent>
              <ItemTitle>{entry.title}</ItemTitle>
              <ItemDescription>{entry.description}</ItemDescription>
            </ItemContent>
          </Item>
          {index < activity.length - 1 && <ItemSeparator />}
        </React.Fragment>
      ))}
    </ItemGroup>
  );
}

const styles = stylex.create({
  group: {
    maxWidth: container.xl,
  },
});
