# react-day-picker (Calendar, Date Picker)

Researched 2026-09-05 for the `calendar` and `date-picker` registry items.

## Facts

- Latest: 10.0.1 (v10 released 2026-05-08). Hard dependencies: `date-fns ^4.1`
  and `@date-fns/tz`. Peer: React ≥16.8. Source: npm registry,
  https://github.com/gpbl/react-day-picker/releases
- Package alias `@daypicker/react` exists and only re-exports
  `react-day-picker@10`. We depend on the real package.
- Styling: the optional `style.css` is not required. Every slot takes a class
  through the `classNames` prop; `components` replaces slot renderers
  (`DayButton`, `Chevron`, `WeekNumber`, `Dropdown`, ...). Source:
  https://daypicker.dev/docs/styling
- v10 breaking changes vs v9 are small: `fromMonth/toMonth` →
  `startMonth/endMonth`, `components.Button` removed, non-Gregorian calendars
  moved to separate packages.

## Decisions

- No CSS import; all slots styled with StyleX class names through `classNames`.
- Modes `single | multiple | range` pass through; `showOutsideDays` defaults to
  true; `captionLayout="dropdown"` renders month/year selects with our Select.
- The component cannot be composed in JSX, so we export slot components
  (`CalendarDayButton`, `CalendarChevron`, ...) that users pass through
  `components` to override.
- Date Picker is a compound component (`DatePicker`, `DatePickerTrigger`,
  `DatePickerValue`, `DatePickerContent`) built on Popover, Button, and
  Calendar; `mode` switches single/range; formatting uses `date-fns/format`
  since date-fns is already installed by react-day-picker.
