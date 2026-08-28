'use client';

import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { container } from '@/lib/constants.stylex';

export default function FormDemo() {
  return (
    <Form
      style={styles.form}
      onFormSubmit={(values) => {
        console.log(values);
      }}
    >
      <Field
        name="username"
        validate={(value) =>
          typeof value === 'string' && value.length < 2
            ? 'Username must be at least 2 characters.'
            : null
        }
      >
        <FieldLabel>Username</FieldLabel>
        <Input placeholder="madeui" required />
        <FieldDescription>This is your public display name.</FieldDescription>
        <FieldError />
      </Field>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="m@example.com" required />
        <FieldError />
      </Field>
      <Button type="submit" style={styles.submit}>
        Submit
      </Button>
    </Form>
  );
}

const styles = stylex.create({
  form: {
    maxWidth: container.md,
  },
  submit: {
    alignSelf: 'flex-start',
  },
});
