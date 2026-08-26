'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { space, fontSize, lineHeight, fontWeight, stroke } from '@/lib/constants.stylex';
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
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    gap: space.s1,
    lineHeight: lineHeight.none,
    paddingBlock: space.s1,
    paddingInline: space.s25,
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
    borderWidth: stroke.border,
    color: colors.foreground,
  },
  destructive: {
    backgroundColor: colors.destructive,
    color: colors.destructiveForeground,
  },
});
