import * as stylex from '@stylexjs/stylex';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { container } from '@/lib/constants.stylex';

export default function InputGroupTextareaExample() {
  return (
    <InputGroup style={styles.group}>
      <InputGroupTextarea placeholder="Type your message…" rows={3} />
      <InputGroupAddon align="block-end">
        <InputGroupButton variant="outline" size="xs">
          Send
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
