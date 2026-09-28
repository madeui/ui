import * as stylex from '@stylexjs/stylex';
import { Search } from 'lucide-react';

import { HeaderTabs } from '@/components/site/header-tabs';
import { IntentPrefetchLink } from '@/components/site/intent-prefetch-link';
import { Lockup } from '@/components/site/lockup';
import { MobileNav } from '@/components/site/mobile-nav';
import { SearchTrigger } from '@/components/site/search-trigger';
import { effects, font, layer, layout } from '@/components/site/site.stylex';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { visuallyHidden } from '@/components/site/visually-hidden';
import { breakpoint, container, space, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, radius } from '@/lib/tokens.stylex';
import type { SidebarGroup } from '@/site/nav';

/**
 * The sticky, translucent site header: the drawer toggle (below lg), the
 * lockup, the section tabs (from md), then search and the theme toggle.
 */
export function SiteHeader({ nav }: { nav?: { label: string; groups: SidebarGroup[] } }) {
  return (
    <>
      <a href="#content" {...stylex.props(styles.skip, visuallyHidden.untilFocus)}>
        Skip to content
      </a>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.drawer)}>
          <MobileNav label={nav?.label ?? 'Docs'} groups={nav?.groups} />
        </div>
        {/* On intent only: prefetching the landing's JS on every docs page costs more than it saves. */}
        <IntentPrefetchLink href="/" aria-label="madeui home" {...stylex.props(styles.home)}>
          <Lockup style={styles.lockup} />
        </IntentPrefetchLink>
        <div {...stylex.props(styles.tabs)}>
          <HeaderTabs />
        </div>
        <div {...stylex.props(styles.end)}>
          <SearchTrigger style={styles.search} hintStyle={styles.searchHint}>
            <Search {...stylex.props(icon.md)} />
            <span {...stylex.props(styles.searchLabel)}>Search</span>
          </SearchTrigger>
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
  // The search button: a pill with its label and shortcut from lg, an icon below.
  search: {
    borderRadius: radius.full,
    color: { default: colors.mutedForeground, ':hover': colors.foreground },
    minWidth: { default: null, [breakpoint.lg]: container.xs },
    paddingInline: space.s3,
  },
  searchLabel: {
    display: { default: 'none', [breakpoint.lg]: 'inline' },
    flexGrow: 1,
    textAlign: 'start',
  },
  searchHint: {
    display: { default: 'none', [breakpoint.lg]: 'inline-flex' },
    fontFamily: font.mono,
  },
});
