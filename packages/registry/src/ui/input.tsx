'use client';

import * as React from 'react';

import { Input as BaseInput } from '@base-ui/react/input';
import * as stylex from '@stylexjs/stylex';

import { space, fontSize, fontWeight, duration, stroke } from '@/lib/constants.stylex';
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
    borderColor: {
      default: colors.input,
      ':focus-visible': colors.ring,
      '[data-invalid]': colors.destructive,
    },
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.foreground,
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    height: space.s9,
    opacity: { default: 1, ':disabled': 0.5 },
    outlineColor: { default: 'transparent', ':focus-visible': colors.ring },
    outlineOffset: `calc(-1 * ${stroke.border})`,
    outlineStyle: 'solid',
    outlineWidth: stroke.focus,
    paddingInline: space.s3,
    transitionDuration: duration.fast,
    transitionProperty: 'border-color, outline-color',
    width: '100%',
    '::placeholder': { color: colors.mutedForeground },
    // type="file": render the browser's picker button as quiet inline text,
    // vertically centered inside the fixed-height control.
    '::file-selector-button': {
      backgroundColor: 'transparent',
      borderStyle: 'none',
      color: colors.foreground,
      fontFamily: font.sans,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      height: '100%',
      marginInlineEnd: space.s3,
      padding: 0,
    },
  },
});
