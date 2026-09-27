'use client';

import * as stylex from '@stylexjs/stylex';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { container, space } from '@/lib/constants.stylex';

export default function FormReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();

  return (
    <form
      onSubmit={handleSubmit((values) => {
        console.log(values);
      })}
      {...stylex.props(styles.form)}
    >
      <Field invalid={!!errors.email}>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          placeholder="m@example.com"
          {...register('email', { required: 'Email is required.' })}
        />
        <FieldError errors={[errors.email]} />
      </Field>
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
