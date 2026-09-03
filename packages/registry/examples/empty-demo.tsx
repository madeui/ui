import * as stylex from '@stylexjs/stylex';
import { Package } from 'lucide-react';

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

export default function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package {...stylex.props(icon.md)} />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects. Get started by creating your first
          one.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create project</Button>
      </EmptyContent>
    </Empty>
  );
}
