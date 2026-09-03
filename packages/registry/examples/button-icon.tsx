import * as stylex from '@stylexjs/stylex';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { icon } from '@/lib/stylex-utils';

export default function ButtonIcon() {
  return (
    <Button size="icon" variant="outline" aria-label="Add">
      <Plus {...stylex.props(icon.md)} />
    </Button>
  );
}
