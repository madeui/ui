'use client';

import * as React from 'react';

import { Select as BaseSelect } from '@base-ui/react/select';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { space, fontSize, z, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface StyleProp {
  style?: stylex.StyleXStyles;
}

export const Select = BaseSelect.Root;
export const SelectValue = BaseSelect.Value;
export const SelectGroup = BaseSelect.Group;

export function SelectTrigger({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseSelect.Trigger {...props} {...stylex.props(styles.trigger, style)}>
      {children}
      <BaseSelect.Icon {...stylex.props(styles.icon)}>
        <svg
          width="16"
          height="16"
          viewBox={`0 0 16 16`}
          fill="currentColor"
          aria-hidden
        >
          <path d={`M11 10H5l3 3.5zm0-4H5l3-3.5z`} />
        </svg>
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export function SelectContent({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseSelect.Popup>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={4} {...stylex.props(styles.positioner)}>
        <BaseSelect.Popup {...props} {...stylex.props(styles.popup, style)}>
          <BaseSelect.List {...stylex.props(styles.list)}>
            {children}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseSelect.Item>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseSelect.Item
      {...props}
      {...stateProps((s: { highlighted: boolean; disabled: boolean }) => [
        styles.item,
        s.highlighted && styles.itemHighlighted,
        s.disabled && styles.itemDisabled,
        style,
      ])}
    >
      <BaseSelect.ItemIndicator {...stylex.props(styles.itemIndicator)}>
        <svg
          width="12"
          height="12"
          viewBox={`0 0 12 12`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d={`M2 6.5 4.5 9 10 3`} />
        </svg>
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText {...stylex.props(styles.itemText)}>
        {children}
      </BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

const popupIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.97)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  trigger: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.input,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.foreground,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    gap: space.s2,
    height: space.s9,
    justifyContent: 'space-between',
    minWidth: container.xs,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: `calc(-1 * ${stroke.border})`,
    paddingInline: space.s3,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  icon: {
    color: colors.mutedForeground,
    display: 'flex',
  },
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
    minWidth: 'var(--anchor-width)',
    outline: 'none',
  },
  list: {
    maxHeight: 'var(--available-height)',
    overflowY: 'auto',
    paddingBlock: space.s1,
    position: 'relative',
  },
  item: {
    alignItems: 'center',
    borderRadius: radius.sm,
    cursor: 'default',
    display: 'grid',
    fontSize: fontSize.sm,
    gap: space.s2,
    gridTemplateColumns: `${space.s4} 1fr`,
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
  itemIndicator: {
    alignItems: 'center',
    display: 'flex',
    gridColumnStart: 1,
    justifyContent: 'center',
  },
  itemText: {
    gridColumnStart: 2,
  },
});
