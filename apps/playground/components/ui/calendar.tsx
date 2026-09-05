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
  navLayout,
  ...props
}: CalendarProps) {
  const classNames = React.useMemo(
    () => ({
      root: cx(styles.root, style),
      months: cx(styles.months),
      month: cx(styles.month),
      nav: cx(navLayout === 'after' ? styles.navAfter : styles.nav, cellHeights[size]),
      button_previous: cx(styles.navButton, cellSizes[size]),
      button_next: cx(styles.navButton, cellSizes[size]),
      month_caption: cx(styles.monthCaption, captionSizes[size]),
      caption_label: cx(styles.captionLabel),
      dropdowns: cx(styles.dropdowns),
      month_grid: cx(styles.monthGrid),
      weekday: cx(styles.gridHeader, cellSizes[size]),
      week_number_header: cx(styles.weekNumberHeader, cellSizes[size]),
      day: cx(styles.day, cellSizes[size]),
      range_start: cx(styles.rangeStart),
      range_middle: cx(styles.rangeMiddle),
      range_end: cx(styles.rangeEnd),
      hidden: cx(styles.hiddenDay),
      footer: cx(styles.footer),
      ...userClassNames,
    }),
    [size, style, navLayout, userClassNames]
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
        dayButtonSizes[size],
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
        style={[styles.dropdownTrigger, cellHeights[size]]}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
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

// Caption keeps the absolutely positioned nav buttons clear on both sides.
const captionSizes = stylex.create({
  sm: { height: space.s7, paddingInline: space.s7 },
  md: { height: space.s8, paddingInline: space.s8 },
});

const dayButtonSizes = stylex.create({
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
    padding: space.s3,
    position: 'relative',
  },
  months: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s4,
    position: 'relative',
  },
  month: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
  },
  // Previous/next float over the caption row, one at each end of the months
  // strip (the caption reserves the room through its inline padding).
  nav: {
    alignItems: 'center',
    display: 'flex',
    insetInline: 0,
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
  },
  navAfter: {
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
  monthCaption: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  captionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.control,
    userSelect: 'none',
  },
  dropdowns: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s1,
    justifyContent: 'center',
    position: 'relative',
  },
  dropdownTrigger: {
    fontWeight: fontWeight.medium,
    gap: space.s1,
    minWidth: null,
    paddingInline: space.s2,
  },
  monthGrid: {
    borderCollapse: 'collapse',
    borderSpacing: 0,
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
  weekNumberHeader: {
    padding: 0,
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
