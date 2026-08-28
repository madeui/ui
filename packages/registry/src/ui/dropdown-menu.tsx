'use client';

import * as React from 'react';

import { Menu as BaseMenu } from '@base-ui/react/menu';
import * as stylex from '@stylexjs/stylex';

import { ring, stateProps } from '@/lib/stylex-utils';
import { space, fontSize, fontWeight, z, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface StyleProp {
  style?: stylex.StyleXStyles;
}

export const DropdownMenu = BaseMenu.Root;
export const DropdownMenuTrigger = BaseMenu.Trigger;
export const DropdownMenuGroup = BaseMenu.Group;
export const DropdownMenuPortal = BaseMenu.Portal;
export const DropdownMenuSub = BaseMenu.SubmenuRoot;
export const DropdownMenuRadioGroup = BaseMenu.RadioGroup;

export interface DropdownMenuContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof BaseMenu.Popup>,
      'className' | 'style'
    >,
    Pick<
      React.ComponentPropsWithoutRef<typeof BaseMenu.Positioner>,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    >,
    StyleProp {}

export function DropdownMenuContent({
  style,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  ...props
}: DropdownMenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <BaseMenu.Popup
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
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined;
type PopupSide = 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';

export type DropdownMenuItemVariant = 'default' | 'destructive';

export interface DropdownMenuItemProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof BaseMenu.Item>,
      'className' | 'style'
    >,
    StyleProp {
  variant?: DropdownMenuItemVariant;
  /** Indents the item to align with checkbox/radio item labels. */
  inset?: boolean;
}

export function DropdownMenuItem({
  style,
  variant = 'default',
  inset,
  ...props
}: DropdownMenuItemProps) {
  return (
    <BaseMenu.Item
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

export function DropdownMenuCheckboxItem({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseMenu.CheckboxItem
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
        <BaseMenu.CheckboxItemIndicator>
          <IndicatorCheck />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseMenu.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItem>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseMenu.RadioItem
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
        <BaseMenu.RadioItemIndicator>
          <IndicatorCheck />
        </BaseMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseMenu.RadioItem>
  );
}

export function DropdownMenuSubTrigger({
  style,
  inset,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger>,
  'className' | 'style'
> &
  StyleProp & { inset?: boolean }) {
  return (
    <BaseMenu.SubmenuTrigger
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
    </BaseMenu.SubmenuTrigger>
  );
}

export function DropdownMenuSubContent({
  style,
  sideOffset = 0,
  alignOffset = -4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuContent
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      {...props}
      style={[styles.subPopup, style]}
    />
  );
}

export function DropdownMenuShortcut({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> &
  StyleProp) {
  return <span {...props} {...stylex.props(styles.shortcut, style)} />;
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
  inset,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>,
  'className' | 'style'
> &
  StyleProp & { inset?: boolean }) {
  return (
    <BaseMenu.GroupLabel
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
    width: 'var(--anchor-width)',
  },
  // Submenus anchor to their trigger item — the anchor width is the item, not
  // the menu, so size to content instead.
  subPopup: {
    minWidth: container.xs,
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
  // Reserve room for the trailing check indicator (absolute, right-aligned —
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
