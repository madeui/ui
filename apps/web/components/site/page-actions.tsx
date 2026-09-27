import { Fragment } from 'react';

import * as stylex from '@stylexjs/stylex';
import { ArrowUp, ChevronDown, Copy, ExternalLink } from 'lucide-react';

import { chatLogos } from '@/components/site/chat-logos';
import { ChatLink, ChatMenu, CopyMarkdown, ScrollToTop, type ChatProvider } from '@/components/site/page-actions-client';
import { container, duration, fontSize, lineHeight, space, stroke, z } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, radius, shadow } from '@/lib/tokens.stylex';

/** The "Open in chat" providers, in menu order; a rule follows the first. */
const PROVIDERS: { key: ChatProvider; name: string }[] = [
  { key: 'v0', name: 'v0' },
  { key: 'chatgpt', name: 'ChatGPT' },
  { key: 'claude', name: 'Claude' },
  { key: 't3', name: 'T3 Chat' },
  { key: 'scira', name: 'Scira' },
  { key: 'cursor', name: 'Cursor' },
];

/**
 * Under the ToC: scroll to top, copy the page as Markdown (its `.md`
 * mirror), and open it in an assistant with a prompt that points at that
 * mirror. Everything renders on the server; only the handlers hydrate.
 */
export function PageActions() {
  return (
    <div {...stylex.props(styles.root)}>
      <ScrollToTop sx={stylex.props(styles.row)}>
        <ArrowUp {...stylex.props(icon.md)} />
        Scroll to top
      </ScrollToTop>
      <CopyMarkdown sx={stylex.props(styles.row)}>
        <Copy {...stylex.props(icon.md)} />
      </CopyMarkdown>
      <ChatMenu
        sx={stylex.props(styles.details)}
        down={stylex.props(styles.menu)}
        up={stylex.props(styles.menu, styles.menuUp)}
        summary={
          <summary {...stylex.props(styles.row, styles.summary)}>
            <ExternalLink {...stylex.props(icon.md)} />
            Open in chat
            <ChevronDown {...stylex.props(icon.sm, styles.chevron)} />
          </summary>
        }
      >
        {PROVIDERS.map(({ key, name }, i) => {
          const Logo = chatLogos[key];
          return (
            <Fragment key={key}>
              {i === 1 ? <hr {...stylex.props(styles.rule)} /> : null}
              <ChatLink provider={key} sx={stylex.props(styles.item)}>
                <Logo {...stylex.props(icon.md)} />
                <span {...stylex.props(styles.itemLabel)}>Open in {name}</span>
                <ExternalLink {...stylex.props(icon.sm)} />
              </ChatLink>
            </Fragment>
          );
        })}
      </ChatMenu>
    </div>
  );
}

const styles = stylex.create({
  root: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: stroke.border,
    display: 'flex',
    flexDirection: 'column',
    fontSize: fontSize.sm,
    gap: space.s05,
    lineHeight: lineHeight.control,
    marginBlockStart: space.s8,
    paddingBlockStart: space.s4,
  },
  // Flat rows like the ToC links: no background, the color shifts on hover.
  row: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    color: { default: colors.mutedForeground, ':hover': colors.foreground },
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: fontSize.sm,
    gap: space.s25,
    lineHeight: lineHeight.control,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    paddingBlock: space.s15,
    paddingInline: 0,
    textAlign: 'start',
    transitionDuration: duration.fast,
    transitionProperty: 'color',
    width: '100%',
  },
  details: {
    position: 'relative',
    '--chat-chevron-rotation': { default: null, '[open]': '180deg' },
  },
  summary: {
    listStyleType: 'none',
    '::-webkit-details-marker': { display: 'none' },
  },
  chevron: {
    marginInlineStart: 'auto',
    transform: 'rotate(var(--chat-chevron-rotation, 0deg))',
    transitionDuration: duration.fast,
    transitionProperty: 'transform',
  },
  menu: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    boxShadow: shadow.lg,
    color: colors.foreground,
    insetBlockStart: '100%',
    insetInlineEnd: space.s2,
    marginBlockStart: space.s1,
    minWidth: container.card,
    padding: space.s1,
    position: 'absolute',
    width: 'max-content',
    zIndex: z.popup,
  },
  menuUp: {
    insetBlockEnd: '100%',
    insetBlockStart: 'auto',
    marginBlockEnd: space.s1,
    marginBlockStart: 0,
  },
  rule: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: stroke.border,
    borderInlineStyle: 'none',
    borderBlockEndStyle: 'none',
    marginBlock: space.s1,
    marginInline: 0,
  },
  item: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': colors.muted },
    borderRadius: radius.sm,
    color: { default: colors.mutedForeground, ':hover': colors.foreground },
    display: 'flex',
    fontSize: fontSize.sm,
    gap: space.s25,
    lineHeight: lineHeight.control,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    paddingBlock: space.s15,
    paddingInline: space.s2,
    textDecorationLine: 'none',
  },
  itemLabel: {
    flexGrow: 1,
  },
});
