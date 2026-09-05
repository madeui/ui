'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import {
  DayPicker,
  type ChevronProps,
  type DayButtonProps,
  type DayPickerProps,
  type DropdownProps,
  type WeekNumberProps,
} from 'react-day-picker';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { icon } from '@/lib/stylex-utils';
import { space, fontSize, fontWeight, lineHeight, duration, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export type CalendarSize = 'sm' | 'md';

// `DayPickerProps` is a discriminated union over `mode`; a plain `Omit` would
// collapse it to the common keys and lose the per-mode `selected`/`onSelect`
// typing, so omit distributively.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type CalendarProps = DistributiveOmit<
  DayPickerProps,
  'className' | 'style'
> & {
  /** Day cell size: `md` = 32px cells, `sm` = 28px cells. */
  size?: CalendarSize;
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
};

interface CalendarContextValue {
  size: CalendarSize;
}

const CalendarContext = React.createContext<CalendarContextValue>({
  size: 'md',
});

// react-day-picker takes class-name strings per slot; every value here is a
// compiled StyleX class (the one deliberate exception to "never pass
// className", see STYLEX.md).
function cx(
  ...styles: ReadonlyArray<
    stylex.CompiledStyles | stylex.StyleXStyles | null | undefined | false
  >
) {
  return stylex.props(...styles).className ?? '';
}

/**
 * Built on react-day-picker (https://daypicker.dev). Every slot is styled
 * through `classNames` with StyleX classes; the interactive slots
 * (`DayButton`, `Chevron`, `WeekNumber`, `Dropdown`) are our exported slot
 * components below, replaceable through the `components` prop.
 */
export function Calendar({
  size = 'md',
  style,
  showOutsideDays = true,
  captionLayout = 'label',
  classNames: userClassNames,
  components: userComponents,
  navLayout = 'around',
  hideNavigation,
  ...props
}: CalendarProps) {
  // `around` puts each chevron inside its own month, so we can pin them to
  // that month's caption row instead of floating one bar over the whole
  // months strip — the chevrons stay aligned with their grid when the strip
  // wraps, and nothing overlaps the caption.
  const pinnedNav = navLayout === 'around' && !hideNavigation;

  const classNames = React.useMemo(
    () => ({
      root: cx(styles.root, style),
      months: cx(styles.months),
      month: cx(styles.month),
      nav: cx(styles.nav, cellHeights[size]),
      button_previous: cx(
        styles.navButton,
        cellSizes[size],
        pinnedNav && styles.navButtonStart
      ),
      button_next: cx(
        styles.navButton,
        cellSizes[size],
        pinnedNav && styles.navButtonEnd
      ),
      month_caption: cx(
        styles.monthCaption,
        cellHeights[size],
        pinnedNav && navGutters[size]
      ),
      caption_label: cx(styles.captionLabel, textSizes[size]),
      dropdowns: cx(styles.dropdowns),
      month_grid: cx(styles.monthGrid),
      weekday: cx(styles.gridHeader, cellSizes[size]),
      week_number_header: cx(styles.gridHeader, cellSizes[size]),
      day: cx(styles.day, cellSizes[size]),
      range_start: cx(styles.rangeStart),
      range_middle: cx(styles.rangeMiddle),
      range_end: cx(styles.rangeEnd),
      hidden: cx(styles.hiddenDay),
      footer: cx(styles.footer),
      ...userClassNames,
    }),
    [size, style, pinnedNav, userClassNames]
  );

  const components = React.useMemo(
    () => ({
      DayButton: CalendarDayButton,
      Chevron: CalendarChevron,
      WeekNumber: CalendarWeekNumber,
      Dropdown: CalendarDropdown,
      ...userComponents,
    }),
    [userComponents]
  );

  const context = React.useMemo(() => ({ size }), [size]);

  return (
    <CalendarContext.Provider value={context}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        captionLayout={captionLayout}
        navLayout={navLayout}
        hideNavigation={hideNavigation}
        {...props}
        classNames={classNames}
        components={components}
      />
    </CalendarContext.Provider>
  );
}

/**
 * Slot for react-day-picker's `DayButton`: a real `<button>` styled from the
 * day's modifiers. Override via `components={{ DayButton }}`.
 */
export function CalendarDayButton({
  day: _day,
  modifiers,
  className: _className,
  style: _style,
  ...props
}: DayButtonProps) {
  const { size } = React.useContext(CalendarContext);
  const ref = React.useRef<HTMLButtonElement>(null);

  // react-day-picker moves keyboard focus by flipping the `focused`
  // modifier; the default slot focuses the element in response, so we do too.
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      {...props}
      {...stylex.props(
        styles.dayButton,
        cellSizes[size],
        textSizes[size],
        modifiers.outside && styles.dayButtonOutside,
        modifiers.today && styles.dayButtonToday,
        modifiers.range_middle && styles.dayButtonRangeMiddle,
        modifiers.selected && !modifiers.range_middle && styles.dayButtonSelected,
        modifiers.disabled && styles.dayButtonDisabled
      )}
    />
  );
}

