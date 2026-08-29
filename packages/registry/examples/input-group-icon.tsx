import * as stylex from '@stylexjs/stylex';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { container } from '@/lib/constants.stylex';

export default function InputGroupIcon() {
  return (
    <InputGroup style={styles.group}>
      <InputGroupAddon>
        <svg
          width="14"
          height="14"
          viewBox={`0 0 14 14`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="6" cy="6" r="4.5" />
          <path d={`m12 12-2.5-2.5`} />
        </svg>
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
