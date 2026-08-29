import * as stylex from '@stylexjs/stylex';

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { container } from '@/lib/constants.stylex';

export default function FieldDemo() {
  return (
    <FieldSet style={styles.root}>
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-name">Name</FieldLabel>
          <Input id="field-name" placeholder="Evil Rabbit" />
          <FieldDescription>Shown on your public profile.</FieldDescription>
        </Field>
        <FieldSeparator>Contact</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" type="email" placeholder="you@example.com" />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

const styles = stylex.create({
  root: {
    width: container.sm,
  },
});
