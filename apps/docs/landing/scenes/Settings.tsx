import * as stylex from '@stylexjs/stylex';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { space, fontSize, fontWeight, lineHeight, container, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

import { Part } from './Part';

const densities = [
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Compact', value: 'compact' },
];

const notifications = [
  { title: 'Mentions', description: 'When someone @mentions you in a thread.', on: true },
  { title: 'Invoice paid', description: 'Every time a customer settles an invoice.', on: true },
  { title: 'Weekly digest', description: 'A Monday summary of the workspace.', on: false },
];

export default function Settings() {
  return (
    <div {...stylex.props(styles.screen)}>
      <header {...stylex.props(styles.heading)}>
        <h3 {...stylex.props(styles.title)}>Settings</h3>
        <p {...stylex.props(styles.lede)}>Workspace preferences for Acme Inc.</p>
      </header>

      <Part name="tabs" grow>
        <Tabs defaultValue="general" orientation="vertical" style={styles.tabs}>
          <TabsList aria-label="Settings sections" style={styles.tabList}>
            <TabsTrigger value="general" style={styles.tab}>General</TabsTrigger>
            <TabsTrigger value="notifications" style={styles.tab}>Notifications</TabsTrigger>
            <TabsTrigger value="appearance" style={styles.tab}>Appearance</TabsTrigger>
            <TabsTrigger value="danger" style={styles.tab}>Danger zone</TabsTrigger>
          </TabsList>

          <TabsContent value="general" style={styles.section}>
            <Part name={['field', 'input', 'textarea']}>
              <FieldSet>
                <FieldLegend>Profile</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="settings-name">Workspace name</FieldLabel>
                    <Input id="settings-name" defaultValue="Acme Inc." />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="settings-slug">URL</FieldLabel>
                    <Input id="settings-slug" defaultValue="acme" />
                    <FieldDescription>app.example.com/acme</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="settings-bio">Description</FieldLabel>
                    <Textarea
                      id="settings-bio"
                      rows={3}
                      defaultValue="Billing and invoicing for a 118-person team."
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </Part>
            <Part name="button">
              <div {...stylex.props(styles.row)}>
                <Button>Save changes</Button>
                <Button variant="ghost">Reset</Button>
              </div>
            </Part>
          </TabsContent>

          <TabsContent value="notifications" style={styles.section}>
            <Part name={['item', 'switch']}>
              <ItemGroup>
                {notifications.map((n) => (
                  <Item key={n.title} variant="outline">
                    <ItemContent>
                      <ItemTitle>{n.title}</ItemTitle>
                      <ItemDescription>{n.description}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Switch defaultChecked={n.on} aria-label={n.title} />
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
            </Part>
            <Part name={['radio-group', 'label']}>
              <Field>
                <FieldLabel>Email frequency</FieldLabel>
                <RadioGroup defaultValue="instant" style={styles.radios}>
                  <Label>
                    <RadioGroupItem value="instant" /> Instantly
                  </Label>
                  <Label>
                    <RadioGroupItem value="hourly" /> Hourly batch
                  </Label>
                  <Label>
                    <RadioGroupItem value="daily" /> Daily
                  </Label>
                </RadioGroup>
              </Field>
            </Part>
          </TabsContent>

          <TabsContent value="appearance" style={styles.section}>
            <Part name="radio-group">
              <Field>
                <FieldLabel>Theme</FieldLabel>
                <RadioGroup defaultValue="system" style={styles.radios}>
                  <Label>
                    <RadioGroupItem value="system" /> System
                  </Label>
                  <Label>
                    <RadioGroupItem value="light" /> Light
                  </Label>
                  <Label>
                    <RadioGroupItem value="dark" /> Dark
                  </Label>
                </RadioGroup>
              </Field>
            </Part>
            <Part name="select">
              <Field>
                <FieldLabel>Density</FieldLabel>
                <Select items={densities} defaultValue="comfortable">
                  <SelectTrigger style={styles.select}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {densities.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </Part>
            <Part name="switch">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Reduce motion</FieldTitle>
                  <FieldDescription>Skip transitions and panel animations.</FieldDescription>
                </FieldContent>
                <Switch aria-label="Reduce motion" />
              </Field>
            </Part>
          </TabsContent>

          <TabsContent value="danger" style={styles.section}>
            <Part name={['item', 'alert-dialog']}>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Delete workspace</ItemTitle>
                  <ItemDescription>
                    Removes Acme Inc., its members, and all invoices. This cannot be undone.
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <AlertDialog>
                    <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
                      Delete workspace
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Acme Inc.?</AlertDialogTitle>
                        <AlertDialogDescription>
                          All 118 members lose access immediately and 142 invoices are
                          permanently removed. Type the workspace name to confirm in the
                          real product; here, nothing happens.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep workspace</AlertDialogCancel>
                        <AlertDialogCancel variant="destructive">Delete</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ItemActions>
              </Item>
            </Part>
          </TabsContent>
        </Tabs>
      </Part>
    </div>
  );
}

const TABLET = '@media (max-width: 61.25rem)' as const;
const MOBILE = '@media (max-width: 40rem)' as const;

const styles = stylex.create({
  // An app screen, framed like the dashboard and inbox.
  screen: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: space.s5,
    overflow: 'hidden',
    padding: { default: space.s5, [MOBILE]: space.s4 },
  },
  heading: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    letterSpacing: '-0.02em',
    lineHeight: lineHeight.tight,
    margin: 0,
  },
  lede: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    margin: 0,
  },
  tabs: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: { default: 'row', [TABLET]: 'column' },
    gap: space.s6,
  },
  tabList: {
    backgroundColor: 'transparent',
    flexShrink: 0,
    padding: 0,
    width: { default: container.xs, [TABLET]: '100%' },
    // Vertical on desktop, horizontal chips on tablet and below.
    flexDirection: { default: 'column', [TABLET]: 'row' },
    flexWrap: 'wrap',
  },
  tab: {
    justifyContent: 'flex-start',
    width: { default: '100%', [TABLET]: 'auto' },
  },
  section: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: space.s6,
    maxWidth: container.xxl,
    minWidth: 0,
    width: '100%',
  },
  row: {
    display: 'flex',
    gap: space.s2,
  },
  radios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.s5,
  },
  select: {
    width: '100%',
  },
});
