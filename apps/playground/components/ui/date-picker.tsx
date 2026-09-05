'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import { format as formatDate, type Locale } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange, PropsBase, PropsRange } from 'react-day-picker';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar, type CalendarSize } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  type PopoverContentProps,
  PopoverTrigger,
} from '@/components/ui/popover';
import { icon } from '@/lib/stylex-utils';
import { space, fontSize, container } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

export type { DateRange } from 'react-day-picker';

export type DatePickerMode = 'single' | 'range';

interface StyleProp {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

interface DatePickerBaseProps
  extends Pick<
    React.ComponentPropsWithoutRef<typeof Popover>,
    'open' | 'defaultOpen' | 'onOpenChange'
  > {
  /** date-fns format string used by `DatePickerValue`. */
  format?: string;
  /** date-fns locale, used for both the formatted value and the calendar. */
  locale?: Locale;
  /** Disables the trigger. */
  disabled?: boolean;
  /** Text shown by `DatePickerValue` while nothing is selected. */
  placeholder?: string;
  children?: React.ReactNode;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: 'single';
  value?: Date | undefined;
  defaultValue?: Date | undefined;
  onValueChange?: (value: Date | undefined) => void;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: 'range';
  value?: DateRange | undefined;
  defaultValue?: DateRange | undefined;
  onValueChange?: (value: DateRange | undefined) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

type DatePickerValueType = Date | DateRange | undefined;

interface DatePickerContextValue {
  mode: DatePickerMode;
  value: DatePickerValueType;
  setValue: (next: DatePickerValueType) => void;
  setOpen: (open: boolean) => void;
  format: string;
  locale: Locale | undefined;
  placeholder: string;
  disabled: boolean;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(
  null
);

function useDatePicker(part: string) {
  const context = React.useContext(DatePickerContext);
  if (!context) {
    throw new Error(`${part} must be rendered inside <DatePicker>.`);
  }
  return context;
}

// Controlled / uncontrolled state in one hook. `isControlled` is passed in
// rather than derived from `controlled !== undefined`, because `undefined` is
// a real controlled value here — an empty selection.
function useControlled<T>(
  isControlled: boolean,
  controlled: T | undefined,
  defaultValue: T | undefined,
  onChange?: (next: T) => void
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = isControlled ? controlled : uncontrolled;
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );
  return [value, set] as const;
}

/**
 * Composes Popover, Button, and Calendar into a date (or date range) picker
 * with the selection state held here. The popover closes after a single
 * date is chosen; in range mode it stays open until both ends are set.
 */
export function DatePicker(props: DatePickerProps) {
  const {
    mode = 'single',
    value: valueProp,
    defaultValue,
    onValueChange,
    // A range prints two dates side by side, so it defaults to the shorter
    // `PP` ("Sep 5, 2026") — `PPP` twice overruns the trigger.
    format = mode === 'range' ? 'PP' : 'PPP',
    locale,
    disabled = false,
    placeholder = mode === 'range' ? 'Pick a date range' : 'Pick a date',
    open: openProp,
    defaultOpen,
    onOpenChange,
    children,
  } = props;

  const [value, setValue] = useControlled<DatePickerValueType>(
    'value' in props,
    valueProp,
    defaultValue,
    onValueChange as ((next: DatePickerValueType) => void) | undefined
  );
  const [open, setOpen] = useControlled<boolean>(
    openProp !== undefined,
    openProp,
    defaultOpen ?? false
  );

  const context = React.useMemo<DatePickerContextValue>(
    () => ({
      mode,
      value,
      setValue,
      setOpen,
      format,
      locale,
      placeholder,
      disabled,
    }),
    [mode, value, setValue, setOpen, format, locale, placeholder, disabled]
  );

  return (
    <DatePickerContext.Provider value={context}>
      <Popover
        open={open}
        onOpenChange={(next, eventDetails) => {
          setOpen(next);
          onOpenChange?.(next, eventDetails);
        }}
      >
        {children}
      </Popover>
    </DatePickerContext.Provider>
  );
}

function hasValue(mode: DatePickerMode, value: DatePickerValueType) {
  if (!value) return false;
  return mode === 'range' ? Boolean((value as DateRange).from) : true;
}

export type DatePickerTriggerProps = ButtonProps;

/** Our Button as the popover trigger, with a leading calendar icon. */
export function DatePickerTrigger({
  variant = 'outline',
  style,
  children,
  disabled,
  ...props
}: DatePickerTriggerProps) {
  const context = useDatePicker('DatePickerTrigger');
  const empty = !hasValue(context.mode, context.value);
  return (
    <PopoverTrigger
      render={
        <Button
          variant={variant}
          disabled={disabled ?? context.disabled}
          {...props}
          style={[styles.trigger, empty && styles.triggerEmpty, style]}
        />
      }
    >
      <CalendarIcon {...stylex.props(icon.md)} />
      {children ?? <DatePickerValue />}
    </PopoverTrigger>
  );
}

function formatValue(context: DatePickerContextValue) {
  const { mode, value, format, locale } = context;
  if (!hasValue(mode, value)) return null;
  const options = { locale };
  if (mode === 'range') {
    const { from, to } = value as DateRange;
    const start = formatDate(from as Date, format, options);
    return to ? `${start} – ${formatDate(to, format, options)}` : start;
  }
  return formatDate(value as Date, format, options);
}

/** The formatted selection (or the placeholder) as a span. */
export function DatePickerValue({
  style,
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'span'>, 'className' | 'style'> &
  StyleProp) {
  const context = useDatePicker('DatePickerValue');
  return (
    <span {...props} {...stylex.props(styles.value, style)}>
      {children ?? formatValue(context) ?? context.placeholder}
    </span>
  );
}

// Calendar props the content forwards. The selection wiring (`mode`,
// `selected`, `onSelect`, `locale`) comes from the DatePicker context.
type CalendarPassthroughProps = Omit<
  PropsBase,
  'mode' | 'required' | 'className' | 'style' | 'locale'
> &
  Pick<PropsRange, 'min' | 'max' | 'excludeDisabled' | 'resetOnSelect'>;

export interface DatePickerContentProps
  extends Pick<
      PopoverContentProps,
      'side' | 'sideOffset' | 'align' | 'alignOffset'
    >,
    CalendarPassthroughProps,
    StyleProp {
  /** Day cell size of the calendar. */
  size?: CalendarSize;
  /** Rendered above the calendar — presets, extra controls. */
  children?: React.ReactNode;
}

// Months sit side by side, so more than one needs room the small viewports do
// not have: below this breakpoint the calendar drops back to a single month
// instead of wrapping the strip or pushing the popup past the screen edge.
const MULTI_MONTH_QUERY = '(min-width: 640px)';

function subscribeToMultiMonth(onChange: () => void) {
  const query = window.matchMedia(MULTI_MONTH_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

// Server render assumes the wide layout; the popup only mounts on open, which
// is always after hydration, so the first painted popup is already correct.
function useFitsMultipleMonths() {
  return React.useSyncExternalStore(
    subscribeToMultiMonth,
    () => window.matchMedia(MULTI_MONTH_QUERY).matches,
    () => true
  );
}

/**
 * PopoverContent with the wired Calendar. `children` render before the
 * calendar in a column; every other prop goes to the Calendar.
 */
export function DatePickerContent({
  side,
  sideOffset,
  align = 'start',
  alignOffset,
  style,
  size,
  children,
  defaultMonth,
  numberOfMonths,
  // The calendar takes focus on open (the selected day, else today), so the
  // arrow keys work straight away instead of after tabbing past the nav.
  autoFocus = true,
  // A click on a complete range starts a new one instead of stretching it;
  // otherwise every click after the first pick would close the popover.
  resetOnSelect = true,
  ...calendarProps
}: DatePickerContentProps) {
  const { mode, value, setValue, setOpen, locale } =
    useDatePicker('DatePickerContent');
  const fitsMultipleMonths = useFitsMultipleMonths();

  const shared = {
    ...calendarProps,
    autoFocus,
    numberOfMonths: fitsMultipleMonths ? numberOfMonths : 1,
    size,
    locale,
    style: styles.calendar,
  };

  const calendar =
    mode === 'range' ? (
      <Calendar
        {...shared}
        mode="range"
        resetOnSelect={resetOnSelect}
        selected={value as DateRange | undefined}
        defaultMonth={defaultMonth ?? (value as DateRange | undefined)?.from}
        onSelect={(next) => {
          setValue(next);
          if (next?.from && next.to) setOpen(false);
        }}
      />
    ) : (
      <Calendar
        {...shared}
        mode="single"
        selected={value as Date | undefined}
        defaultMonth={defaultMonth ?? (value as Date | undefined)}
        onSelect={(next) => {
          setValue(next);
          if (next) setOpen(false);
        }}
      />
    );

  return (
    <PopoverContent
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      // The calendar takes focus itself (see `autoFocus`); without this Base
      // UI would move focus to the first tabbable element, the nav button.
      // With `autoFocus={false}` its default focus handling stays in charge.
      initialFocus={!autoFocus}
      style={[styles.content, style]}
    >
      {children}
      {calendar}
    </PopoverContent>
  );
}

const styles = stylex.create({
  trigger: {
    fontWeight: 'normal',
    justifyContent: 'flex-start',
    minWidth: container.sm,
    textAlign: 'left',
  },
  triggerEmpty: {
    color: colors.mutedForeground,
  },
  value: {
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  // Sizing rule: the popup is as wide as the calendar asks for, but never
  // narrower than the trigger (`--anchor-width`) and never wider than the
  // room the viewport leaves (`--available-width`), so a two-month calendar
  // is free to outgrow the trigger while a one-month one lines up with it.
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    maxHeight: 'var(--available-height)',
    maxWidth: 'var(--available-width)',
    minWidth: 'var(--anchor-width)',
    overflow: 'auto',
    padding: space.s3,
    width: 'auto',
  },
  // Centred rather than stretched: the calendar keeps its natural width, so
  // the nav chevrons stay on the edges of the month grid when the popup is
  // wider than the calendar.
  calendar: {
    alignSelf: 'center',
    padding: 0,
  },
});
