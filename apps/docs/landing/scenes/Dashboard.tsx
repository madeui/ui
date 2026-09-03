import * as stylex from '@stylexjs/stylex';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Meter, MeterLabel, MeterValue } from '@/components/ui/meter';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { space, fontSize, fontWeight, lineHeight, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

import {
  ChevronDownIcon,
  HomeIcon,
  InboxIcon,
  MoreIcon,
  PlusIcon,
  ReceiptIcon,
  SettingsIcon,
  UsersIcon,
} from '../icons';
import { Part } from './Part';

const sections = [
  { label: 'Overview', icon: HomeIcon, active: true },
  { label: 'Invoices', icon: ReceiptIcon, count: 23 },
  { label: 'Inbox', icon: InboxIcon, count: 12 },
  { label: 'Team', icon: UsersIcon },
  { label: 'Settings', icon: SettingsIcon },
];

const periods = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Last quarter', value: '90' },
];

const stats = [
  { label: 'Revenue', value: '$48,290', delta: '+12.4%', tone: 'secondary' as const },
  { label: 'Invoices paid', value: '142', delta: '+8', tone: 'secondary' as const },
  { label: 'Open invoices', value: '23', delta: '4 overdue', tone: 'outline' as const },
  { label: 'Net churn', value: '1.8%', delta: '−0.3 pt', tone: 'secondary' as const },
];

const invoices = [
  { id: 'INV-2041', customer: 'Northwind Traders', initials: 'NT', amount: '$3,200.00', status: 'Paid' },
  { id: 'INV-2040', customer: 'Lumen Studio', initials: 'LS', amount: '$1,150.00', status: 'Pending' },
  { id: 'INV-2039', customer: 'Harbor & Co.', initials: 'HC', amount: '$980.00', status: 'Overdue' },
  { id: 'INV-2038', customer: 'Quill Labs', initials: 'QL', amount: '$4,400.00', status: 'Paid' },
];

const statusTone = {
  Paid: 'secondary',
  Pending: 'outline',
  Overdue: 'primary',
} as const;

const activity = [
  { who: 'JB', title: 'Jonas Berg paid INV-2041', when: '12 min ago' },
  { who: 'PN', title: 'Priya Natarajan invited Leo Castellano', when: '1 h ago' },
];

