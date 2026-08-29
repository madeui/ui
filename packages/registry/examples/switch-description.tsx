import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

export default function SwitchDescription() {
  return (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor="switch-description-marketing">
          Marketing emails
        </FieldLabel>
        <FieldDescription>
          Receive emails about new products and features.
        </FieldDescription>
      </FieldContent>
      <Switch id="switch-description-marketing" />
    </Field>
  );
}
