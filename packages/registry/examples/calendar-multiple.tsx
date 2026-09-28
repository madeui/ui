'use client';

import * as React from 'react';

import { addDays } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';

export default function CalendarMultiple() {
  // A fixed day rather than today, so the server and the browser render the same month.
  const [dates, setDates] = React.useState<Date[] | undefined>(() => {
    const first = new Date(new Date().getFullYear(), 0, 12);
    return [first, addDays(first, 2), addDays(first, 5)];
  });

  return (
    <Calendar
      mode="multiple"
      selected={dates}
      onSelect={setDates}
      defaultMonth={dates?.[0]}
      max={5}
    />
  );
}
