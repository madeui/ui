'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from '@/components/ui/date-picker';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { space, fontSize, container } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

export default function DatePickerForm() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(date ? format(date, 'yyyy-MM-dd') : 'none');
      }}
      {...stylex.props(styles.form)}
    >
      <Field>
        <FieldLabel htmlFor="date-picker-form-trigger">Date of birth</FieldLabel>
        <DatePicker value={date} onValueChange={setDate}>
          <DatePickerTrigger id="date-picker-form-trigger" />
          <DatePickerContent captionLayout="dropdown" endMonth={new Date()} />
        </DatePicker>
        <FieldDescription>Used to calculate your age.</FieldDescription>
      </Field>
      <div {...stylex.props(styles.row)}>
        <Button type="submit">Submit</Button>
        {submitted && (
          <span {...stylex.props(styles.result)}>Submitted: {submitted}</span>
        )}
      </div>
    </form>
  );
}

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
    width: container.sm,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s3,
  },
  result: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
  },
});
