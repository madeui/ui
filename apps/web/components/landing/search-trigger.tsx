'use client';

import * as stylex from '@stylexjs/stylex';

import { landing, media } from '@/components/landing/landing.stylex';
import { SearchIcon } from '@/components/landing/icons';
import { openSearch } from '@/components/site/search-state';
import { useApplePlatform } from '@/components/site/use-apple-platform';
import { Kbd } from '@/components/ui/kbd';
import { breakpoint, duration, fontSize, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

/**
 * The landing header's search field. Search opens on ⌘K / Ctrl K anywhere
 * on the site; this is the pointer path. The dialog itself is hosted by
 * SearchShortcuts (site/search-trigger.tsx), which the landing renders too.
 */
export function SearchTrigger() {
  const apple = useApplePlatform();

  return (
    <button type="button" onClick={openSearch} aria-label="Search docs" {...stylex.props(styles.search)}>
      <SearchIcon size={16} />
      <span {...stylex.props(styles.label)}>Search docs…</span>
      <span {...stylex.props(styles.kbd)}>
        <Kbd>{apple ? '⌘' : 'Ctrl'}</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}

const styles = stylex.create({
  search: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: {
      default: colors.border,
      [media.hover]: { default: null, ':hover': colors.mutedForeground },
    },
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: {
      default: colors.mutedForeground,
      [media.hover]: { default: null, ':hover': colors.foreground },
    },
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: fontSize.sm,
    gap: space.s2,
    height: space.s9,
    marginRight: space.s1,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: stroke.focus,
    paddingInline: { default: 0, [breakpoint.sm]: space.s3 },
    justifyContent: 'center',
    minWidth: { default: 0, [breakpoint.lg]: landing.searchWidth },
    width: { default: space.s9, [breakpoint.sm]: 'auto' },
    transitionDuration: duration.fast,
    transitionProperty: 'color, border-color',
  },
  label: {
    display: { default: 'none', [breakpoint.sm]: 'inline' },
    flex: 1,
    textAlign: 'left',
  },
  kbd: {
    display: { default: 'none', [breakpoint.sm]: 'inline-flex' },
    gap: space.s05,
  },
});
