'use client';

import * as React from 'react';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { space, fontSize, lineHeight, z, duration, container } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

// Instant tooltips by default (Base UI's own default is 600ms).
export function TooltipProvider({
  delay = 0,
  ...props
}: React.ComponentPropsWithoutRef<typeof BaseTooltip.Provider>) {
  return <BaseTooltip.Provider delay={delay} {...props} />;
}

export const Tooltip = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;

export interface TooltipContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup>,
      'className' | 'style'
    >,
    Pick<
      React.ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    > {
  style?: stylex.StyleXStyles;
}

type ArrowSide = 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';

export function TooltipContent({
  style,
  children,
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  ...props
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <BaseTooltip.Popup {...props} {...stylex.props(styles.popup, style)}>
          {children}
          <BaseTooltip.Arrow
            {...stateProps((s: { side: ArrowSide }) => [
              styles.arrow,
              arrowSides[s.side],
            ])}
          />
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
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
    backgroundColor: colors.foreground,
    borderRadius: radius.sm,
    color: colors.background,
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.snug,
    maxWidth: container.sm,
    paddingBlock: space.s15,
    paddingInline: space.s3,
    transformOrigin: 'var(--transform-origin)',
  },
  // A rotated square, half tucked under the popup; Base UI positions it along
  // the anchor axis, we only offset it on the cross axis per side.
  arrow: {
    backgroundColor: colors.foreground,
    height: space.s25,
    position: 'absolute',
    transform: 'rotate(45deg)',
    width: space.s25,
  },
});

// Mostly tucked under the popup: the rotated corner peeks out just enough to
// bridge the default 4px sideOffset gap.
const arrowSides = stylex.create({
  top: { bottom: `calc(-1 * ${space.s05})` },
  bottom: { top: `calc(-1 * ${space.s05})` },
  left: { right: `calc(-1 * ${space.s05})` },
  right: { left: `calc(-1 * ${space.s05})` },
  'inline-start': { right: `calc(-1 * ${space.s05})` },
  'inline-end': { left: `calc(-1 * ${space.s05})` },
});
