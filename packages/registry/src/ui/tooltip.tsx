'use client';

import * as React from 'react';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import * as stylex from '@stylexjs/stylex';

import { space, fontSize, lineHeight, z, duration, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

export const TooltipProvider = BaseTooltip.Provider;
export const Tooltip = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;

export interface TooltipContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup>,
    'className' | 'style'
  > {
  style?: stylex.StyleXStyles;
  sideOffset?: number;
  side?: React.ComponentPropsWithoutRef<
    typeof BaseTooltip.Positioner
  >['side'];
}

export function TooltipContent({
  style,
  side = 'top',
  sideOffset = 6,
  ...props
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
        <BaseTooltip.Popup {...props} {...stylex.props(styles.popup, style)} />
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
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
    backgroundColor: colors.foreground,
    borderRadius: radius.sm,
    boxShadow: shadow.md,
    color: colors.background,
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.snug,
    maxWidth: container.sm,
    paddingBlock: space.s1,
    paddingInline: space.s2,
    zIndex: z.popup,
  },
});
