'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { space, fontSize, lineHeight, fontWeight, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export type AlertVariant = 'default' | 'destructive';

interface StyleProp {
  style?: stylex.StyleXStyles;
}

export interface AlertProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>,
    StyleProp {
  variant?: AlertVariant;
}

export function Alert({ variant = 'default', style, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      {...props}
      {...stylex.props(styles.root, variants[variant], style)}
    />
  );
}

export function AlertTitle({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'h5'>, 'className' | 'style'> &
  StyleProp) {
  return <h5 {...props} {...stylex.props(styles.title, style)} />;
}

export function AlertDescription({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> &
  StyleProp) {
  return <div {...props} {...stylex.props(styles.description, style)} />;
}

const styles = stylex.create({
  root: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.cardForeground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s1,
    padding: space.s4,
    width: '100%',
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    margin: 0,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
  },
});

const variants = stylex.create({
  default: {},
  destructive: {
    borderColor: colors.destructive,
    color: colors.destructive,
  },
});
