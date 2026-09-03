import * as stylex from '@stylexjs/stylex';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { icon } from '@/lib/stylex-utils';

export default function ButtonDemo() {
  return (
    <Button variant="outline">
      <Plus {...stylex.props(icon.md)} />
      New project
    </Button>
  );
}
