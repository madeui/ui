'use client';

import * as React from 'react';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { space, duration, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>,
    'className' | 'style'
  > {
  size?: SwitchSize;
  style?: stylex.StyleXStyles;
}

export function Switch({ size = 'md', style, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      {...props}
      {...stateProps((s: { checked: boolean; disabled: boolean }) => [
        styles.root,
        rootSizes[size],
        s.checked && styles.rootChecked,
        s.disabled && styles.rootDisabled,
        style,
      ])}
    >
      <BaseSwitch.Thumb
        {...stateProps((s: { checked: boolean }) => [
          styles.thumb,
          thumbSizes[size],
          s.checked && thumbCheckedSizes[size],
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
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: stroke.focus,
    padding: space.s05,
    position: 'relative',
    transitionDuration: duration.fast,
    transitionProperty: 'background-color',
    // Invisible expanded hit area (larger touch target).
    '::after': {
      content: '""',
      insetBlock: `calc(-1 * ${space.s2})`,
      insetInline: `calc(-1 * ${space.s3})`,
      position: 'absolute',
    },
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
    transform: 'translateX(0)',
    transitionDuration: duration.fast,
    transitionProperty: 'transform',
  },
});

const rootSizes = stylex.create({
  md: {
    height: space.s5,
    width: space.s9,
  },
  sm: {
    height: space.s4,
    width: space.s7,
  },
});

const thumbSizes = stylex.create({
  md: {
    height: space.s4,
    width: space.s4,
  },
  sm: {
    height: space.s3,
    width: space.s3,
  },
});

const thumbCheckedSizes = stylex.create({
  md: {
    transform: `translateX(${space.s4})`,
  },
  sm: {
    transform: `translateX(${space.s3})`,
  },
});
