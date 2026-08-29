import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

export default function SwitchInvalid() {
  return (
    <Field orientation="horizontal" invalid>
      <FieldContent>
        <FieldLabel htmlFor="switch-invalid-two-factor">
          Two-factor authentication
        </FieldLabel>
        <FieldError>Two-factor authentication is required.</FieldError>
      </FieldContent>
      <Switch id="switch-invalid-two-factor" />
    </Field>
  );
}
