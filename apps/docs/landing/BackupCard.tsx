import * as stylex from '@stylexjs/stylex';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { space } from '@/lib/constants.stylex';

const times = [
  { label: '02:00', value: '02' },
  { label: '04:00', value: '04' },
  { label: '06:00', value: '06' },
];

export default function BackupCard() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Backup schedule</CardTitle>
        <CardDescription>Snapshots run while you sleep.</CardDescription>
      </CardHeader>
      <CardContent>
        <div {...stylex.props(styles.stack)}>
          <Field>
            <FieldLabel>Days</FieldLabel>
            <CheckboxGroup
              defaultValue={['mon', 'wed', 'fri']}
              aria-label="Backup days"
              style={styles.days}
            >
              <Label><Checkbox name="mon" /> Mon</Label>
              <Label><Checkbox name="tue" /> Tue</Label>
              <Label><Checkbox name="wed" /> Wed</Label>
              <Label><Checkbox name="thu" /> Thu</Label>
              <Label><Checkbox name="fri" /> Fri</Label>
            </CheckboxGroup>
          </Field>
          <Field>
            <FieldLabel>Time</FieldLabel>
            <Select items={times} defaultValue="04">
              <SelectTrigger style={styles.select}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {times.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Auto-delete</FieldTitle>
              <FieldDescription>Keep the last 30 snapshots.</FieldDescription>
            </FieldContent>
            <Switch defaultChecked aria-label="Auto-delete old snapshots" />
          </Field>
        </div>
      </CardContent>
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
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.s4,
  },
  select: {
    width: '100%',
  },
});
