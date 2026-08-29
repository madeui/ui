import * as stylex from '@stylexjs/stylex';

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { container } from '@/lib/constants.stylex';

export default function TextareaWithField() {
  return (
    <Field style={styles.root}>
      <FieldLabel htmlFor="textarea-with-field-bio">Bio</FieldLabel>
      <Textarea
        id="textarea-with-field-bio"
        placeholder="Tell us a little about yourself"
      />
      <FieldDescription>
        You can @mention other users and organizations.
      </FieldDescription>
    </Field>
  );
}

const styles = stylex.create({
  root: {
    width: container.lg,
  },
});
