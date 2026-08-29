import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';

export default function CheckboxInvalid() {
  return (
    <Field orientation="horizontal" invalid>
      <Checkbox id="checkbox-invalid-terms" />
      <FieldContent>
        <FieldLabel htmlFor="checkbox-invalid-terms">
          Accept terms and conditions
        </FieldLabel>
        <FieldError>You must accept the terms to continue.</FieldError>
      </FieldContent>
    </Field>
  );
}
