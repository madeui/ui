'use client';

import * as React from 'react';

import { Radio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { colors, radius } from '@/lib/tokens.stylex';

interface StyleProp {
  style?: stylex.StyleXStyles;
}

export function RadioGroup({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseRadioGroup>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseRadioGroup {...props} {...stylex.props(styles.group, style)} />
  );
}

export function RadioGroupItem({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof Radio.Root>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <Radio.Root
      {...props}
      {...stateProps((s: { checked: boolean; disabled: boolean }) => [
        styles.item,
        s.checked && styles.itemChecked,
        s.disabled && styles.itemDisabled,
        style,
      ])}
    >
      <Radio.Indicator {...stylex.props(styles.indicator)} />
    </Radio.Root>
  );
}

const styles = stylex.create({
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  item: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.input,
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: '1px',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    flexShrink: 0,
    height: '1rem',
    justifyContent: 'center',
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.ring}` },
    outlineOffset: '2px',
    padding: 0,
    transitionDuration: '150ms',
    transitionProperty: 'border-color',
    width: '1rem',
  },
  itemChecked: {
    borderColor: colors.primary,
  },
  itemDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  indicator: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    display: 'block',
    height: '0.5rem',
    width: '0.5rem',
  },
});
