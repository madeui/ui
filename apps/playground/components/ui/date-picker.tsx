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

// Controlled / uncontrolled state in one hook: the controlled value wins
// whenever it is passed, the internal state carries the uncontrolled case.
function useControlled<T>(
  controlled: T | undefined,
  defaultValue: T | undefined,
  onChange?: (next: T) => void
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
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
    format = 'PPP',
    locale,
    disabled = false,
    placeholder = mode === 'range' ? 'Pick a date range' : 'Pick a date',
    open: openProp,
    defaultOpen,
    onOpenChange,
    children,
  } = props;

  const [value, setValue] = useControlled<DatePickerValueType>(
    valueProp,
    defaultValue,
    onValueChange as ((next: DatePickerValueType) => void) | undefined
  );
  const [open, setOpen] = useControlled<boolean>(openProp, defaultOpen ?? false);

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
  // A click on a complete range starts a new one instead of stretching it;
  // otherwise every click after the first pick would close the popover.
  resetOnSelect = true,
  ...calendarProps
}: DatePickerContentProps) {
  const { mode, value, setValue, setOpen, locale } =
    useDatePicker('DatePickerContent');

  const shared = {
    ...calendarProps,
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
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    padding: space.s3,
    width: 'auto',
  },
  calendar: {
    padding: 0,
  },
});