export default function Dashboard() {
  return (
    <div {...stylex.props(styles.screen)}>
      <aside {...stylex.props(styles.sidebar)}>
        <Part name="dropdown-menu">
          <DropdownMenu>
            <DropdownMenuTrigger {...stylex.props(styles.workspace)}>
              <Avatar size="sm">
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <span {...stylex.props(styles.workspaceText)}>
                <span {...stylex.props(styles.workspaceName)}>Acme Inc.</span>
                <span {...stylex.props(styles.workspacePlan)}>Team plan</span>
              </span>
              <ChevronDownIcon size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                <DropdownMenuItem>Acme Inc.</DropdownMenuItem>
                <DropdownMenuItem>Acme Labs</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Create workspace</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Part>
        <Part name={['button', 'badge']} grow>
          <nav aria-label="App sections" {...stylex.props(styles.nav)}>
            {sections.map(({ label, icon: Icon, count, active }) => (
              <Button
                key={label}
                variant={active ? 'secondary' : 'ghost'}
                size="sm"
                aria-current={active ? 'page' : undefined}
                style={styles.navItem}
              >
                <Icon size={16} />
                <span {...stylex.props(styles.navLabel)}>{label}</span>
                {count != null && <Badge variant="outline">{count}</Badge>}
              </Button>
            ))}
          </nav>
        </Part>
        <Part name="avatar">
          <div {...stylex.props(styles.user)}>
            <Avatar size="sm">
              <AvatarFallback>MO</AvatarFallback>
            </Avatar>
            <span {...stylex.props(styles.workspaceText)}>
              <span {...stylex.props(styles.workspaceName)}>Mina Okafor</span>
              <span {...stylex.props(styles.workspacePlan)}>mina@acme.dev</span>
            </span>
          </div>
        </Part>
      </aside>

      <div {...stylex.props(styles.main)}>
      <header {...stylex.props(styles.topbar)}>
        <Part name="breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Acme Inc.</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Part>
        <div {...stylex.props(styles.actions)}>
          <Part name="select">
            <Select items={periods} defaultValue="30">
              <SelectTrigger aria-label="Period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Part>
          <Part name="button">
            <div {...stylex.props(styles.actions)}>
              <Button variant="outline">Export</Button>
              <Button>
                <PlusIcon size={16} />
                New invoice
              </Button>
            </div>
          </Part>
        </div>
      </header>

      <Part name={["badge", "separator"]}>
        <div {...stylex.props(styles.stats)}>
          {stats.map((stat, i) => (
            <div key={stat.label} {...stylex.props(styles.statCell)}>
              {i > 0 && <Separator orientation="vertical" style={styles.statRule} />}
              <div {...stylex.props(styles.stat)}>
                <span {...stylex.props(styles.statLabel)}>{stat.label}</span>
                <span {...stylex.props(styles.statValue)}>{stat.value}</span>
                <Badge variant={stat.tone}>{stat.delta}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Part>

      <div {...stylex.props(styles.grid)}>
        <Part name={['card', 'table', 'avatar', 'dropdown-menu']} grow>
          <Card style={styles.fill}>
            <CardHeader>
              <CardTitle>Recent invoices</CardTitle>
              <CardDescription>Four most recent, all customers.</CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={styles.wide}>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead style={styles.wide}>Status</TableHead>
                    <TableHead style={styles.right}>Amount</TableHead>
                    <TableHead style={[styles.actionsHead, styles.wide]}>
                      <span {...stylex.props(styles.srOnly)}>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell style={[styles.mono, styles.wide]}>{row.id}</TableCell>
                      <TableCell>
                        <span {...stylex.props(styles.customer)}>
                          <Avatar size="sm">
                            <AvatarFallback>{row.initials}</AvatarFallback>
                          </Avatar>
                          {row.customer}
                        </span>
                      </TableCell>
                      <TableCell style={styles.wide}>
                        <Badge variant={statusTone[row.status as keyof typeof statusTone]}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell style={[styles.right, styles.tabular]}>{row.amount}</TableCell>
                      <TableCell style={[styles.right, styles.wide]}>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" size="iconSm" aria-label={`Actions for ${row.id}`} />}
                          >
                            <MoreIcon size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View invoice</DropdownMenuItem>
                            <DropdownMenuItem>Send reminder</DropdownMenuItem>
                            <DropdownMenuItem>Download PDF</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">Void</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell style={styles.wide} />
                    <TableCell>Total</TableCell>
                    <TableCell style={styles.wide} />
                    <TableCell style={[styles.right, styles.tabular]}>$9,730.00</TableCell>
                    <TableCell style={styles.wide} />
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </Part>

        <div {...stylex.props(styles.column)}>
          <Part name={['meter', 'progress']}>
            <Card>
              <CardHeader>
                <CardTitle>Plan usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div {...stylex.props(styles.stack)}>
                  <Meter value={118} max={150} locale="en-US">
                    <MeterLabel>Seats</MeterLabel>
                    <MeterValue>{(_, value) => `${value} of 150`}</MeterValue>
                  </Meter>
                  <Progress value={64} locale="en-US">
                    <ProgressLabel>Data migration</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                </div>
              </CardContent>
            </Card>
          </Part>
          <Part name="item" grow>
            <Card style={styles.fill}>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ItemGroup>
                  {activity.map((entry) => (
                    <Item key={entry.title} size="sm">
                      <ItemMedia>
                        <Avatar size="sm">
                          <AvatarFallback>{entry.who}</AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{entry.title}</ItemTitle>
                        <ItemDescription>{entry.when}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </CardContent>
            </Card>
          </Part>
        </div>
      </div>
      </div>
    </div>
  );
}

const TABLET = '@media (max-width: 61.25rem)' as const;
const MOBILE = '@media (max-width: 40rem)' as const;

const styles = stylex.create({
  // An app window: the one screen that needs its own edge on the page.
  screen: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    display: 'flex',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  sidebar: {
    backgroundColor: colors.card,
    borderRightColor: colors.border,
    borderRightStyle: 'solid',
    borderRightWidth: stroke.border,
    display: { default: 'flex', [TABLET]: 'none' },
    flexDirection: 'column',
    flexShrink: 0,
    gap: space.s4,
    padding: space.s3,
    width: container.card,
  },
  workspace: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': colors.muted },
    borderRadius: radius.md,
    borderStyle: 'none',
    color: colors.foreground,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font.sans,
    gap: space.s25,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    padding: space.s15,
    textAlign: 'left',
    transitionDuration: duration.fast,
    transitionProperty: 'background-color',
    width: '100%',
  },
  workspaceText: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
  },
  workspaceName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.snug,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  workspacePlan: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.snug,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s05,
  },
  navItem: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  navLabel: {
    flex: 1,
    textAlign: 'left',
  },
  user: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s25,
    padding: space.s15,
  },
  main: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: space.s4,
    minWidth: 0,
    padding: { default: space.s5, [MOBILE]: space.s4 },
  },
  topbar: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s3,
    justifyContent: 'space-between',
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s2,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(4, minmax(0, 1fr))',
      [MOBILE]: 'repeat(2, minmax(0, 1fr))',
    },
    rowGap: space.s4,
  },
  statCell: {
    display: 'flex',
    minWidth: 0,
  },
  statRule: {
    alignSelf: 'stretch',
    display: { default: null, [MOBILE]: 'none' },
    height: 'auto',
    marginRight: space.s5,
  },
  stat: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: space.s1,
  },
  statLabel: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: fontWeight.semibold,
    letterSpacing: '-0.02em',
    lineHeight: lineHeight.tight,
  },
  grid: {
    alignItems: 'stretch',
    display: 'grid',
    gap: space.s4,
    gridTemplateColumns: {
      default: 'minmax(0, 1.7fr) minmax(0, 1fr)',
      [TABLET]: 'minmax(0, 1fr)',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
  },
  fill: {
    flex: 1,
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s5,
  },
  customer: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: space.s2,
    whiteSpace: 'nowrap',
  },
  right: {
    textAlign: 'right',
  },
  actionsHead: {
    width: space.s10,
  },
  // Phones keep Customer and Amount; id, Status, and the row menu return at
  // tablet width, so the table never scrolls sideways.
  wide: {
    display: { default: null, [MOBILE]: 'none' },
  },
  tabular: {
    fontVariantNumeric: 'tabular-nums',
  },
  mono: {
    color: colors.mutedForeground,
    fontVariantNumeric: 'tabular-nums',
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
