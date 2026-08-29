import * as stylex from '@stylexjs/stylex';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

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

export default function RadioGroupChoiceCard() {
  return (
    <RadioGroup defaultValue="pro" style={styles.group}>
      {plans.map((plan) => (
        <Field key={plan.value} orientation="horizontal">
          {/* The label is the card, so the whole surface toggles the radio. */}
          <FieldLabel style={styles.card}>
            <RadioGroupItem value={plan.value} />
            <FieldContent>
              <FieldTitle>{plan.label}</FieldTitle>
              <FieldDescription>{plan.description}</FieldDescription>
            </FieldContent>
          </FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  );
}

const styles = stylex.create({
  group: {
    gap: space.s3,
  },
  card: {
    alignItems: 'flex-start',
    borderColor: {
      default: colors.border,
      ':has([data-checked])': colors.primary,
    },
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    cursor: 'pointer',
    display: 'flex',
    gap: space.s3,
    padding: space.s4,
  },
});
