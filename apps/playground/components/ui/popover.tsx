'use client';

import * as React from 'react';

import { Popover as BasePopover } from '@base-ui/react/popover';
import * as stylex from '@stylexjs/stylex';

import { ring } from '@/lib/stylex-utils';
import { space, fontSize, lineHeight, z, duration, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;

export interface PopoverContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof BasePopover.Popup>,
      'className' | 'style'
    >,
    Pick<
      React.ComponentPropsWithoutRef<typeof BasePopover.Positioner>,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    > {
  style?: stylex.StyleXStyles;
}

export function PopoverContent({
  style,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <BasePopover.Popup
          {...props}
          {...stylex.props(styles.popup, ring({ shadow: shadow.md }), style)}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
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
    borderRadius: radius.md,
    color: colors.popoverForeground,
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    outline: 'none',
    padding: space.s4,
    transformOrigin: 'var(--transform-origin)',
    width: container.sm,
  },
});
