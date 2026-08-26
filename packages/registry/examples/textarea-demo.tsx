import * as stylex from '@stylexjs/stylex';

import { container } from '@/lib/constants.stylex';

import { Textarea } from '@/components/ui/textarea';

export default function TextareaDemo() {
  return (
    <div {...stylex.props(styles.wrap)}>
      <Textarea placeholder="Type your message here." />
    </div>
  );
}

const styles = stylex.create({
  wrap: {
    width: container.lg,
  },
});
