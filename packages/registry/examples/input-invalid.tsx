import * as stylex from '@stylexjs/stylex';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { container } from '@/lib/constants.stylex';

export default function InputInvalid() {
  return (
    <Field invalid style={styles.root}>
      <FieldLabel htmlFor="input-invalid-email">Email</FieldLabel>
      <Input
        id="input-invalid-email"
        type="email"
        defaultValue="not-an-email"
      />
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  );
}

const styles = stylex.create({
  root: {
    width: container.sm,
  },
});
