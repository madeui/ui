import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';

import { HeaderTabs } from '@/components/site/header-tabs';
import { Lockup } from '@/components/site/lockup';
import { MobileNav } from '@/components/site/mobile-nav';
import { effects, layer, layout } from '@/components/site/site.stylex';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { breakpoint, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';
import type { SidebarGroup } from '@/site/nav';

/**
 * The sticky, translucent site header: the drawer toggle (below lg), the
 * lockup, the section tabs (from md), and the theme toggle. The search
 * trigger joins the end group.
 */
export function SiteHeader({ nav }: { nav?: { label: string; groups: SidebarGroup[] } }) {
  return (
    <>
      <a href="#content" {...stylex.props(styles.skip)}>
        Skip to content
      </a>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.drawer)}>
          <MobileNav label={nav?.label ?? 'Docs'} groups={nav?.groups} />
        </div>
        <Link href="/" aria-label="madeui home" {...stylex.props(styles.home)}>
          <Lockup style={styles.lockup} />
        </Link>
        <div {...stylex.props(styles.tabs)}>
          <HeaderTabs />
        </div>
        <div {...stylex.props(styles.end)}>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}

const styles = stylex.create({
  skip: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    insetInlineStart: space.s4,
    paddingBlock: space.s2,
    paddingInline: space.s3,
    position: 'fixed',
    top: space.s3,
    // Visually hidden until it takes keyboard focus.
    clipPath: { default: 'inset(50%)', ':focus-visible': 'none' },
    zIndex: layer.sticky,
  },
  header: {
    alignItems: 'center',
    backdropFilter: effects.headerBlur,
    backgroundColor: `color-mix(in oklab, ${colors.background} ${effects.headerAlpha}, transparent)`,
    display: 'flex',
    gap: space.s3,
    height: layout.header,
    paddingInline: { default: space.s4, [breakpoint.md]: space.s6 },
    position: 'sticky',
    top: 0,
    zIndex: layer.sticky,
  },
  drawer: {
    display: { default: 'flex', [breakpoint.lg]: 'none' },
  },
  home: {
    color: colors.foreground,
    display: 'flex',
    marginInlineEnd: space.s2,
  },
  lockup: {
    height: layout.logo,
  },
  tabs: {
    display: { default: 'none', [breakpoint.md]: 'flex' },
  },
  end: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s2,
    marginInlineStart: 'auto',
  },
});
