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

  return (
    <DatePicker value={date} onValueChange={setDate}>
      <DatePickerTrigger />
      <DatePickerContent>
        <div {...stylex.props(styles.presets)}>
          {presets.map(({ label, days }) => (
            <Button
              key={label}
              variant="outline"
              size="xs"
              onClick={() => setDate(addDays(new Date(), days))}
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
