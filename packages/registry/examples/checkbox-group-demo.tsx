import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Label } from '@/components/ui/label';

export default function CheckboxGroupDemo() {
  return (
    <CheckboxGroup defaultValue={['newsletter']} aria-label="Email preferences">
      <Label>
        <Checkbox name="newsletter" /> Newsletter
      </Label>
      <Label>
        <Checkbox name="product-updates" /> Product updates
      </Label>
      <Label>
        <Checkbox name="promotions" /> Promotions
      </Label>
    </CheckboxGroup>
  );
}
