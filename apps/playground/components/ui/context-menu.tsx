'use client';

import * as React from 'react';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import * as stylex from '@stylexjs/stylex';

import { ring, stateProps } from '@/lib/stylex-utils';
import { space, fontSize, fontWeight, z, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface StyleProp {
  style?: stylex.StyleXStyles;
}

export const ContextMenu = BaseContextMenu.Root;
export const ContextMenuGroup = BaseContextMenu.Group;
export const ContextMenuPortal = BaseContextMenu.Portal;
export const ContextMenuSub = BaseContextMenu.SubmenuRoot;
export const ContextMenuRadioGroup = BaseContextMenu.RadioGroup;

export function ContextMenuTrigger({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Trigger>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseContextMenu.Trigger
      {...props}
      {...stylex.props(styles.trigger, style)}
    />
  );
}

export interface ContextMenuContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof BaseContextMenu.Popup>,
      'className' | 'style'
    >,
    Pick<
      React.ComponentPropsWithoutRef<typeof BaseContextMenu.Positioner>,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    >,
    StyleProp {}

export function ContextMenuContent({
  style,
  side = 'right',
  sideOffset = 0,
  align = 'start',
  alignOffset = 4,
  ...props
}: ContextMenuContentProps) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <BaseContextMenu.Popup
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
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined;
type PopupSide = 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';

export type ContextMenuItemVariant = 'default' | 'destructive';

export interface ContextMenuItemProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof BaseContextMenu.Item>,
      'className' | 'style'
    >,
    StyleProp {
  variant?: ContextMenuItemVariant;
  /** Indents the item to align with checkbox/radio item labels. */
  inset?: boolean;
}

export function ContextMenuItem({
  style,
  variant = 'default',
  inset,
  ...props
}: ContextMenuItemProps) {
  return (
    <BaseContextMenu.Item
      {...props}
      {...stateProps((s: { highlighted: boolean; disabled: boolean }) => [
        styles.item,
        inset && styles.itemInset,
        variant === 'destructive' && styles.itemDestructive,
        s.highlighted &&
          (variant === 'destructive'
            ? styles.itemDestructiveHighlighted
            : styles.itemHighlighted),
        s.disabled && styles.itemDisabled,
        style,
      ])}
    />
  );
}

function IndicatorCheck() {
  return (
    <svg
      width="16"
      height="16"
      viewBox={`0 0 16 16`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={`m3 8.5 3.5 3.5L13 4.5`} />
    </svg>
  );
}

export function ContextMenuCheckboxItem({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.CheckboxItem>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseContextMenu.CheckboxItem
      {...props}
      {...stateProps((s: { highlighted: boolean; disabled: boolean }) => [
        styles.item,
        styles.indicatorItem,
        s.highlighted && styles.itemHighlighted,
        s.disabled && styles.itemDisabled,
        style,
      ])}
    >
      <span {...stylex.props(styles.indicator)}>
        <BaseContextMenu.CheckboxItemIndicator>
          <IndicatorCheck />
        </BaseContextMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseContextMenu.CheckboxItem>
  );
}

export function ContextMenuRadioItem({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.RadioItem>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseContextMenu.RadioItem
      {...props}
      {...stateProps((s: { highlighted: boolean; disabled: boolean }) => [
        styles.item,
        styles.indicatorItem,
        s.highlighted && styles.itemHighlighted,
        s.disabled && styles.itemDisabled,
        style,
      ])}
    >
      <span {...stylex.props(styles.indicator)}>
        <BaseContextMenu.RadioItemIndicator>
          <IndicatorCheck />
        </BaseContextMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseContextMenu.RadioItem>
  );
}

export function ContextMenuSubTrigger({
  style,
  inset,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.SubmenuTrigger>,
  'className' | 'style'
> &
  StyleProp & { inset?: boolean }) {
  return (
    <BaseContextMenu.SubmenuTrigger
      {...props}
      {...stateProps(
        (s: { highlighted: boolean; disabled: boolean; open: boolean }) => [
          styles.item,
          inset && styles.itemInset,
          (s.highlighted || s.open) && styles.itemHighlighted,
          s.disabled && styles.itemDisabled,
          style,
        ]
      )}
    >
      {children}
      <svg
        width="16"
        height="16"
        viewBox={`0 0 16 16`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        {...stylex.props(styles.subTriggerChevron)}
      >
        <path d={`m6 3 5 5-5 5`} />
      </svg>
    </BaseContextMenu.SubmenuTrigger>
  );
}

export function ContextMenuSubContent({
  style,
  sideOffset = 0,
  alignOffset = -4,
  ...props
}: ContextMenuContentProps) {
  return (
    <ContextMenuContent
      side="right"
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      {...props}
      style={[styles.subPopup, style]}
    />
  );
}

export function ContextMenuShortcut({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> &
  StyleProp) {
  return <span {...props} {...stylex.props(styles.shortcut, style)} />;
}

export function ContextMenuSeparator({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.Separator>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseContextMenu.Separator
      {...props}
      {...stylex.props(styles.separator, style)}
    />
  );
}

export function ContextMenuLabel({
  style,
  inset,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseContextMenu.GroupLabel>,
  'className' | 'style'
> &
  StyleProp & { inset?: boolean }) {
  return (
    <BaseContextMenu.GroupLabel
      {...props}
      {...stylex.props(styles.label, inset && styles.itemInset, style)}
    />
  );
}

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
  trigger: {
    userSelect: 'none',
  },
  positioner: {
    outline: 'none',
    zIndex: z.popup,
  },
  popup: {
    backgroundColor: colors.popover,
    borderRadius: radius.md,
    color: colors.popoverForeground,
    fontFamily: font.sans,
    maxHeight: 'var(--available-height)',
    minWidth: container.xs,
    opacity: 1,
    outline: 'none',
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingBlock: space.s1,
    transform: 'scale(1)',
    transformOrigin: 'var(--transform-origin)',
    transitionDuration: duration.fast,
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'ease',
  },
  subPopup: {
    width: 'max-content',
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
  itemInset: {
    paddingLeft: space.s7,
  },
  indicatorItem: {
    paddingRight: space.s8,
    position: 'relative',
  },
  indicator: {
    alignItems: 'center',
    display: 'flex',
    height: space.s4,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
    right: space.s2,
    width: space.s4,
  },
  itemHighlighted: {
    backgroundColor: colors.accent,
    color: colors.accentForeground,
  },
  itemDestructive: {
    color: colors.destructive,
  },
  itemDestructiveHighlighted: {
    backgroundColor: `color-mix(in srgb, ${colors.destructive} 10%, transparent)`,
    color: colors.destructive,
  },
  itemDisabled: {
    color: colors.mutedForeground,
    opacity: 0.5,
  },
  subTriggerChevron: {
    color: colors.mutedForeground,
    flexShrink: 0,
    marginLeft: 'auto',
  },
  shortcut: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    letterSpacing: '0.1em',
    marginLeft: 'auto',
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
