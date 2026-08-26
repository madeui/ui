'use client';

import * as React from 'react';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface StyleProp {
  style?: stylex.StyleXStyles;
}

export const DropdownMenu = BaseMenu.Root;
export const DropdownMenuTrigger = BaseMenu.Trigger;
export const DropdownMenuGroup = BaseMenu.Group;

export function DropdownMenuContent({
  style,
  sideOffset = 4,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseMenu.Popup>,
  'className' | 'style'
> &
  StyleProp & { sideOffset?: number }) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <BaseMenu.Popup {...props} {...stylex.props(styles.popup, style)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function DropdownMenuItem({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseMenu.Item>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseMenu.Item
      {...props}
      {...stateProps((s: { highlighted: boolean; disabled: boolean }) => [
        styles.item,
        s.highlighted && styles.itemHighlighted,
        s.disabled && styles.itemDisabled,
        style,
      ])}
    />
  );
}

export function DropdownMenuSeparator({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseMenu.Separator {...props} {...stylex.props(styles.separator, style)} />
  );
}

export function DropdownMenuLabel({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseMenu.GroupLabel {...props} {...stylex.props(styles.label, style)} />
  );
}

const popupIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.97)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  positioner: {
    outline: 'none',
    zIndex: 50,
  },
  popup: {
    animationDuration: '120ms',
    animationName: popupIn,
    animationTimingFunction: 'ease-out',
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: shadow.md,
    color: colors.popoverForeground,
    fontFamily: font.sans,
    minWidth: '10rem',
    outline: 'none',
    paddingBlock: '0.25rem',
  },
  item: {
    alignItems: 'center',
    borderRadius: radius.sm,
    cursor: 'default',
    display: 'flex',
    fontSize: '0.875rem',
    gap: '0.5rem',
    marginInline: '0.25rem',
    outline: 'none',
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
    userSelect: 'none',
  },
  itemHighlighted: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
  },
  itemDisabled: {
    color: colors.mutedForeground,
    opacity: 0.5,
  },
  separator: {
    backgroundColor: colors.border,
    height: '1px',
    marginBlock: '0.25rem',
  },
  label: {
    color: colors.mutedForeground,
    fontSize: '0.75rem',
    fontWeight: 500,
    paddingBlock: '0.375rem',
    paddingInline: '0.75rem',
  },
});