/**
 * Slot for react-day-picker's `Chevron`: lucide chevrons sized through the
 * icon scale. Override via `components={{ Chevron }}`.
 */
export function CalendarChevron({ orientation = 'left' }: ChevronProps) {
  switch (orientation) {
    case 'up':
      return <ChevronUp {...stylex.props(icon.md)} />;
    case 'down':
      return <ChevronDown {...stylex.props(icon.md)} />;
    case 'right':
      return <ChevronRight {...stylex.props(icon.md)} />;
    default:
      return <ChevronLeft {...stylex.props(icon.md)} />;
  }
}

/**
 * Slot for react-day-picker's `WeekNumber` (the row header when
 * `showWeekNumber` is on). Override via `components={{ WeekNumber }}`.
 */
export function CalendarWeekNumber({
  week: _week,
  className: _className,
  style: _style,
  ...props
}: WeekNumberProps) {
  const { size } = React.useContext(CalendarContext);
  return (
    <th {...props} {...stylex.props(styles.gridHeader, cellSizes[size])} />
  );
}

/**
 * Slot for react-day-picker's `Dropdown` (month / year pickers when
 * `captionLayout` is a dropdown variant), rendered with our Select. The
 * library reads `event.target.value` from the change handler, so a
 * select-shaped event is synthesized. Override via `components={{ Dropdown }}`.
 */
