import * as stylex from '@stylexjs/stylex';
import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { icon } from '@/lib/stylex-utils';

export default function BadgeIcon() {
  return (
    <Badge variant="secondary">
      <Check {...stylex.props(icon.xs)} />
      Verified
    </Badge>
  );
}
