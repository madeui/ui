'use client';

import * as React from 'react';

import { addDays } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';

export default function CalendarMultiple() {
  const [dates, setDates] = React.useState<Date[] | undefined>([
    new Date(),
    addDays(new Date(), 2),
    addDays(new Date(), 5),
  ]);

  return (
    <Calendar mode="multiple" selected={dates} onSelect={setDates} max={5} />
  );
}
