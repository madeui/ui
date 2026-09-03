'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { space, fontSize, fontWeight, lineHeight, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

import {
  ArchiveIcon,
  ClockIcon,
  InboxIcon,
  PaperclipIcon,
  ReplyIcon,
  SearchIcon,
  SendIcon,
  StarIcon,
  TrashIcon,
} from '../icons';
import { Part } from './Part';

const folders = [
  { label: 'Inbox', icon: InboxIcon, count: 12, active: true },
  { label: 'Starred', icon: StarIcon },
  { label: 'Snoozed', icon: ClockIcon, count: 3 },
  { label: 'Archive', icon: ArchiveIcon },
  { label: 'Trash', icon: TrashIcon },
];

const messages = [
  {
    id: 'm1',
    from: 'Jonas Berg',
    email: 'jonas@acme.dev',
    initials: 'JB',
    subject: 'Q3 invoice run is ready for review',
    snippet: 'All 142 invoices are queued. Two customers changed billing address since last…',
    time: '9:41 AM',
    unread: true,
    body: [
      'All 142 invoices are queued for the Q3 run. Two customers changed their billing address since last quarter, so I held those back for a second look.',
      'If the totals match your export from Friday, I will send everything at 10:00 tomorrow.',
    ],
  },
  {
    id: 'm2',
    from: 'Priya Natarajan',
    email: 'priya@acme.dev',
    initials: 'PN',
    subject: 'Leo joins the billing team Monday',
    snippet: 'I sent the invite with the Member role. He will need access to the export…',
    time: '8:15 AM',
    unread: true,
    body: [
      'I sent Leo the invite with the Member role. He will need access to the export folder and the reminders template before Monday.',
      'Can you add him to the on-call rotation for October?',
    ],
  },
  {
    id: 'm3',
    from: 'Northwind Traders',
    email: 'accounts@northwind.example',
    initials: 'NT',
    subject: 'Payment confirmation INV-2041',
    snippet: 'Your payment of $3,200.00 has been received. No action is needed.',
    time: 'Yesterday',
    unread: false,
    body: ['Your payment of $3,200.00 for INV-2041 has been received. No action is needed.'],
  },
  {
    id: 'm4',
    from: 'Sara Lindqvist',
    email: 'sara@acme.dev',
    initials: 'SL',
    subject: 'Dunning copy, second draft',
    snippet: 'Softer tone for the first reminder, firmer on the third. Draft attached…',
    time: 'Yesterday',
    unread: false,
    body: [
      'Second draft attached. Softer tone for the first reminder, firmer on the third, and the payment link moved above the fold.',
    ],
  },
  {
    id: 'm5',
    from: 'Harbor & Co.',
    email: 'finance@harbor.example',
    initials: 'HC',
    subject: 'Re: INV-2039 overdue',
    snippet: 'Apologies, our AP contact was out. Payment scheduled for the 12th.',
    time: 'Mon',
    unread: false,
    body: ['Apologies for the delay, our AP contact was out. Payment is scheduled for the 12th.'],
  },
  {
    id: 'm6',
    from: 'Yuki Tanaka',
    email: 'yuki@acme.dev',
    initials: 'YT',
    subject: 'Weekly digest',
    snippet: '12 invoices paid, 3 overdue, 1 new customer. Full report in the dashboard.',
    time: 'Mon',
    unread: false,
    body: ['12 invoices paid, 3 overdue, 1 new customer. The full report is on the dashboard.'],
  },
];

