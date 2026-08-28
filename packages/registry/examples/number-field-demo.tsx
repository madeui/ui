import { Label } from '@/components/ui/label';
import { NumberField, NumberFieldGroup } from '@/components/ui/number-field';

export default function NumberFieldDemo() {
  return (
    <NumberField defaultValue={5} min={0} max={100}>
      <Label>
        Quantity
        <NumberFieldGroup />
      </Label>
    </NumberField>
  );
}
