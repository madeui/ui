import * as stylex from '@stylexjs/stylex';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { space } from '@/lib/constants.stylex';

// Loose cluster of primitives — no scenario, just the parts.
export default function KitchenSink() {
  return (
    <div {...stylex.props(styles.stack)}>
      <div {...stylex.props(styles.row)}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <Input placeholder="you@example.com" aria-label="Email" />
      <div {...stylex.props(styles.row)}>
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="outline">v1.0.0</Badge>
        <Badge>New</Badge>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <RadioGroup defaultValue="all" style={styles.radioRow}>
        <Label>
          <RadioGroupItem value="all" /> All
        </Label>
        <Label>
          <RadioGroupItem value="unread" /> Unread
        </Label>
      </RadioGroup>
      <div {...stylex.props(styles.row)}>
        <Label>
          <Checkbox defaultChecked /> Remember me
        </Label>
        <Switch defaultChecked aria-label="Enabled" />
      </div>
    </div>
  );
}

const styles = stylex.create({
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
    padding: space.s2,
    width: '100%',
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s3,
  },
  radioRow: {
    flexDirection: 'row',
    gap: space.s5,
  },
});
