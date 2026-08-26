'use client';

import * as React from 'react';

import { Button as BaseButton } from '@base-ui/react/button';
import * as stylex from '@stylexjs/stylex';

import { space, fontSize, lineHeight, fontWeight, duration, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseButton>,
    'className' | 'style'
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

export function Button({
  variant = 'primary',
  size = 'md',
  style,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      {...props}
      {...stylex.props(styles.root, variants[variant], sizes[size], style)}
    />
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderStyle: 'none',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    gap: space.s2,
    justifyContent: 'center',
    lineHeight: lineHeight.none,
    opacity: { default: 1, ':disabled': 0.5 },
    textDecoration: 'none',
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    outlineOffset: stroke.focus,
    transitionDuration: duration.fast,
    transitionProperty: 'background-color, border-color, color, opacity',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
});

const variants = stylex.create({
  primary: {
    backgroundColor: {
      default: colors.primary,
      ':hover:not(:disabled)': `color-mix(in srgb, ${colors.primary} 90%, transparent)`,
    },
    color: colors.primaryForeground,
  },
  secondary: {
    backgroundColor: {
      default: colors.secondary,
      ':hover:not(:disabled)': `color-mix(in srgb, ${colors.secondary} 80%, ${colors.foreground} 4%)`,
    },
    color: colors.secondaryForeground,
  },
  outline: {
    backgroundColor: {
      default: colors.background,
      ':hover:not(:disabled)': colors.accent,
    },
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: {
      default: colors.foreground,
      ':hover:not(:disabled)': colors.accentForeground,
    },
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      ':hover:not(:disabled)': colors.accent,
    },
    color: {
      default: colors.foreground,
      ':hover:not(:disabled)': colors.accentForeground,
    },
  },
  destructive: {
    backgroundColor: {
      default: colors.destructive,
      ':hover:not(:disabled)': `color-mix(in srgb, ${colors.destructive} 90%, transparent)`,
    },
    color: colors.destructiveForeground,
  },
});

const sizes = stylex.create({
  sm: {
    height: space.s8,
    paddingInline: space.s3,
  },
  md: {
    height: space.s9,
    paddingInline: space.s4,
  },
  lg: {
    fontSize: fontSize.base,
    height: space.s10,
    paddingInline: space.s6,
  },
  icon: {
    height: space.s9,
    paddingInline: 0,
    width: space.s9,
  },
});
