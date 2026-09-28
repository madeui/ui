'use client';

import * as React from 'react';

import { addDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';

export default function CalendarRange() {
  // A fixed day rather than today, so the server and the browser render the same month.
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const from = new Date(new Date().getFullYear(), 0, 12);
    return { from, to: addDays(from, 6) };
  });

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={range?.from}
      numberOfMonths={2}
    />
  );
}
