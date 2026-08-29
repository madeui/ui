import * as stylex from '@stylexjs/stylex';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';
import { container } from '@/lib/constants.stylex';

export default function InputGroupKbd() {
  return (
    <InputGroup style={styles.group}>
      <InputGroupInput placeholder="Search the docs…" />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}

const styles = stylex.create({
  group: {
    maxWidth: container.sm,
  },
});
