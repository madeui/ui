'use client';

import * as stylex from '@stylexjs/stylex';
import { useForm } from '@tanstack/react-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { container, space } from '@/lib/constants.stylex';

export default function FormTanstackForm() {
  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      {...stylex.props(styles.form)}
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
            <FieldLabel>Email</FieldLabel>
            <Input
              name={field.name}
              placeholder="m@example.com"
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
      <Button type="submit" style={styles.submit}>
        Submit
      </Button>
    </form>
  );
}

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s5,
    maxWidth: container.md,
    width: '100%',
  },
  submit: {
    alignSelf: 'flex-start',
  },
});
