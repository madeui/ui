'use client';

import * as React from 'react';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
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
      {...stateProps((s: { checked: boolean }) => [
        styles.root,
        s.checked && styles.rootChecked,
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
    height: '1.25rem',
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.ring}` },
    outlineOffset: '2px',
    padding: '2px',
    transitionDuration: '150ms',
    transitionProperty: 'background-color',
    width: '2.25rem',
  },
  rootChecked: {
    backgroundColor: colors.primary,
  },
  thumb: {
    backgroundColor: colors.background,
    borderRadius: radius.full,
    height: '1rem',
    transform: 'translateX(0)',
    transitionDuration: '150ms',
    transitionProperty: 'transform',
    width: '1rem',
  },
  thumbChecked: {
    transform: 'translateX(1rem)',
  },
});
