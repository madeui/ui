import * as stylex from '@stylexjs/stylex';
import { Text } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { icon } from '@/lib/stylex-utils';

export default function EmptyOutline() {
  return (
    <Empty style={styles.root}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Text {...stylex.props(icon.md)} />
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>
          You&apos;re all caught up. New messages will show up here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  );
}

// A solid outline instead of the default dashed border.
const styles = stylex.create({
  root: {
    borderStyle: 'solid',
  },
});