export default function Inbox() {
  const [selectedId, setSelectedId] = React.useState('m1');
  const selected = messages.find((m) => m.id === selectedId) ?? messages[0];

  return (
    <TooltipProvider>
      <div {...stylex.props(styles.screen)}>
        <Part name={["button", "badge"]} style={styles.folders}>
          <div {...stylex.props(styles.folderStack)}>
            <Button size="sm" style={styles.compose}>
              Compose
            </Button>
            <nav aria-label="Folders" {...stylex.props(styles.folderList)}>
              {folders.map(({ label, icon: Icon, count, active }) => (
                <Button
                  key={label}
                  variant={active ? 'secondary' : 'ghost'}
                  size="sm"
                  aria-current={active ? 'page' : undefined}
                  style={styles.folder}
                >
                  <Icon size={16} />
                  <span {...stylex.props(styles.folderLabel)}>{label}</span>
                  {count != null && <span {...stylex.props(styles.count)}>{count}</span>}
                </Button>
              ))}
            </nav>
          </div>
        </Part>

        <Part name={["input-group", "scroll-area", "avatar"]} style={styles.list}>
          <div {...stylex.props(styles.listInner)}>
            <div {...stylex.props(styles.listHead)}>
              <h3 {...stylex.props(styles.listTitle)}>
                Inbox <Badge variant="secondary">12</Badge>
              </h3>
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon size={16} />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search mail" aria-label="Search mail" />
              </InputGroup>
            </div>
            <ScrollArea style={styles.scroll}>
              <ul {...stylex.props(styles.rows)} aria-label="Messages">
                {messages.map((m) => {
                  const isSelected = m.id === selectedId;
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(m.id)}
                        {...stylex.props(styles.row, isSelected && styles.rowSelected)}
                      >
                        <Avatar size="sm">
                          <AvatarFallback>{m.initials}</AvatarFallback>
                        </Avatar>
                        <span {...stylex.props(styles.rowText)}>
                          <span {...stylex.props(styles.rowTop)}>
                            <span {...stylex.props(styles.rowFrom, m.unread && styles.unread)}>
                              {m.from}
                            </span>
                            <span {...stylex.props(styles.rowTime)}>{m.time}</span>
                          </span>
                          <span {...stylex.props(styles.rowSubject, m.unread && styles.unread)}>
                            {m.subject}
                          </span>
                          <span {...stylex.props(styles.rowSnippet)}>{m.snippet}</span>
                        </span>
                        {m.unread && <i aria-label="Unread" {...stylex.props(styles.dot)} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          </div>
        </Part>

        <div {...stylex.props(styles.reading)}>
          <article {...stylex.props(styles.readingInner)} aria-live="polite">
            <header {...stylex.props(styles.readingHead)}>
              <h3 {...stylex.props(styles.subject)}>{selected.subject}</h3>
              <Part name={['button-group', 'tooltip']}>
              <ButtonGroup>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" size="iconSm" aria-label="Archive" />}>
                    <ArchiveIcon size={16} />
                  </TooltipTrigger>
                  <TooltipContent>Archive</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" size="iconSm" aria-label="Snooze" />}>
                    <ClockIcon size={16} />
                  </TooltipTrigger>
                  <TooltipContent>Snooze</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="outline" size="iconSm" aria-label="Delete" />}>
                    <TrashIcon size={16} />
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </ButtonGroup>
              </Part>
            </header>
            <div {...stylex.props(styles.sender)}>
              <Avatar size="sm">
                <AvatarFallback>{selected.initials}</AvatarFallback>
              </Avatar>
              <span {...stylex.props(styles.senderText)}>
                <span {...stylex.props(styles.senderName)}>{selected.from}</span>
                <span {...stylex.props(styles.senderEmail)}>{selected.email}</span>
              </span>
              <span {...stylex.props(styles.senderTime)}>{selected.time}</span>
            </div>
            <Separator />
            <div {...stylex.props(styles.body)}>
              {selected.body.map((paragraph) => (
                <p key={paragraph} {...stylex.props(styles.paragraph)}>
                  {paragraph}
                </p>
              ))}
            </div>
            <Part name={['textarea', 'kbd', 'button']}>
            <div {...stylex.props(styles.reply)}>
              <Textarea
                rows={3}
                placeholder={`Reply to ${selected.from.split(' ')[0]}…`}
                aria-label="Reply"
              />
              <div {...stylex.props(styles.replyBar)}>
                <Button variant="ghost" size="sm">
                  <PaperclipIcon size={16} />
                  Attach
                </Button>
                <span {...stylex.props(styles.replyActions)}>
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>↵</Kbd>
                  </KbdGroup>
                  <Button size="sm">
                    <SendIcon size={16} />
                    Send
                  </Button>
                </span>
              </div>
            </div>
            </Part>
          </article>
        </div>
      </div>
    </TooltipProvider>
  );
}

const TABLET = '@media (max-width: 61.25rem)' as const;
const MOBILE = '@media (max-width: 40rem)' as const;
const HOVER = '@media (hover: hover) and (pointer: fine)' as const;

const styles = stylex.create({
  // A mail client window: bordered like the dashboard, unlike the pages.
  screen: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    display: 'flex',
    flex: 1,
    flexDirection: { default: 'row', [MOBILE]: 'column' },
    minHeight: 0,
    overflow: 'hidden',
  },
  folders: {
    borderRadius: 0,
    borderRightColor: colors.border,
    borderRightStyle: 'solid',
    borderRightWidth: stroke.border,
    display: { default: 'block', [TABLET]: 'none' },
    flexShrink: 0,
    width: container.xs,
  },
  folderStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    padding: space.s3,
  },
  compose: {
    width: '100%',
  },
  folderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s05,
  },
  folder: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  folderLabel: {
    flex: 1,
    textAlign: 'left',
  },
  count: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    fontVariantNumeric: 'tabular-nums',
  },
  list: {
    borderRadius: 0,
    borderRightColor: colors.border,
    borderRightStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    minHeight: 0,
    width: { default: container.lg, [TABLET]: container.md, [MOBILE]: '100%' },
    borderBottomColor: { default: null, [MOBILE]: colors.border },
    borderBottomStyle: { default: null, [MOBILE]: 'solid' },
    borderBottomWidth: { default: null, [MOBILE]: stroke.border },
    borderRightWidth: { default: stroke.border, [MOBILE]: 0 },
  },
  // Grid rows give the scroll area a definite height (a flexed child would
  // not), which the scroll viewport's 100% height resolves against.
  listInner: {
    display: 'grid',
    flex: 1,
    gridTemplateRows: 'auto minmax(0, 1fr)',
    minHeight: 0,
  },
  listHead: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    padding: space.s3,
  },
  listTitle: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: font.sans,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    gap: space.s2,
    letterSpacing: '-0.01em',
    lineHeight: lineHeight.tight,
    margin: 0,
  },
  scroll: {
    // Tablets and phones stack the panes; the list shows in full there.
    height: { default: '100%', [TABLET]: 'auto' },
    minHeight: 0,
    overflow: 'hidden',
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s05,
    listStyle: 'none',
    margin: 0,
    paddingBlock: 0,
    paddingInline: space.s2,
    paddingBottom: space.s2,
  },
  row: {
    alignItems: 'flex-start',
    backgroundColor: {
      default: 'transparent',
      [HOVER]: { default: null, ':hover': colors.muted },
    },
    borderRadius: radius.md,
    borderStyle: 'none',
    color: colors.foreground,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font.sans,
    gap: space.s25,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: `calc(-1 * ${stroke.focus})`,
    padding: space.s25,
    position: 'relative',
    textAlign: 'left',
    transitionDuration: duration.fast,
    transitionProperty: 'background-color',
    width: '100%',
  },
  rowSelected: {
    backgroundColor: colors.muted,
  },
  rowText: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: space.s05,
    minWidth: 0,
  },
  rowTop: {
    alignItems: 'baseline',
    display: 'flex',
    gap: space.s2,
    justifyContent: 'space-between',
  },
  rowFrom: {
    fontSize: fontSize.sm,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowTime: {
    color: colors.mutedForeground,
    flexShrink: 0,
    fontSize: fontSize.xs,
    fontVariantNumeric: 'tabular-nums',
  },
  rowSubject: {
    fontSize: fontSize.sm,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowSnippet: {
    color: colors.mutedForeground,
    display: '-webkit-box',
    fontSize: fontSize.xs,
    lineHeight: lineHeight.snug,
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  unread: {
    fontWeight: fontWeight.semibold,
  },
  dot: {
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    display: 'block',
    flexShrink: 0,
    height: space.s15,
    marginTop: space.s15,
    width: space.s15,
  },
  reading: {
    borderRadius: 0,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minHeight: 0,
    minWidth: 0,
  },
  readingInner: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: space.s4,
    minHeight: 0,
    padding: space.s5,
  },
  readingHead: {
    alignItems: 'flex-start',
    display: 'flex',
    gap: space.s3,
    justifyContent: 'space-between',
  },
  subject: {
    fontFamily: font.sans,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    letterSpacing: '-0.02em',
    lineHeight: lineHeight.tight,
    margin: 0,
    textWrap: 'balance',
  },
  sender: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s25,
  },
  senderText: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    lineHeight: lineHeight.snug,
    minWidth: 0,
  },
  senderName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  senderEmail: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  senderTime: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
  },
  body: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: space.s3,
  },
  paragraph: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    margin: 0,
    maxWidth: '60ch',
  },
  reply: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
  },
  replyBar: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  replyActions: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s3,
  },
});
