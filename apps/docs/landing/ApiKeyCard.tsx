import * as stylex from '@stylexjs/stylex';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { space } from '@/lib/constants.stylex';

const scopes = [
  { label: 'Read-only', value: 'read' },
  { label: 'Read and write', value: 'write' },
  { label: 'Admin', value: 'admin' },
];

export default function ApiKeyCard() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>New API key</CardTitle>
        <CardDescription>Scoped keys expire automatically.</CardDescription>
        <CardAction>
          <Badge variant="outline">30 days</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div {...stylex.props(styles.stack)}>
          <Field>
            <FieldLabel htmlFor="key-name">Key name</FieldLabel>
            <Input id="key-name" placeholder="ci-deploy" />
          </Field>
          <Field>
            <FieldLabel>Scope</FieldLabel>
            <Select items={scopes} defaultValue="read">
              <SelectTrigger style={styles.select}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scopes.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <InputGroup>
            <InputGroupInput defaultValue="mk_live_4f8a…c21" readOnly />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="outline">Copy</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Generate key</Button>
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
  select: {
    width: '100%',
  },
});
