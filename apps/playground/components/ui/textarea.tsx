'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { colors, font, radius } from '@/lib/tokens.stylex';

export interface TextareaProps
  extends Omit<
    React.ComponentPropsWithoutRef<'textarea'>,
    'className' | 'style'
  > {
  style?: stylex.StyleXStyles;
}

export function Textarea({ style, ...props }: TextareaProps) {
  return <textarea {...props} {...stylex.props(styles.root, style)} />;
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
    lineHeight: 1.5,
    minHeight: '4rem',
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.ring}` },
    outlineOffset: '-1px',
    paddingBlock: '0.5rem',
    paddingInline: '0.75rem',
    resize: 'vertical',
    transitionDuration: '150ms',
    transitionProperty: 'border-color, outline-color',
    width: '100%',
    '::placeholder': { color: colors.mutedForeground },
  },
});
