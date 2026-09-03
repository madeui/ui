import * as stylex from '@stylexjs/stylex';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { space, fontSize, fontWeight, lineHeight, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

import { MoreIcon, PlusIcon, SearchIcon } from '../icons';
import { Part } from './Part';

const roles = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Viewer', value: 'viewer' },
];

const members = [
  { name: 'Mina Okafor', email: 'mina@acme.dev', initials: 'MO', role: 'owner', status: 'Active', seen: 'Now' },
  { name: 'Jonas Berg', email: 'jonas@acme.dev', initials: 'JB', role: 'admin', status: 'Active', seen: '5 min ago' },
  { name: 'Priya Natarajan', email: 'priya@acme.dev', initials: 'PN', role: 'admin', status: 'Active', seen: '2 h ago' },
  { name: 'Leo Castellano', email: 'leo@acme.dev', initials: 'LC', role: 'member', status: 'Active', seen: 'Yesterday' },
  { name: 'Sara Lindqvist', email: 'sara@acme.dev', initials: 'SL', role: 'member', status: 'Away', seen: '3 days ago' },
  { name: 'Yuki Tanaka', email: 'yuki@acme.dev', initials: 'YT', role: 'viewer', status: 'Active', seen: '1 h ago' },
];

const invites = [
  { email: 'tomas@acme.dev', role: 'Member', sent: 'Sent 2 days ago' },
];

export default function Team() {
  return (
    <div {...stylex.props(styles.screen)}>
      <header {...stylex.props(styles.topbar)}>
        <div {...stylex.props(styles.heading)}>
          <h3 {...stylex.props(styles.title)}>Members</h3>
          <p {...stylex.props(styles.lede)}>6 people, 1 pending invite, 150 seats.</p>
        </div>
        <div {...stylex.props(styles.actions)}>
          <Part name="input-group">
            <InputGroup style={styles.search}>
              <InputGroupAddon>
                <SearchIcon size={16} />
              </InputGroupAddon>
              <InputGroupInput placeholder="Filter members" aria-label="Filter members" />
            </InputGroup>
          </Part>
          <Part name="dialog">
            <Dialog>
              <DialogTrigger render={<Button />}>
                <PlusIcon size={16} />
                Invite
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite to Acme Inc.</DialogTitle>
                  <DialogDescription>
                    They get an email with a link that expires in 7 days.
                  </DialogDescription>
                </DialogHeader>
                <div {...stylex.props(styles.form)}>
                  <Field>
                    <FieldLabel htmlFor="invite-email">Email</FieldLabel>
                    <Input id="invite-email" type="email" placeholder="name@company.com" />
                  </Field>
                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <Select items={roles} defaultValue="member">
                      <SelectTrigger style={styles.fullWidth}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                  <DialogClose render={<Button />}>Send invite</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Part>
        </div>
      </header>

      <Part name={['table', 'avatar', 'select', 'badge', 'dropdown-menu']}>
        <div {...stylex.props(styles.tableWrap)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead style={styles.wide}>Status</TableHead>
                <TableHead style={styles.wide}>Last active</TableHead>
                <TableHead style={[styles.actionsHead, styles.wide]}>
                  <span {...stylex.props(styles.srOnly)}>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.email}>
                  <TableCell>
                    <span {...stylex.props(styles.person)}>
                      <Avatar size="sm">
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                      <span {...stylex.props(styles.personText)}>
                        <span {...stylex.props(styles.personName)}>{m.name}</span>
                        <span {...stylex.props(styles.personEmail)}>{m.email}</span>
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select items={roles} defaultValue={m.role} disabled={m.role === 'owner'}>
                      <SelectTrigger aria-label={`Role for ${m.name}`} style={styles.role}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell style={styles.wide}>
                    <Badge variant={m.status === 'Active' ? 'secondary' : 'outline'}>{m.status}</Badge>
                  </TableCell>
                  <TableCell style={[styles.muted, styles.wide]}>{m.seen}</TableCell>
                  <TableCell style={[styles.right, styles.wide]}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="iconSm" aria-label={`Actions for ${m.name}`} />}
                      >
                        <MoreIcon size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Reset two-factor</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">Remove from workspace</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Part>

      <Part name={['item', 'button']}>
        <section {...stylex.props(styles.invites)}>
          <h4 {...stylex.props(styles.subtitle)}>Pending invite</h4>
          <ItemGroup>
            {invites.map((invite) => (
              <Item key={invite.email} variant="outline" size="sm">
                <ItemMedia variant="icon">
                  <PlusIcon size={16} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{invite.email}</ItemTitle>
                  <ItemDescription>
                    {invite.role} · {invite.sent}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm">
                    Resend
                  </Button>
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </section>
      </Part>
    </div>
  );
}

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
  topbar: {
    alignItems: 'flex-end',
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s3,
    justifyContent: 'space-between',
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
  subtitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    margin: 0,
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s2,
  },
  search: {
    width: { default: null, [MOBILE]: '100%' },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
  },
  fullWidth: {
    width: '100%',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  person: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: space.s25,
  },
  personText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: lineHeight.snug,
  },
  personName: {
    fontWeight: fontWeight.medium,
    whiteSpace: 'nowrap',
  },
  personEmail: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    whiteSpace: 'nowrap',
  },
  role: {
    minWidth: space.s16,
  },
  muted: {
    color: colors.mutedForeground,
    whiteSpace: 'nowrap',
  },
  right: {
    textAlign: 'right',
  },
  actionsHead: {
    width: space.s10,
  },
  // Phones keep Member and Role; Status, Last active, and the row menu return
  // at tablet width, so the table never scrolls sideways.
  wide: {
    display: { default: null, [MOBILE]: 'none' },
  },
  invites: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
  },
  srOnly: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
});
