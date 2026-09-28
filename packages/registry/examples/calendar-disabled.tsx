'use client';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';

export default function CalendarDisabled() {
  const [date, setDate] = React.useState<Date | undefined>();
  // Fixed days rather than today, so the server and the browser render the same month.
  const year = new Date().getFullYear();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(year, 0)}
      disabled={[{ dayOfWeek: [0, 6] }, { before: new Date(year, 0, 12) }]}
    />
  );
}
