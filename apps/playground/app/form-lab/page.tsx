'use client';

// Verifies the react-hook-form and TanStack Form recipes documented on the
// Form docs page compile and run against our Field/Input components.

import * as React from 'react';

import { useForm as useTanstackForm } from '@tanstack/react-form';
import * as stylex from '@stylexjs/stylex';
import { useForm as useRhfForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { space, fontSize, fontWeight, container } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

function RhfForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRhfForm<{ email: string }>();
  const [submitted, setSubmitted] = React.useState('');

  return (
    <form
      onSubmit={handleSubmit((values) => setSubmitted(values.email))}
      {...stylex.props(styles.form)}
      data-testid="rhf-form"
    >
      <Field invalid={!!errors.email}>
        <FieldLabel>Email (react-hook-form)</FieldLabel>
        <Input
          type="email"
          placeholder="m@example.com"
          {...register('email', { required: 'Email is required.' })}
        />
        <FieldError errors={[errors.email]} />
      </Field>
      <Button type="submit" style={styles.selfStart}>
        Submit
      </Button>
      {submitted && <p {...stylex.props(styles.result)}>Submitted: {submitted}</p>}
    </form>
  );
}

function TanstackForm() {
  const [submitted, setSubmitted] = React.useState('');
  const form = useTanstackForm({
    defaultValues: { email: '' },
    onSubmit: ({ value }) => setSubmitted(value.email),
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      {...stylex.props(styles.form)}
      data-testid="tanstack-form"
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            value.includes('@') ? undefined : 'Enter a valid email.',
        }}
      >
        {(field) => (
          <Field invalid={field.state.meta.errors.length > 0}>
            <FieldLabel>Email (TanStack Form)</FieldLabel>
            <Input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldError
              errors={field.state.meta.errors.map((message) => ({
                message: String(message),
              }))}
            />
          </Field>
        )}
      </form.Field>
      <Button type="submit" style={styles.selfStart}>
        Submit
      </Button>
      {submitted && <p {...stylex.props(styles.result)}>Submitted: {submitted}</p>}
    </form>
  );
}

export default function FormLab() {
  return (
    <main {...stylex.props(styles.page)}>
      <h1 {...stylex.props(styles.heading)}>Form library integration lab</h1>
      <RhfForm />
      <TanstackForm />
    </main>
  );
}

const styles = stylex.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s10,
    marginInline: 'auto',
    maxWidth: container.xl,
    padding: space.s8,
  },
  heading: {
    color: colors.foreground,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s5,
  },
  selfStart: {
    alignSelf: 'flex-start',
  },
  result: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    margin: 0,
  },
});
