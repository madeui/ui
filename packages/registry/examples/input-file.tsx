import * as stylex from '@stylexjs/stylex';

import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { container } from '@/lib/constants.stylex';

export default function InputFile() {
  return (
    <Field style={styles.root}>
      <FieldLabel htmlFor="input-file-picture">Picture</FieldLabel>
      <Input id="input-file-picture" type="file" />
    </Field>
  );
}

const styles = stylex.create({
  root: {
    width: container.sm,
  },
});
