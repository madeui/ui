'use client';

import * as React from 'react';

import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import * as stylex from '@stylexjs/stylex';

import { ring, stateProps } from '@/lib/stylex-utils';
import { space, fontSize, fontWeight, lineHeight, z, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface StyleProp {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

export const Combobox = BaseCombobox.Root;
export const ComboboxValue = BaseCombobox.Value;
export const ComboboxCollection = BaseCombobox.Collection;

export function ComboboxInput({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Input>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <div {...stylex.props(styles.inputWrap, style)}>
      <BaseCombobox.Input {...props} {...stylex.props(styles.input)} />
      <BaseCombobox.Trigger
        aria-label="Open list"
        tabIndex={-1}
        {...stylex.props(styles.inputTrigger)}
      >
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
          <path d={`m3 6 5 5 5-5`} />
        </svg>
      </BaseCombobox.Trigger>
    </div>
  );
}

export interface ComboboxContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof BaseCombobox.Popup>,
      'className' | 'style'
    >,
    Pick<
      React.ComponentPropsWithoutRef<typeof BaseCombobox.Positioner>,
      'align' | 'alignOffset' | 'side' | 'sideOffset' | 'anchor'
    >,
    StyleProp {}

export function ComboboxContent({
  style,
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
        {...stylex.props(styles.positioner)}
      >
        <BaseCombobox.Popup
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
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined;
type PopupSide = 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end';

export function ComboboxList({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseCombobox.List>,
  'className' | 'style'
> &
  StyleProp) {
  return <BaseCombobox.List {...props} {...stylex.props(styles.list, style)} />;
}

export function ComboboxItem({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Item>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseCombobox.Item
      {...props}
      {...stateProps((s: { highlighted: boolean; disabled: boolean }) => [
        styles.item,
        s.highlighted && styles.itemHighlighted,
        s.disabled && styles.itemDisabled,
        style,
      ])}
    >
      {children}
      <BaseCombobox.ItemIndicator
        render={<span {...stylex.props(styles.indicator)} />}
      >
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
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}

export function ComboboxGroup({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Group>,
  'className' | 'style'
> &
  StyleProp) {
  return <BaseCombobox.Group {...props} {...stylex.props(style)} />;
}

export function ComboboxLabel({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseCombobox.GroupLabel {...props} {...stylex.props(styles.label, style)} />
  );
}

export function ComboboxEmpty({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Empty>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseCombobox.Empty {...props} {...stylex.props(styles.empty, style)} />
  );
}

export function ComboboxSeparator({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseCombobox.Separator>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseCombobox.Separator
      {...props}
      {...stylex.props(styles.separator, style)}
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
  inputWrap: {
    position: 'relative',
    width: container.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: { default: colors.input, ':focus-visible': colors.ring },
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.foreground,
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    height: space.s9,
    opacity: { default: 1, ':disabled': 0.5 },
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    outlineOffset: `calc(-1 * ${stroke.border})`,
    paddingLeft: space.s3,
    paddingRight: space.s8,
    transitionDuration: duration.fast,
    transitionProperty: 'border-color, outline-color',
    width: '100%',
    '::placeholder': { color: colors.mutedForeground },
  },
  inputTrigger: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    color: colors.mutedForeground,
    cursor: 'pointer',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    outline: 'none',
    padding: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: space.s8,
  },
  positioner: {
    outline: 'none',
    zIndex: z.popup,
  },
  popup: {
    backgroundColor: colors.popover,
    borderRadius: radius.md,
    color: colors.popoverForeground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    maxHeight: `min(${container.sm}, var(--available-height))`,
    opacity: 1,
    outline: 'none',
    overflow: 'hidden',
    transform: 'scale(1)',
    transformOrigin: 'var(--transform-origin)',
    transitionDuration: duration.fast,
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: 'ease',
    width: 'var(--anchor-width)',
  },
  list: {
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    paddingBlock: space.s1,
  },
  item: {
    alignItems: 'center',
    borderRadius: radius.sm,
    cursor: 'default',
    display: 'flex',
    fontSize: fontSize.sm,
    gap: space.s2,
    lineHeight: lineHeight.control,
    marginInline: space.s1,
    outline: 'none',
    paddingBlock: space.s15,
    paddingLeft: space.s2,
    paddingRight: space.s8,
    position: 'relative',
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
  label: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    paddingBlock: space.s15,
    paddingInline: space.s3,
  },
  empty: {
    color: colors.mutedForeground,
    // Base UI renders the element with no children while results exist —
    // hide it then so its padding doesn't reserve space.
    display: { default: 'block', ':empty': 'none' },
    fontSize: fontSize.sm,
    paddingBlock: space.s2,
    textAlign: 'center',
  },
  separator: {
    backgroundColor: colors.border,
    height: stroke.border,
    marginBlock: space.s1,
  },
});
