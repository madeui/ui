'use client';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';

export default function CalendarDropdown() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(1990, 5, 15)
  );

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      defaultMonth={date}
      startMonth={new Date(1930, 0)}
      endMonth={new Date()}
    />
  );
}
