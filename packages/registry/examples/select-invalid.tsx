import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

const plans = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
];

export default function SelectInvalid() {
  return (
    <Field invalid>
      <FieldLabel htmlFor="select-invalid-plan">Plan</FieldLabel>
      <Select items={plans}>
        <SelectTrigger id="select-invalid-plan">
          <SelectValue placeholder="Select a plan" />
        </SelectTrigger>
        <SelectContent>
          {plans.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError>Please select a plan to continue.</FieldError>
    </Field>
  );
}
