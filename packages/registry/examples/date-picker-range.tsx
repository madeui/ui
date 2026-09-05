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
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6),
  });

  return (
    <DatePicker mode="range" value={range} onValueChange={setRange}>
      <DatePickerTrigger />
      <DatePickerContent numberOfMonths={2} />
    </DatePicker>
  );
}
