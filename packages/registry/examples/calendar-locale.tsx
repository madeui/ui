'use client';

import * as React from 'react';

import { tr } from 'date-fns/locale';

import { Calendar } from '@/components/ui/calendar';

export default function CalendarLocale() {
  // A fixed day rather than today, so the server and the browser render the same month.
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 0, 12)
  );

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={date}
      locale={tr}
      weekStartsOn={1}
    />
  );
}
