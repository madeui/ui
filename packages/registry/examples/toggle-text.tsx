import * as stylex from '@stylexjs/stylex';
import { Italic } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { icon } from '@/lib/stylex-utils';

export default function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic {...stylex.props(icon.md)} />
      Italic
    </Toggle>
  );
}
