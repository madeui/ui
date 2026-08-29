import * as stylex from '@stylexjs/stylex';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { container } from '@/lib/constants.stylex';

export default function TextareaInvalid() {
  return (
    <Field invalid style={styles.root}>
      <FieldLabel htmlFor="textarea-invalid-bio">Bio</FieldLabel>
      <Textarea id="textarea-invalid-bio" defaultValue="Hi" />
      <FieldError>Bio must be at least 10 characters.</FieldError>
    </Field>
  );
}

const styles = stylex.create({
  root: {
    width: container.lg,
  },
});
