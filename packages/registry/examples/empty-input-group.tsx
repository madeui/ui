import * as stylex from '@stylexjs/stylex';
import { Search } from 'lucide-react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { icon } from '@/lib/stylex-utils';

export default function EmptyInputGroup() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search {...stylex.props(icon.md)} />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          Try searching for a different keyword.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup>
          <InputGroupInput placeholder="Search…" />
          <InputGroupAddon>
            <Search {...stylex.props(icon.sm)} />
          </InputGroupAddon>
        </InputGroup>
      </EmptyContent>
    </Empty>
  );
}
