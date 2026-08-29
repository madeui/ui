import { Label } from '@/components/ui/label';
import { NumberField, NumberFieldGroup } from '@/components/ui/number-field';

export default function NumberFieldFormatted() {
  return (
    <NumberField
      defaultValue={49.99}
      min={0}
      step={1}
      format={{ style: 'currency', currency: 'USD' }}
    >
      <Label>
        Price
        <NumberFieldGroup />
      </Label>
    </NumberField>
  );
}
