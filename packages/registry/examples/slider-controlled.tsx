'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Slider } from '@/components/ui/slider';
import { container, fontSize, space } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

export default function SliderControlled() {
  const [value, setValue] = React.useState([40]);

  return (
    <div {...stylex.props(styles.row)}>
      <Slider
        value={value}
        onValueChange={(next) => setValue(next)}
        style={styles.slider}
      />
      <span {...stylex.props(styles.value)}>{value[0]}</span>
    </div>
  );
}

const styles = stylex.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s4,
    width: container.md,
  },
  slider: {
    flex: 1,
  },
  value: {
    color: colors.mutedForeground,
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    fontVariantNumeric: 'tabular-nums',
    width: space.s8,
  },
});
