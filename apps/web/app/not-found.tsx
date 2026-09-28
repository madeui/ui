import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';

import { display } from '@/components/landing/landing.stylex';
import { NotFoundRecovery } from '@/components/site/search-trigger';
import { layout } from '@/components/site/site.stylex';
import { SiteHeader } from '@/components/site/site-header';
import { breakpoint, fontSize, fontWeight, lineHeight, space } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';
import { contentPages } from '@/site/content';
import { notFoundMetadata } from '@/site/head';
import { routeList } from '@/site/routes';

// Every unknown URL (and notFound() in a page) renders this with status 404,
// never indexed, with a text-only summary card.
export const metadata: Metadata = notFoundMetadata;

/** How many pages the no-match state offers: the first pages of the docs sidebar. */
const POPULAR_COUNT = 6;

export default function NotFound() {
  const routes = routeList(contentPages()).map(({ route, title }) => ({ route, title }));
  const popular = routes.filter(({ route }) => route.startsWith('/docs')).slice(0, POPULAR_COUNT);
  return (
    <>
      <SiteHeader />
      <main id="content" {...stylex.props(styles.main)}>
        <h1 {...stylex.props(styles.title)}>
          Page not found
          <i {...stylex.props(styles.dot)} />
        </h1>
        <p {...stylex.props(styles.lead)}>
          The address doesn&apos;t match any page on madeui.com. It may have moved, or the link has a typo.
        </p>
        <NotFoundRecovery routes={routes} popular={popular} />
      </main>
    </>
  );
}

const styles = stylex.create({
  main: {
    marginInline: 'auto',
    maxWidth: layout.content,
    paddingBlockEnd: space.s16,
    paddingBlockStart: { default: space.s10, [breakpoint.sm]: space.s16 },
    paddingInline: { default: space.s4, [breakpoint.sm]: space.s6 },
  },
  // The landing's display headline, with its period drawn as the brand dot.
  title: {
    color: colors.foreground,
    fontSize: display.size,
    fontWeight: fontWeight.bold,
    letterSpacing: display.tracking,
    lineHeight: lineHeight.tight,
    textWrap: 'balance',
  },
  dot: {
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    display: 'inline-block',
    height: display.dot,
    marginInlineStart: display.dotGap,
    width: display.dot,
  },
  lead: {
    color: colors.mutedForeground,
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
    marginBlockStart: space.s4,
    textWrap: 'pretty',
  },
});
