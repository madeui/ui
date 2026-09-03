import * as stylex from '@stylexjs/stylex';
import { Bold } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { icon } from '@/lib/stylex-utils';

export default function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold {...stylex.props(icon.md)} />
    </Toggle>
  );
}
