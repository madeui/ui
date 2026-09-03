import * as stylex from '@stylexjs/stylex';
import { Search } from 'lucide-react';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { container } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';

export default function InputGroupIcon() {
  return (
    <InputGroup style={styles.group}>
      <InputGroupAddon>
        <Search {...stylex.props(icon.sm)} />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
    </InputGroup>
  );
}

const styles = stylex.create({
  group: {
    maxWidth: container.sm,
  },
});
