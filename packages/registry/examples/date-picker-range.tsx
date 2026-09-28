'use client';

import * as React from 'react';

import { addDays } from 'date-fns';

import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
  type DateRange,
} from '@/components/ui/date-picker';

export default function DatePickerRange() {
  // A fixed day rather than today, so the server and the browser render the same month.
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const from = new Date(new Date().getFullYear(), 0, 12);
    return { from, to: addDays(from, 6) };
  });

  return (
    <DatePicker mode="range" value={range} onValueChange={setRange}>
      <DatePickerTrigger />
      <DatePickerContent numberOfMonths={2} />
    </DatePicker>
  );
}
