'use client';

import * as React from 'react';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import * as stylex from '@stylexjs/stylex';

import { ring } from '@/lib/stylex-utils';
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
          {...stylex.props(styles.popup, ring({ shadow: shadow.md }), style)}
        />
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

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
      {...stylex.props(
        styles.item,
        inset && styles.itemInset,
        variant === 'destructive' && styles.itemDestructive,
        style
      )}
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
      {...stylex.props(styles.item, styles.indicatorItem, style)}
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
      {...stylex.props(styles.item, styles.indicatorItem, style)}
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
      {...stylex.props(
        styles.item,
        styles.subTrigger,
        inset && styles.itemInset,
        style
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

const styles = stylex.create({
  trigger: {
    userSelect: 'none',
  },
  positioner: {
    outline: 'none',
    zIndex: z.popup,
  },
  // Closed pose (Base UI's [data-starting-style]/[data-ending-style] frames):
  // faded, slightly shrunk, nudged toward the anchor. [data-side] sets the
  // nudge direction; the transition animates entry and exit through it.
  popup: {
    // No `default` for conditional custom properties: StyleX emits the
    // default rule unlayered (beating the layered [data-*] rules); the
    // var() fallback covers the unset case instead.
    '--popup-shift-x': {
      default: null,
      '[data-side="left"]': space.s2,
      '[data-side="right"]': `calc(-1 * ${space.s2})`,
      '[data-side="inline-start"]': space.s2,
      '[data-side="inline-end"]': `calc(-1 * ${space.s2})`,
    },
    '--popup-shift-y': {
      default: null,
      '[data-side="top"]': space.s2,
      '[data-side="bottom"]': `calc(-1 * ${space.s2})`,
    },
    backgroundColor: colors.popover,
    borderRadius: radius.md,
    color: colors.popoverForeground,
    fontFamily: font.sans,
    maxHeight: 'var(--available-height)',
    minWidth: container.xs,
    opacity: {
      default: 1,
      '[data-starting-style]': 0,
      '[data-ending-style]': 0,
    },
    outline: 'none',
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingBlock: space.s1,
    transform: {
      default: 'scale(1)',
      '[data-starting-style]':
        'translate(var(--popup-shift-x, 0px), var(--popup-shift-y, 0px)) scale(0.97)',
      '[data-ending-style]':
        'translate(var(--popup-shift-x, 0px), var(--popup-shift-y, 0px)) scale(0.97)',
    },
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
    backgroundColor: {
      default: 'transparent',
      '[data-highlighted]': colors.accent,
    },
    borderRadius: radius.sm,
    color: {
      default: null,
      '[data-highlighted]': colors.accentForeground,
      '[data-disabled]': colors.mutedForeground,
    },
    cursor: 'default',
    display: 'flex',
    fontSize: fontSize.sm,
    gap: space.s2,
    marginInline: space.s1,
    opacity: { default: 1, '[data-disabled]': 0.5 },
    outline: 'none',
    paddingBlock: space.s15,
    paddingInline: space.s2,
    userSelect: 'none',
  },
  // Submenu triggers also light up while their submenu is open.
  subTrigger: {
    backgroundColor: {
      default: 'transparent',
      '[data-highlighted]': colors.accent,
      '[data-popup-open]': colors.accent,
    },
    color: {
      default: null,
      '[data-highlighted]': colors.accentForeground,
      '[data-popup-open]': colors.accentForeground,
      '[data-disabled]': colors.mutedForeground,
    },
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
  itemDestructive: {
    backgroundColor: {
      default: 'transparent',
      '[data-highlighted]': `color-mix(in srgb, ${colors.destructive} 10%, transparent)`,
    },
    color: {
      default: colors.destructive,
      '[data-disabled]': colors.mutedForeground,
    },
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
