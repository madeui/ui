'use client';

import * as React from 'react';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import * as stylex from '@stylexjs/stylex';

import { ring, stateProps } from '@/lib/stylex-utils';
import { space, fontSize, fontWeight, lineHeight, z, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface StyleProp {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

/**
 * Free-text input with a filtered suggestion popup — unlike Combobox, any
 * typed value is allowed; the list only suggests. Pass `items` to the root;
 * `AutocompleteList` accepts a render function over the filtered items.
 */
export const Autocomplete = BaseAutocomplete.Root;
export const AutocompleteValue = BaseAutocomplete.Value;
export const AutocompleteCollection = BaseAutocomplete.Collection;

export function AutocompleteInput({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Input>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseAutocomplete.Input {...props} {...stylex.props(styles.input, style)} />
  );
}

export interface AutocompleteContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Popup>,
      'className' | 'style'
    >,
    Pick<
      React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Positioner>,
      'align' | 'alignOffset' | 'side' | 'sideOffset' | 'anchor'
    >,
    StyleProp {}

export function AutocompleteContent({
  style,
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  anchor,
  ...props
}: AutocompleteContentProps) {
  return (
    <BaseAutocomplete.Portal>
      <BaseAutocomplete.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}
        {...stylex.props(styles.positioner)}
      >
        <BaseAutocomplete.Popup
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
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  );
}

export function AutocompleteList({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.List>,
  'className' | 'style' | 'children'
> &
  StyleProp & {
    /** Static items, or a render function over the filtered items. */
    children?: React.ReactNode | ((item: any) => React.ReactNode);
  }) {
  return (
    <BaseAutocomplete.List {...props} {...stylex.props(styles.list, style)} />
  );
}

export function AutocompleteItem({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Item>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseAutocomplete.Item
      {...props}
      {...stateProps((s: { highlighted: boolean; disabled: boolean }) => [
        styles.item,
        s.highlighted && styles.itemHighlighted,
        s.disabled && styles.itemDisabled,
        style,
      ])}
    />
  );
}

export function AutocompleteGroup({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Group>,
  'className' | 'style'
> &
  StyleProp) {
  return <BaseAutocomplete.Group {...props} {...stylex.props(style)} />;
}

export function AutocompleteLabel({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.GroupLabel>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseAutocomplete.GroupLabel
      {...props}
      {...stylex.props(styles.label, style)}
    />
  );
}

export function AutocompleteEmpty({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Empty>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseAutocomplete.Empty {...props} {...stylex.props(styles.empty, style)} />
  );
}

export function AutocompleteSeparator({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Separator>,
  'className' | 'style'
> &
  StyleProp) {
  return (
    <BaseAutocomplete.Separator
      {...props}
      {...stylex.props(styles.separator, style)}
    />
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
    paddingInline: space.s3,
    transitionDuration: duration.fast,
    transitionProperty: 'border-color, outline-color',
    width: container.sm,
    '::placeholder': { color: colors.mutedForeground },
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
