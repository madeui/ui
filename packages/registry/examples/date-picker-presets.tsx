'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import { addDays } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from '@/components/ui/date-picker';
import { space } from '@/lib/constants.stylex';

const presets = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In a week', days: 7 },
];

export default function DatePickerPresets() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <DatePicker
      open={open}
      onOpenChange={setOpen}
      value={date}
      onValueChange={setDate}
    >
      <DatePickerTrigger />
      <DatePickerContent>
        <div {...stylex.props(styles.presets)}>
          {presets.map(({ label, days }) => (
            <Button
              key={label}
              variant="outline"
              size="xs"
              onClick={() => {
                setDate(addDays(new Date(), days));
                // A preset is a complete choice, so it closes the popover the
                // same way picking a day in the calendar does.
                setOpen(false);
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </DatePickerContent>
    </DatePicker>
  );
}

const styles = stylex.create({
  presets: {
    display: 'flex',
    gap: space.s2,
  },
});
