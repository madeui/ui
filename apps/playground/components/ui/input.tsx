'use client';

import * as React from 'react';

import { Input as BaseInput } from '@base-ui/react/input';
import * as stylex from '@stylexjs/stylex';

import { colors, font, radius } from '@/lib/tokens.stylex';

export interface InputProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseInput>,
    'className' | 'style'
  > {
  style?: stylex.StyleXStyles;
}

export function Input({ style, ...props }: InputProps) {
  return <BaseInput {...props} {...stylex.props(styles.root, style)} />;
}

const styles = stylex.create({
  root: {
    backgroundColor: colors.background,
    borderColor: { default: colors.input, ':focus-visible': colors.ring },
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    color: colors.foreground,
    fontFamily: font.sans,
    fontSize: '0.875rem',
    height: '2.25rem',
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.ring}` },
    outlineOffset: '-1px',
    paddingInline: '0.75rem',
    transitionDuration: '150ms',
    transitionProperty: 'border-color, outline-color',
    width: '100%',
    '::placeholder': { color: colors.mutedForeground },
  },
});
