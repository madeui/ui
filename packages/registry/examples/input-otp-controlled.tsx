'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { space, fontSize } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

export default function InputOTPControlled() {
  const [value, setValue] = React.useState('');

  return (
    <div {...stylex.props(styles.col)}>
      <InputOTP length={6} value={value} onValueChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
      <p {...stylex.props(styles.value)}>
        {value ? `Entered: ${value}` : 'Enter your code.'}
      </p>
    </div>
  );
}

const styles = stylex.create({
  col: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
  },
  value: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
  },
});
