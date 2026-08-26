'use client';

import * as React from 'react';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { space, fontSize, fontWeight, z, duration, stroke, container } from '@/lib/constants.stylex';
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
    zIndex: z.popup,
  },
  popup: {
    animationDuration: duration.fast,
    animationName: popupIn,
    animationTimingFunction: 'ease-out',
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    boxShadow: shadow.md,
    color: colors.popoverForeground,
    fontFamily: font.sans,
    minWidth: container.xs,
    outline: 'none',
    paddingBlock: space.s1,
  },
  item: {
    alignItems: 'center',
    borderRadius: radius.sm,
    cursor: 'default',
    display: 'flex',
    fontSize: fontSize.sm,
    gap: space.s2,
    marginInline: space.s1,
    outline: 'none',
    paddingBlock: space.s15,
    paddingInline: space.s2,
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
    height: stroke.border,
    marginBlock: space.s1,
  },
  label: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    paddingBlock: space.s15,
    paddingInline: space.s3,
  },
});
