import * as stylex from '@stylexjs/stylex';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { container } from '@/lib/constants.stylex';

export default function InputGroupSpinner() {
  return (
    <InputGroup style={styles.group}>
      <InputGroupInput placeholder="Enter a username" defaultValue="useblume" />
      <InputGroupAddon align="inline-end">
        <Spinner />
      </InputGroupAddon>
    </InputGroup>
  );
}

const styles = stylex.create({
  group: {
    maxWidth: container.sm,
  },
});