export function CalendarDropdown({
  options = [],
  value,
  onChange,
  disabled,
  'aria-label': ariaLabel,
}: DropdownProps) {
  const { size } = React.useContext(CalendarContext);
  const items = React.useMemo(
    () => options.map(({ value, label }) => ({ value, label })),
    [options]
  );

  return (
    <Select
      items={items}
      value={Number(value)}
      disabled={disabled}
      onValueChange={(next) => {
        onChange?.({
          target: { value: String(next) },
        } as unknown as React.ChangeEvent<HTMLSelectElement>);
      }}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        style={[styles.dropdownTrigger, cellHeights[size], textSizes[size]]}
      >
        {/* Every label is stacked in one grid cell, all but the selected one
            hidden: the trigger is then always as wide as the longest month
            name in the active locale, so nothing truncates and the caption
            does not resize as the months change. */}
        <span {...stylex.props(styles.dropdownSizer)}>
          <span {...stylex.props(styles.dropdownLabel)}>
            <SelectValue />
          </span>
          {options.map((option) => (
            <span
              key={option.value}
              aria-hidden
              {...stylex.props(styles.dropdownLabel, styles.dropdownGhost)}
            >
              {option.label}
            </span>
          ))}
        </span>
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        style={styles.dropdownPopup}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const cellSizes = stylex.create({
  sm: { height: space.s7, width: space.s7 },
  md: { height: space.s8, width: space.s8 },
});

const cellHeights = stylex.create({
  sm: { height: space.s7 },
  md: { height: space.s8 },
});

// Room the caption leaves at both ends for the pinned nav buttons — one cell
// wide, so the caption content clears them at every size.
const navGutters = stylex.create({
  sm: { paddingInline: space.s7 },
  md: { paddingInline: space.s8 },
});

// One text scale for everything that reads as calendar body copy: the day
// numbers, the caption label, and the dropdown triggers.
const textSizes = stylex.create({
  sm: { fontSize: fontSize.xs },
  md: { fontSize: fontSize.sm },
});

const styles = stylex.create({
  root: {
    color: colors.foreground,
    display: 'inline-block',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.control,
    // Never wider than whatever the calendar is dropped into (a popover, a
    // narrow card): the months strip below wraps instead of overflowing.
    maxWidth: '100%',
    padding: space.s3,
  },
  // Months wrap when they no longer fit side by side; the wrapped rows stay
  // centred under the container rather than hugging its start edge.
  months: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s4,
    justifyContent: 'center',
  },
  month: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    // Anchors the two nav buttons to this month's caption row.
    position: 'relative',
  },
  // Only rendered for `navLayout="after"`: both chevrons in a row under the
  // caption. The `around` layout pins them individually (navButtonStart/End).
  nav: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s1,
    justifyContent: 'flex-end',
  },
  navButton: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover:not([aria-disabled="true"])': colors.accent,
    },
    borderRadius: radius.md,
    borderStyle: 'none',
    color: {
      default: colors.foreground,
      ':hover:not([aria-disabled="true"])': colors.accentForeground,
    },
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    opacity: { default: 1, '[aria-disabled="true"]': 0.5 },
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    outlineOffset: `calc(-1 * ${stroke.border})`,
    padding: 0,
    pointerEvents: { default: 'auto', '[aria-disabled="true"]': 'none' },
    transitionDuration: duration.fast,
    transitionProperty: 'background-color, color',
  },
  // Pinned to the caption row of the month they belong to. Absolute, and the
  // caption is not positioned, so the chevrons stay on top of it and stay
  // clickable.
  navButtonStart: {
    insetInlineStart: 0,
    position: 'absolute',
    top: 0,
  },
  navButtonEnd: {
    insetInlineEnd: 0,
    position: 'absolute',
    top: 0,
  },
  monthCaption: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  captionLabel: {
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.control,
    userSelect: 'none',
  },
  dropdowns: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s1,
    justifyContent: 'center',
  },
  dropdownTrigger: {
    // Content-width, and never squeezed by the caption: the month name has to
    // fit whatever the grid below happens to be wide.
    flexShrink: 0,
    fontWeight: fontWeight.medium,
    gap: space.s1,
    minWidth: null,
    paddingInline: space.s2,
  },
  // One grid cell holding every label; the widest one sets the width.
  dropdownSizer: {
    alignItems: 'center',
    display: 'grid',
  },
  dropdownLabel: {
    gridColumnStart: 1,
    gridRowStart: 1,
  },
  dropdownGhost: {
    visibility: 'hidden',
  },
  // The popup pads and indents its items, so anchor width alone would clip
  // the very labels the trigger was widened to fit.
  dropdownPopup: {
    maxWidth: 'var(--available-width)',
    minWidth: 'var(--anchor-width)',
    width: 'auto',
  },
  monthGrid: {
    borderCollapse: 'collapse',
    borderSpacing: 0,
    // Keeps the grid centred when the caption (dropdowns) is the wider row.
    marginInline: 'auto',
  },
  // Weekday column headers and week-number row headers share one look.
  gridHeader: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    fontWeight: 'normal',
    padding: 0,
    textAlign: 'center',
    userSelect: 'none',
  },
  day: {
    padding: 0,
    textAlign: 'center',
  },
  // Range band: the cells carry the accent strip so it reads as one bar; the
  // buttons at both ends sit on top in primary.
  rangeStart: {
    backgroundColor: colors.accent,
    borderBottomLeftRadius: radius.md,
    borderTopLeftRadius: radius.md,
  },
  rangeMiddle: {
    backgroundColor: colors.accent,
    borderRadius: 0,
  },
  rangeEnd: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  hiddenDay: {
    visibility: 'hidden',
  },
  footer: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    paddingTop: space.s3,
  },
  dayButton: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
    },
    borderRadius: radius.md,
    borderStyle: 'none',
    color: {
      default: colors.foreground,
      ':hover': colors.accentForeground,
    },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font.sans,
    fontWeight: 'normal',
    justifyContent: 'center',
    lineHeight: lineHeight.none,
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    outlineOffset: `calc(-1 * ${stroke.border})`,
    padding: 0,
    transitionDuration: duration.fast,
    transitionProperty: 'background-color, color',
    userSelect: 'none',
  },
  dayButtonOutside: {
    color: colors.mutedForeground,
  },
  dayButtonToday: {
    backgroundColor: {
      default: colors.accent,
      ':hover': colors.accent,
    },
    color: colors.accentForeground,
  },
  dayButtonRangeMiddle: {
    backgroundColor: {
      default: 'transparent',
      ':hover': `color-mix(in srgb, ${colors.accent} 80%, ${colors.foreground} 4%)`,
    },
    color: colors.accentForeground,
  },
  dayButtonSelected: {
    backgroundColor: {
      default: colors.primary,
      ':hover': colors.primary,
    },
    color: {
      default: colors.primaryForeground,
      ':hover': colors.primaryForeground,
    },
  },
  dayButtonDisabled: {
    backgroundColor: 'transparent',
    color: colors.mutedForeground,
    cursor: 'not-allowed',
    opacity: 0.5,
  },
});
