import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { container, space } from '@/lib/constants.stylex';

export default function InputWithButton() {
  return (
    <Field style={styles.root}>
      <FieldLabel htmlFor="input-with-button-search">Search</FieldLabel>
      <div {...stylex.props(styles.row)}>
        <Input id="input-with-button-search" placeholder="Search…" />
        <Button type="submit">Search</Button>
      </div>
    </Field>
  );
}

const styles = stylex.create({
  root: {
    width: container.md,
  },
  row: {
    display: 'flex',
    gap: space.s2,
  },
});
