import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NumberField, NumberFieldGroup } from '@/components/ui/number-field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { space } from '@/lib/constants.stylex';

export default function RsvpCard() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Team offsite — RSVP</CardTitle>
        <CardDescription>Oct 14, Kaş. Deadline is Friday.</CardDescription>
      </CardHeader>
      <CardContent>
        <div {...stylex.props(styles.stack)}>
          <RadioGroup defaultValue="going" style={styles.radios}>
            <Label>
              <RadioGroupItem value="going" /> Going
            </Label>
            <Label>
              <RadioGroupItem value="maybe" /> Maybe
            </Label>
            <Label>
              <RadioGroupItem value="no" /> Can't make it
            </Label>
          </RadioGroup>
          <NumberField defaultValue={1} min={0} max={4}>
            <Label>
              Guests
              <NumberFieldGroup />
            </Label>
          </NumberField>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Send RSVP</Button>
      </CardFooter>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    width: '100%',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
  },
  radios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.s4,
  },
});
