'use client';

import * as React from 'react';

import { tr } from 'date-fns/locale';

import { Calendar } from '@/components/ui/calendar';

export default function CalendarLocale() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      locale={tr}
      weekStartsOn={1}
    />
  );
}
