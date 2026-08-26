'use client';

import * as React from 'react';

import { Popover as BasePopover } from '@base-ui/react/popover';
import * as stylex from '@stylexjs/stylex';

import { space, fontSize, lineHeight, z, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;

export interface PopoverContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BasePopover.Popup>,
    'className' | 'style'
  > {
  style?: stylex.StyleXStyles;
  sideOffset?: number;
  side?: React.ComponentPropsWithoutRef<
    typeof BasePopover.Positioner
  >['side'];
  align?: React.ComponentPropsWithoutRef<
    typeof BasePopover.Positioner
  >['align'];
}

export function PopoverContent({
  style,
  side = 'bottom',
  align = 'center',
  sideOffset = 6,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BasePopover.Popup {...props} {...stylex.props(styles.popup, style)} />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

const popupIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.97)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
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
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    outline: 'none',
    padding: space.s4,
    width: container.sm,
    zIndex: z.popup,
  },
});
