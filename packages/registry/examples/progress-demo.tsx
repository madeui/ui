'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { container } from '@/lib/constants.stylex';

export default function ProgressDemo() {
  const [value, setValue] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setValue(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Progress value={value} locale="en-US" style={styles.root}>
      <ProgressLabel>Uploading…</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

const styles = stylex.create({
  root: {
    maxWidth: container.sm,
  },
});
