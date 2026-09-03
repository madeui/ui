import * as stylex from '@stylexjs/stylex';
import { Copy } from 'lucide-react';

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { container } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';

export default function InputGroupButtonExample() {
  return (
    <InputGroup style={styles.group}>
      <InputGroupInput readOnly defaultValue="https://useblume.dev/i/8f3c1" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton aria-label="Copy link">
          <Copy {...stylex.props(icon.sm)} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

const styles = stylex.create({
  group: {
    maxWidth: container.sm,
  },
});
