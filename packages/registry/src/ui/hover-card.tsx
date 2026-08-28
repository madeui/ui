'use client';

import * as React from 'react';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import * as stylex from '@stylexjs/stylex';

import { ring } from '@/lib/stylex-utils';
import { space, fontSize, lineHeight, z, duration, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

export const HoverCard = BasePreviewCard.Root;
export const HoverCardTrigger = BasePreviewCard.Trigger;

export interface HoverCardContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof BasePreviewCard.Popup>,
      'className' | 'style'
    >,
    Pick<
      React.ComponentPropsWithoutRef<typeof BasePreviewCard.Positioner>,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    > {
  style?: stylex.StyleXStyles;
}

export function HoverCardContent({
  style,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 4,
  ...props
}: HoverCardContentProps) {
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <BasePreviewCard.Popup
          {...props}
          {...stylex.props(styles.popup, ring({ shadow: shadow.md }), style)}
        />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
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
    borderRadius: radius.lg,
    color: colors.popoverForeground,
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    outline: 'none',
    padding: space.s25,
    transformOrigin: 'var(--transform-origin)',
    width: container.card,
  },
});
