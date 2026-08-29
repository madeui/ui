import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';

export default function CheckboxDescription() {
  return (
    <Field orientation="horizontal">
      <Checkbox id="checkbox-description-newsletter" defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor="checkbox-description-newsletter">
          Newsletter
        </FieldLabel>
        <FieldDescription>
          Receive occasional product updates and announcements.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}
