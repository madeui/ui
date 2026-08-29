import { Label } from '@/components/ui/label';
import { NumberField, NumberFieldGroup } from '@/components/ui/number-field';

export default function NumberFieldMinMaxStep() {
  return (
    <NumberField defaultValue={20} min={0} max={100} step={5}>
      <Label>
        Volume
        <NumberFieldGroup />
      </Label>
    </NumberField>
  );
}
