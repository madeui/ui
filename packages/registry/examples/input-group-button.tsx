import * as stylex from '@stylexjs/stylex';

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { container } from '@/lib/constants.stylex';

export default function InputGroupButtonExample() {
  return (
    <InputGroup style={styles.group}>
      <InputGroupInput readOnly defaultValue="https://useblume.dev/i/8f3c1" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton aria-label="Copy link">
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
            <rect x="5" y="5" width="7" height="7" rx="1" />
            <path d={`M9 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2`} />
          </svg>
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
