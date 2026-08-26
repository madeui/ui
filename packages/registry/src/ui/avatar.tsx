'use client';

import * as React from 'react';

import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import * as stylex from '@stylexjs/stylex';

import { space, fontSize, fontWeight } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export type AvatarSize = 'sm' | 'md' | 'lg';

interface StyleProp {
  style?: stylex.StyleXStyles;
}

export function Avatar({
  size = 'md',
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Root>,
  'className' | 'style'
> &
  StyleProp & { size?: AvatarSize }) {
  return (
    <BaseAvatar.Root
      {...props}
      {...stylex.props(styles.root, sizes[size], style)}
    />
  );
}

export function AvatarImage({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Image>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseAvatar.Image {...props} {...stylex.props(styles.image, style)} />
  );
}

export function AvatarFallback({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseAvatar.Fallback {...props} {...stylex.props(styles.fallback, style)} />
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.full,
    display: 'inline-flex',
    fontFamily: font.sans,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    userSelect: 'none',
    verticalAlign: 'middle',
  },
  image: {
    height: '100%',
    objectFit: 'cover',
    width: '100%',
  },
  fallback: {
    alignItems: 'center',
    color: colors.mutedForeground,
    display: 'flex',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});

const sizes = stylex.create({
  sm: { height: space.s8, width: space.s8 },
  md: { height: space.s10, width: space.s10 },
  lg: { height: space.s12, width: space.s12 },
});
