import * as stylex from '@stylexjs/stylex';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import { space, container } from '@/lib/constants.stylex';

export default function InputGroupDemo() {
  return (
    <div {...stylex.props(styles.col)}>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

const styles = stylex.create({
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    width: container.sm,
  },
});
