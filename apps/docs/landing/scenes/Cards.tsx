import * as stylex from '@stylexjs/stylex';

import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Label } from '@/components/ui/label';
import { Meter, MeterLabel, MeterValue } from '@/components/ui/meter';
import { NumberField, NumberFieldGroup } from '@/components/ui/number-field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { space, fontSize, fontWeight } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

import { Part } from './Part';

const plans = [
  { value: 'starter', label: 'Starter', price: 'Free' },
  { value: 'team', label: 'Team', price: '$12 / seat' },
  { value: 'business', label: 'Business', price: '$29 / seat' },
];

const access = [
  { label: 'Anyone with the link', value: 'link' },
  { label: 'Team only', value: 'team' },
];

const shortcuts = [
  { action: 'Command palette', keys: ['⌘', 'K'] },
  { action: 'New invoice', keys: ['N'] },
  { action: 'Toggle theme', keys: ['⌘', '⇧', 'L'] },
];

// Nine small, self-contained moments on a 4x3 bento: the same components
// as the app screens, seen one task at a time. Tall cells hold the tasks
// with more steps; on tablet and phone the grid flows in reading order.
export default function Cards() {
  return (
    <div {...stylex.props(styles.grid)}>
      <Part name={['card', 'input-otp', 'button']} style={styles.verify}>
        <Card size="sm" style={styles.card}>
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>Code sent to mina@acme.dev.</CardDescription>
          </CardHeader>
          <CardContent>
            <InputOTP length={6} aria-label="Verification code">
              <InputOTPGroup>
                <InputOTPSlot />
                <InputOTPSlot />
                <InputOTPSlot />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot />
                <InputOTPSlot />
                <InputOTPSlot />
              </InputOTPGroup>
            </InputOTP>
          </CardContent>
          <CardFooter style={styles.footer}>
            <Button style={styles.full}>Verify</Button>
          </CardFooter>
        </Card>
      </Part>

      <Part name={['toggle-group', 'textarea', 'checkbox']} style={styles.rate}>
        <Card size="sm" style={styles.card}>
          <CardHeader>
            <CardTitle>Rate the onboarding</CardTitle>
            <CardDescription>One is rough, five is smooth.</CardDescription>
          </CardHeader>
          <CardContent style={styles.contentGrow}>
            <div {...stylex.props(styles.stack, styles.stackGrow)}>
              <ToggleGroup variant="outline" spacing="joined" defaultValue={['4']} aria-label="Rating">
                {['1', '2', '3', '4', '5'].map((n) => (
                  <ToggleGroupItem key={n} value={n} aria-label={`${n} of 5`} style={styles.rating}>
                    {n}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Textarea
                rows={4}
                placeholder="What would have made it a five?"
                aria-label="Feedback"
                style={styles.grow}
              />
              <Label>
                <Checkbox /> You can contact me about this
              </Label>
            </div>
          </CardContent>
          <CardFooter style={styles.footer}>
            <Button variant="secondary">Send feedback</Button>
          </CardFooter>
        </Card>
      </Part>

      <Part name={['radio-group', 'number-field', 'separator']} style={styles.plan}>
        <Card size="sm" style={styles.card}>
          <CardHeader>
            <CardTitle>Choose a plan</CardTitle>
            <CardDescription>Billed monthly, cancel anytime.</CardDescription>
          </CardHeader>
          <CardContent>
            <div {...stylex.props(styles.stack)}>
              <RadioGroup defaultValue="team" aria-label="Plan" style={styles.plans}>
                {plans.map((plan) => (
                  <Label key={plan.value} {...stylex.props(styles.planRow)}>
                    <RadioGroupItem value={plan.value} />
                    <span {...stylex.props(styles.planName)}>{plan.label}</span>
                    <span {...stylex.props(styles.planPrice)}>{plan.price}</span>
                  </Label>
                ))}
              </RadioGroup>
              <NumberField defaultValue={12} min={1} max={150}>
                <Label>
                  Seats
                  <NumberFieldGroup />
                </Label>
              </NumberField>
              <Separator />
              <div {...stylex.props(styles.total)}>
                <span {...stylex.props(styles.totalLabel)}>12 seats × $12</span>
                <span {...stylex.props(styles.totalValue)}>$144 / mo</span>
              </div>
            </div>
          </CardContent>
          <CardFooter style={styles.footer}>
            <Button>Continue</Button>
          </CardFooter>
        </Card>
      </Part>

      <Part name="checkbox-group" style={styles.notify}>
        <Card size="sm" style={styles.card}>
          <CardHeader>
            <CardTitle>Email notifications</CardTitle>
            <CardDescription>Pick what lands in your inbox.</CardDescription>
          </CardHeader>
          <CardContent>
            <CheckboxGroup defaultValue={['mentions', 'invoices']} aria-label="Email notifications">
              <Label>
                <Checkbox name="mentions" /> Mentions
              </Label>
              <Label>
                <Checkbox name="invoices" /> Invoice paid
              </Label>
              <Label>
                <Checkbox name="tips" /> Tips and tutorials
              </Label>
            </CheckboxGroup>
          </CardContent>
        </Card>
      </Part>

      <Part name="meter" style={styles.storage}>
        <Card size="sm" style={styles.card}>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>Attachments and exports.</CardDescription>
          </CardHeader>
          <CardContent>
            <Meter value={24} max={64} locale="en-US">
              <MeterLabel>Used</MeterLabel>
              <MeterValue>{(_, value) => `${value} of 64 GB`}</MeterValue>
            </Meter>
          </CardContent>
          <CardFooter style={styles.footer}>
            <Button variant="outline">Manage storage</Button>
          </CardFooter>
        </Card>
      </Part>

      <Part name={['slider', 'field', 'switch']} style={styles.budget}>
        <Card size="sm" style={styles.card}>
          <CardHeader>
            <CardTitle>Monthly budget</CardTitle>
            <CardDescription>Alerts fire when spend crosses the line.</CardDescription>
          </CardHeader>
          <CardContent>
            <div {...stylex.props(styles.stack)}>
              <Field>
                <FieldLabel>Budget · $2,400</FieldLabel>
                <Slider defaultValue={2400} min={0} max={5000} step={100} aria-label="Budget" />
              </Field>
              <Field>
                <FieldLabel>Alert at · 80%</FieldLabel>
                <Slider defaultValue={80} min={50} max={100} step={5} aria-label="Alert threshold" />
              </Field>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Pause spend at 100%</FieldTitle>
                  <FieldDescription>Resumes on the 1st.</FieldDescription>
                </FieldContent>
                <Switch defaultChecked aria-label="Pause spend at 100%" />
              </Field>
            </div>
          </CardContent>
          <CardFooter style={styles.footer}>
            <Button variant="secondary">Save</Button>
          </CardFooter>
        </Card>
      </Part>

      <Part name={['input-group', 'avatar', 'select']} style={styles.share}>
        <Card size="sm" style={styles.card}>
          <CardHeader>
            <CardTitle>Share Q3 report</CardTitle>
          </CardHeader>
          <CardContent>
            <div {...stylex.props(styles.stack)}>
              <InputGroup>
                <InputGroupInput defaultValue="acme.app/r/q3-2026" readOnly aria-label="Share link" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton variant="outline">Copy</InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <div {...stylex.props(styles.shareRow)}>
                <AvatarGroup>
                  <Avatar size="sm">
                    <AvatarFallback>JB</AvatarFallback>
                  </Avatar>
                  <Avatar size="sm">
                    <AvatarFallback>PN</AvatarFallback>
                  </Avatar>
                  <Avatar size="sm">
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                  <AvatarGroupCount size="sm">+2</AvatarGroupCount>
                </AvatarGroup>
                <Select items={access} defaultValue="team">
                  <SelectTrigger aria-label="Who can open the link">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {access.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </Part>

      <Part name={['alert', 'switch']} style={styles.alerts}>
        <div {...stylex.props(styles.stackCell)}>
          <Alert>
            <AlertTitle>Card expires Oct 1</AlertTitle>
            <AlertDescription>Update it to keep billing on.</AlertDescription>
            <AlertAction>
              <Button size="sm" variant="outline">
                Update
              </Button>
            </AlertAction>
          </Alert>
          <Card size="sm" style={styles.card}>
            <CardContent>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Two-factor authentication</FieldTitle>
                  <FieldDescription>Required for admins from Nov 1.</FieldDescription>
                </FieldContent>
                <Switch defaultChecked aria-label="Two-factor authentication" />
              </Field>
            </CardContent>
          </Card>
        </div>
      </Part>

      <Part name="kbd" style={styles.keys}>
        <Card size="sm" style={styles.card}>
          <CardHeader>
            <CardTitle>Keyboard shortcuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div {...stylex.props(styles.shortcuts)}>
              {shortcuts.map((s) => (
                <div key={s.action} {...stylex.props(styles.shortcut)}>
                  <span {...stylex.props(styles.shortcutLabel)}>{s.action}</span>
                  <KbdGroup>
                    {s.keys.map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </KbdGroup>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Part>
    </div>
  );
}

const TABLET = '@media (max-width: 61.25rem)' as const;
const MOBILE = '@media (max-width: 40rem)' as const;

// Desktop bento placement: `row-start / col-start / row-end / col-end`.
// Below tablet width every cell falls back to flow order.
const cell = (area: string) => ({ default: area, [TABLET]: 'auto' });

const styles = stylex.create({
  grid: {
    display: 'grid',
    flex: 1,
    gap: space.s4,
    gridAutoRows: { default: 'minmax(0, 1fr)', [TABLET]: 'auto' },
    gridTemplateColumns: {
      default: 'repeat(4, minmax(0, 1fr))',
      [TABLET]: 'repeat(2, minmax(0, 1fr))',
      [MOBILE]: 'minmax(0, 1fr)',
    },
    gridTemplateRows: { default: 'repeat(3, minmax(0, 1fr))', [TABLET]: 'none' },
    minHeight: 0,
  },
  verify: { gridArea: cell('1 / 1 / 2 / 2') },
  rate: { gridArea: cell('1 / 2 / 3 / 3') },
  plan: { gridArea: cell('1 / 3 / 3 / 4') },
  notify: { gridArea: cell('1 / 4 / 2 / 5') },
  storage: { gridArea: cell('2 / 1 / 3 / 2') },
  budget: { gridArea: cell('2 / 4 / 4 / 5') },
  share: { gridArea: cell('3 / 1 / 4 / 2') },
  alerts: { gridArea: cell('3 / 2 / 4 / 3') },
  keys: { gridArea: cell('3 / 3 / 4 / 4') },
  card: {
    height: '100%',
    width: '100%',
  },
  full: {
    width: '100%',
  },
  // Cards share a row height; the action sits on the baseline of the row.
  footer: {
    marginTop: 'auto',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
  },
  // Tall cells: the content column takes the spare height and the textarea
  // absorbs it, so nothing sits above a blank strip.
  contentGrow: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  stackGrow: {
    flex: 1,
  },
  grow: {
    flex: 1,
    resize: 'none',
  },
  total: {
    alignItems: 'baseline',
    display: 'flex',
    fontSize: fontSize.sm,
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: colors.mutedForeground,
  },
  totalValue: {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: fontWeight.semibold,
  },
  stackCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
    height: '100%',
  },
  rating: {
    flex: 1,
  },
  plans: {
    gap: space.s2,
  },
  planRow: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s25,
  },
  planName: {
    flex: 1,
  },
  planPrice: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: fontWeight.medium,
  },
  shareRow: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s3,
    justifyContent: 'space-between',
  },
  shortcuts: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
  },
  shortcut: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  shortcutLabel: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
  },
});
