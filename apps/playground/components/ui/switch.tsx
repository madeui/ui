'use client';

import * as React from 'react';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { space, duration, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

export interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>,
    'className' | 'style'
  > {
  style?: stylex.StyleXStyles;
}

export function Switch({ style, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      {...props}
      {...stateProps((s: { checked: boolean; disabled: boolean }) => [
        styles.root,
        s.checked && styles.rootChecked,
        s.disabled && styles.rootDisabled,
        style,
      ])}
    >
      <BaseSwitch.Thumb
        {...stateProps((s: { checked: boolean }) => [
          styles.thumb,
          s.checked && styles.thumbChecked,
        ])}
      />
    </BaseSwitch.Root>
  );
}

const styles = stylex.create({
  root: {
    backgroundColor: colors.input,
    borderRadius: radius.full,
    borderStyle: 'none',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    flexShrink: 0,
    height: space.s5,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: stroke.focus,
    padding: space.s05,
    transitionDuration: duration.fast,
    transitionProperty: 'background-color',
    width: space.s9,
  },
  rootChecked: {
    backgroundColor: colors.primary,
  },
  rootDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  thumb: {
    backgroundColor: colors.background,
    borderRadius: radius.full,
    height: space.s4,
    transform: 'translateX(0)',
    transitionDuration: duration.fast,
    transitionProperty: 'transform',
    width: space.s4,
  },
  thumbChecked: {
    transform: `translateX(${space.s4})`,
  },
});
