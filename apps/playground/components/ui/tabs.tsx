'use client';

import * as React from 'react';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
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
    gap: '0.5rem',
  },
  list: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    display: 'inline-flex',
    gap: '0.25rem',
    padding: '0.25rem',
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
    fontSize: '0.875rem',
    fontWeight: 500,
    height: '1.75rem',
    justifyContent: 'center',
    lineHeight: 1,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.ring}` },
    outlineOffset: '-2px',
    paddingInline: '0.75rem',
    transitionDuration: '150ms',
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
    fontSize: '0.875rem',
    lineHeight: 1.5,
    outline: 'none',
  },
});
