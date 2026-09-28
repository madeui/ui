'use client';

import { useSyncExternalStore } from 'react';

import * as stylex from '@stylexjs/stylex';
import { ArrowRight, CircleX, CornerDownRight, Search } from 'lucide-react';
import Link from 'next/link';

import { openSearch } from '@/components/site/search-state';
import { font } from '@/components/site/site.stylex';
import { useApplePlatform } from '@/components/site/use-apple-platform';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { container, duration, fontSize, fontWeight, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, radius, shadow } from '@/lib/tokens.stylex';
import { closestRoutes, type RouteRef } from '@/site/not-found';

// The 404 is prerendered once for every missing address, so only the browser
// knows which one was asked for. The server snapshot is null: the static HTML
// (and a reader without JS) gets the panel for "this address"; hydration
// fills in the address and what to do about it.
const subscribe = () => () => {};
function requestedPath() {
  const path = window.location.pathname;
  try {
    return decodeURI(path);
  } catch {
    // A malformed escape (`/%E0%A4`) is shown as typed.
    return path;
  }
}
const unknownPath = () => null;

/**
 * The 404's recovery: the missing address reported like a compiler error,
 * then the closest pages ("Did you mean"), or, when nothing is close, the
 * search field and the popular pages. Home and the docs close it.
 */
export function NotFoundRecovery({ routes, popular }: { routes: RouteRef[]; popular: RouteRef[] }) {
  const path = useSyncExternalStore(subscribe, requestedPath, unknownPath);
  const matches = path === null ? [] : closestRoutes(path, routes);
  const best = matches[0];

  return (
    <>
      <figure {...stylex.props(styles.panel)}>
        <figcaption {...stylex.props(styles.caption)}>404 Not Found</figcaption>
        <pre {...stylex.props(styles.pre)}>
          <code {...stylex.props(styles.code)}>
            <span {...stylex.props(styles.line)}>
              <CircleX aria-hidden {...stylex.props(icon.sm, styles.glyph)} />
              <span>
                No page matches <span {...stylex.props(styles.squiggle)}>{path ?? 'this address'}</span>
              </span>
            </span>
            {best ? (
              <span {...stylex.props(styles.line, styles.hint)}>
                <CornerDownRight aria-hidden {...stylex.props(icon.sm, styles.glyph)} />
                <span>
                  Did you mean{' '}
                  <Link href={best.route} {...stylex.props(styles.fix)}>
                    {best.route}
                  </Link>
                  ?
                </span>
              </span>
            ) : null}
          </code>
        </pre>
      </figure>

      {matches.length > 0 ? (
        <section aria-labelledby="closest" {...stylex.props(styles.section)}>
          <h2 id="closest" {...stylex.props(styles.h2)}>
            Closest matches
          </h2>
          <ul {...stylex.props(styles.list)}>
            {matches.map((ref) => (
              <li key={ref.route}>
                <Item variant="outline" render={<Link href={ref.route} />} style={styles.item}>
                  <ItemContent>
                    <ItemTitle>{ref.title}</ItemTitle>
                    <ItemDescription style={styles.route}>{ref.route}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ArrowRight aria-hidden {...stylex.props(icon.sm, styles.muted)} />
                  </ItemActions>
                </Item>
              </li>
            ))}
          </ul>
        </section>
      ) : path === null ? null : (
        <section aria-labelledby="popular" {...stylex.props(styles.section)}>
          <SearchField />
          <h2 id="popular" {...stylex.props(styles.h2, styles.popularTitle)}>
            Popular pages
          </h2>
          <ul {...stylex.props(styles.chips)}>
            {popular.map((ref) => (
              <li key={ref.route}>
                <Button variant="outline" size="sm" nativeButton={false} render={<Link href={ref.route} />} style={styles.pill}>
                  {ref.title}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label="Leave this page" {...stylex.props(styles.actions)}>
        <Button nativeButton={false} render={<Link href="/" />} style={styles.pill}>
          Back to home
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/docs" />} style={styles.pill}>
          Open the docs
        </Button>
      </nav>
    </>
  );
}

/** The search field at page scale: opens the site search (⌘K / Ctrl K anywhere). */
function SearchField() {
  const apple = useApplePlatform();
  return (
    <button type="button" onClick={openSearch} aria-haspopup="dialog" {...stylex.props(styles.field)}>
      <Search aria-hidden {...stylex.props(icon.md)} />
      <span {...stylex.props(styles.fieldLabel)}>Search the docs…</span>
      <KbdGroup style={styles.fieldKbd}>
        <Kbd>{apple ? '⌘' : 'Ctrl'}</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </button>
  );
}

const styles = stylex.create({
  panel: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    marginBlockStart: space.s8,
    overflow: 'hidden',
  },
  caption: {
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: stroke.border,
    color: colors.mutedForeground,
    fontFamily: font.mono,
    fontSize: fontSize.xs,
    paddingBlock: space.s2,
    paddingInline: space.s4,
  },
  pre: {
    padding: space.s4,
  },
  code: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.mono,
    fontSize: fontSize.sm,
    gap: space.s2,
    lineHeight: lineHeight.normal,
  },
  line: {
    alignItems: 'flex-start',
    color: colors.foreground,
    display: 'flex',
    gap: space.s2,
    overflowWrap: 'anywhere',
    whiteSpace: 'pre-wrap',
  },
  hint: {
    color: colors.mutedForeground,
  },
  // The icon sits on the first line's x-height, beside text that may wrap.
  glyph: {
    marginBlockStart: space.s05,
  },
  // The error squiggle, in ink: the brand is monochrome.
  squiggle: {
    textDecorationColor: colors.mutedForeground,
    textDecorationLine: 'underline',
    textDecorationStyle: 'wavy',
    textDecorationThickness: stroke.border,
    textUnderlineOffset: space.s1,
  },
  fix: {
    borderRadius: radius.xs,
    color: colors.foreground,
    fontWeight: fontWeight.medium,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: stroke.focus,
    textDecorationLine: 'underline',
    textUnderlineOffset: space.s1,
  },
  section: {
    marginBlockStart: space.s8,
  },
  h2: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBlockEnd: space.s3,
  },
  popularTitle: {
    marginBlockStart: space.s8,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
  },
  item: {
    backgroundColor: { default: 'transparent', ':hover': colors.muted },
    color: colors.foreground,
    flexWrap: 'nowrap',
  },
  route: {
    fontFamily: font.mono,
    fontSize: fontSize.xs,
    overflowWrap: 'anywhere',
  },
  muted: {
    color: colors.mutedForeground,
  },
  field: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: { default: colors.input, ':hover': colors.mutedForeground },
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    boxShadow: shadow.sm,
    color: { default: colors.mutedForeground, ':hover': colors.foreground },
    cursor: 'text',
    display: 'flex',
    fontSize: fontSize.base,
    gap: space.s3,
    height: space.s12,
    maxWidth: container.xxl,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: stroke.focus,
    paddingInline: space.s5,
    transitionDuration: duration.fast,
    transitionProperty: 'color, border-color',
    width: '100%',
  },
  fieldLabel: {
    flexGrow: 1,
    textAlign: 'start',
  },
  fieldKbd: {
    display: 'inline-flex',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s2,
  },
  pill: {
    borderRadius: radius.full,
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s2,
    marginBlockStart: space.s10,
  },
});
