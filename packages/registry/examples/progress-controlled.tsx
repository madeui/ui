'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import { Progress, ProgressValue } from '@/components/ui/progress';
import { container, space } from '@/lib/constants.stylex';

export default function ProgressControlled() {
  const [value, setValue] = React.useState(20);

  return (
    <div {...stylex.props(styles.wrap)}>
      <Progress value={value} locale="en-US">
        <ProgressValue />
      </Progress>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setValue((current) => Math.min(current + 20, 100))}
        style={styles.button}
      >
        Advance
      </Button>
    </div>
  );
}

const styles = stylex.create({
  wrap: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    width: container.sm,
  },
  button: {
    alignSelf: 'flex-start',
  },
});
