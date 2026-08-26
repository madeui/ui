'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { colors, font, radius } from '@/lib/tokens.stylex';

export type BadgeVariant = 'primary' | 'secondary' | 'outline' | 'destructive';

export interface BadgeProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> {
  variant?: BadgeVariant;
  style?: stylex.StyleXStyles;
}

export function Badge({ variant = 'primary', style, ...props }: BadgeProps) {
  return (
    <span {...props} {...stylex.props(styles.root, variants[variant], style)} />
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    borderRadius: radius.full,
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: '0.75rem',
    fontWeight: 500,
    gap: '0.25rem',
    lineHeight: 1,
    paddingBlock: '0.25rem',
    paddingInline: '0.625rem',
    whiteSpace: 'nowrap',
  },
});

const variants = stylex.create({
  primary: {
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
  },
  outline: {
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: '1px',
    color: colors.foreground,
  },
  destructive: {
    backgroundColor: colors.destructive,
    color: colors.destructiveForeground,
  },
});
