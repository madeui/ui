'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { duration, fontSize, fontWeight, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

const headerTabs = [
  { href: '/docs', label: 'Docs' },
  { href: '/changelog', label: 'Changelog' },
] as const;

const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/**
 * The site's sections (Docs, Changelog) in the header; `stacked` is the list
 * form at the top of the mobile drawer.
 */
export function HeaderTabs({ stacked = false, onNavigate }: { stacked?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Sections" {...stylex.props(styles.nav, stacked && styles.stacked)}>
      {headerTabs.map((tab) => {
        const current = isCurrent(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={onNavigate}
            aria-current={current ? 'page' : undefined}
            {...stylex.props(styles.tab, stacked && styles.tabStacked, current && styles.current)}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

const styles = stylex.create({
  nav: {
    display: 'flex',
    gap: space.s1,
  },
  stacked: {
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: stroke.border,
    flexDirection: 'column',
    gap: space.px,
    marginBlockEnd: space.s4,
    paddingBlockEnd: space.s4,
  },
  tab: {
    backgroundColor: { default: 'transparent', ':hover': colors.accent },
    borderRadius: radius.full,
    color: { default: colors.mutedForeground, ':hover': colors.foreground },
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.control,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    paddingBlock: space.s15,
    paddingInline: space.s3,
    textDecorationLine: 'none',
    transitionDuration: duration.fast,
    transitionProperty: 'background-color, color',
  },
  tabStacked: {
    borderRadius: radius.md,
    paddingInline: space.s2,
  },
  current: {
    color: colors.foreground,
  },
});
