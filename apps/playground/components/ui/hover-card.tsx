'use client';

import * as React from 'react';

import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import * as stylex from '@stylexjs/stylex';

import { ring, stateProps } from '@/lib/stylex-utils';
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
          {...stateProps(
            (s: { transitionStatus: TransitionStatus; side: PopupSide }) => [
              styles.popup,
              ring({ shadow: shadow.md }),
              (s.transitionStatus === 'starting' ||
                s.transitionStatus === 'ending') &&
                closedSides[s.side],
              style,
            ]
          )}
        />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  );
}

type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined;
type PopupSide = 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';

// Closed pose per side: faded, slightly shrunk, nudged toward the anchor —
// the transition on the base style animates both entry and exit through it.
const closedSides = stylex.create({
  top: { opacity: 0, transform: `translateY(${space.s2}) scale(0.97)` },
  bottom: { opacity: 0, transform: `translateY(calc(-1 * ${space.s2})) scale(0.97)` },
  left: { opacity: 0, transform: `translateX(${space.s2}) scale(0.97)` },
  right: { opacity: 0, transform: `translateX(calc(-1 * ${space.s2})) scale(0.97)` },
  'inline-start': { opacity: 0, transform: `translateX(${space.s2}) scale(0.97)` },
  'inline-end': { opacity: 0, transform: `translateX(calc(-1 * ${space.s2})) scale(0.97)` },
});

const styles = stylex.create({
  positioner: {
    outline: 'none',
    zIndex: z.popup,
  },
  popup: {
    backgroundColor: colors.popover,
    borderRadius: radius.lg,
    color: colors.popoverForeground,
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    opacity: 1,
    outline: 'none',
    padding: space.s25,
    transform: 'scale(1)',
    transformOrigin: 'var(--transform-origin)',
    transitionDuration: duration.fast,
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'ease',
    width: container.card,
  },
});
