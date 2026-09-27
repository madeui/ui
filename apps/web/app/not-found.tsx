import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';
import Link from 'next/link';

import { layout, prose } from '@/components/site/site.stylex';
import { SiteHeader } from '@/components/site/site-header';
import { fontSize, fontWeight, lineHeight, space } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';
import { notFoundMetadata } from '@/site/head';

// Every unknown URL (and notFound() in a page) renders this with status 404,
// never indexed, with a text-only summary card.
export const metadata: Metadata = notFoundMetadata;

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="content" {...stylex.props(styles.main)}>
        <p {...stylex.props(styles.code)}>404</p>
        <h1 {...stylex.props(styles.title)}>Page not found</h1>
        <p {...stylex.props(styles.text)}>We couldn&apos;t find the page you&apos;re looking for.</p>
        <Link href="/" {...stylex.props(styles.home)}>
          Back to home
        </Link>
      </main>
    </>
  );
}

const styles = stylex.create({
  main: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
    marginInline: 'auto',
    maxWidth: layout.content,
    paddingBlock: space.s16,
    paddingInline: space.s6,
  },
  code: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  title: {
    color: colors.foreground,
    fontSize: prose.title,
    fontWeight: fontWeight.semibold,
    letterSpacing: prose.tracking,
    lineHeight: lineHeight.tight,
  },
  text: {
    color: colors.mutedForeground,
    fontSize: fontSize.base,
    lineHeight: prose.leading,
  },
  home: {
    color: colors.foreground,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textDecorationLine: 'underline',
    textUnderlineOffset: space.s1,
  },
});
