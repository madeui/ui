'use client';

import * as React from 'react';

import { Input as BaseInput } from '@base-ui/react/input';
import * as stylex from '@stylexjs/stylex';

import { space, fontSize, duration, stroke } from '@/lib/constants.stylex';
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
    borderWidth: stroke.border,
    color: colors.foreground,
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    height: space.s9,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: `calc(-1 * ${stroke.border})`,
    paddingInline: space.s3,
    transitionDuration: duration.fast,
    transitionProperty: 'border-color, outline-color',
    width: '100%',
    '::placeholder': { color: colors.mutedForeground },
  },
});
