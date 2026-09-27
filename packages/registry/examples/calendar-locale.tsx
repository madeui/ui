'use client';

import * as React from 'react';

import { tr } from 'date-fns/locale';

import { Calendar } from '@/components/ui/calendar';

export default function CalendarLocale() {
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
