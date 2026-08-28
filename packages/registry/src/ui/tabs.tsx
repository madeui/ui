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

export type TabsVariant = 'default' | 'line';

const TabsVariantContext = React.createContext<TabsVariant>('default');

export function Tabs({
  style,
  orientation = 'horizontal',
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseTabs.Root>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseTabs.Root
      orientation={orientation}
      {...props}
      {...stylex.props(
        styles.root,
        orientation === 'vertical' && styles.rootVertical,
        style
      )}
    />
  );
}

export function TabsList({
  style,
  variant = 'default',
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseTabs.List>,
  'className' | 'style'
> &
  StyleProp & { variant?: TabsVariant }) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <BaseTabs.List
        {...props}
        {...stateProps((s: { orientation: 'horizontal' | 'vertical' }) => [
          styles.list,
          variant === 'line' && styles.listLine,
          s.orientation === 'vertical' && styles.listVertical,
          style,
        ])}
      />
    </TabsVariantContext.Provider>
  );
}

export function TabsTrigger({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>,
  'className' | 'style'
> &
  StyleProp) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <BaseTabs.Tab
      {...props}
      {...stateProps((s: { active: boolean }) => [
        styles.trigger,
        variant === 'line' && styles.triggerLine,
        s.active &&
          (variant === 'line'
            ? styles.triggerLineSelected
            : styles.triggerSelected),
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
  rootVertical: {
    flexDirection: 'row',
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
  listLine: {
    backgroundColor: 'transparent',
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: stroke.border,
    borderRadius: 0,
    gap: 0,
    padding: 0,
  },
  listVertical: {
    alignItems: 'stretch',
    flexDirection: 'column',
    height: 'fit-content',
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
    transitionProperty: 'background-color, color, border-color',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  triggerSelected: {
    backgroundColor: colors.background,
    color: colors.foreground,
  },
  // Underline style: the active tab draws a bar over the list's bottom border.
  triggerLine: {
    borderBottomColor: 'transparent',
    borderBottomStyle: 'solid',
    borderBottomWidth: stroke.focus,
    borderRadius: 0,
    height: space.s9,
    marginBottom: `calc(-1 * ${stroke.border})`,
  },
  triggerLineSelected: {
    borderBottomColor: colors.primary,
    color: colors.foreground,
  },
  content: {
    color: colors.foreground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    outline: 'none',
  },
});
