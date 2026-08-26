'use client';

import * as React from 'react';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { space, fontSize, lineHeight, fontWeight, duration, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

interface StyleProp {
  style?: stylex.StyleXStyles;
}

export function Tabs({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseTabs.Root>,
  'className' | 'style'
> &
  StyleProp) {
  return <BaseTabs.Root {...props} {...stylex.props(styles.root, style)} />;
}

export function TabsList({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseTabs.List>,
  'className' | 'style'
> &
  StyleProp) {
  return <BaseTabs.List {...props} {...stylex.props(styles.list, style)} />;
}

export function TabsTrigger({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseTabs.Tab
      {...props}
      {...stateProps((s: { active: boolean }) => [
        styles.trigger,
        s.active && styles.triggerSelected,
        style,
      ])}
    />
  );
}

export function TabsContent({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>,
  'className' | 'style'
> &
  StyleProp) {
  return <BaseTabs.Panel {...props} {...stylex.props(styles.content, style)} />;
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s2,
  },
  list: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    display: 'inline-flex',
    gap: space.s1,
    padding: space.s1,
    width: 'fit-content',
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius.sm,
    borderStyle: 'none',
    color: colors.mutedForeground,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    height: space.s7,
    justifyContent: 'center',
    lineHeight: lineHeight.none,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: `calc(-1 * ${stroke.focus})`,
    paddingInline: space.s3,
    transitionDuration: duration.fast,
    transitionProperty: 'background-color, color',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  triggerSelected: {
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  content: {
    color: colors.foreground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    outline: 'none',
  },
});
