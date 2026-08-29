import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function EmptyOutline() {
  return (
    <Empty style={styles.root}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <svg
            width="16"
            height="16"
            viewBox={`0 0 16 16`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d={`M2 4.5h12M2 8h12M2 11.5h7`} />
          </svg>
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
