import * as stylex from '@stylexjs/stylex';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { space } from '@/lib/constants.stylex';

const plans = [
  {
    value: 'starter',
    label: 'Starter',
    description: 'Up to 5 projects and community support.',
  },
  {
    value: 'pro',
    label: 'Pro',
    description: 'Unlimited projects and priority support.',
  },
];

export default function RadioGroupDescription() {
  return (
    <RadioGroup defaultValue="starter" style={styles.group}>
      {plans.map((plan) => (
        <Field key={plan.value} orientation="horizontal">
          <RadioGroupItem
            value={plan.value}
            id={`radio-group-description-${plan.value}`}
          />
          <FieldContent>
            <FieldLabel htmlFor={`radio-group-description-${plan.value}`}>
              {plan.label}
            </FieldLabel>
            <FieldDescription>{plan.description}</FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </RadioGroup>
  );
}

const styles = stylex.create({
  group: {
    gap: space.s4,
  },
});
