'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { landing } from '@/components/landing/landing.stylex';
import { SearchIcon } from '@/components/landing/icons';
import { Kbd } from '@/components/ui/kbd';
import { breakpoint, duration, fontSize, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

const HOVER = '@media (hover: hover) and (pointer: fine)' as const;

const isApple = () => /mac|iphone|ipad|ipod/iu.test(navigator.platform);

/**
 * The landing header's search field. Search opens on ⌘K / Ctrl K anywhere
 * on the site; this is the pointer path, and it sends the same shortcut.
 */
export function SearchTrigger() {
  const [modifier, setModifier] = React.useState('⌘');

  React.useEffect(() => {
    if (!isApple()) setModifier('Ctrl');
  }, []);

  const open = () => {
    const apple = isApple();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: apple, ctrlKey: !apple, bubbles: true }),
    );
  };

  return (
    <button type="button" onClick={open} aria-label="Search docs" {...stylex.props(styles.search)}>
      <SearchIcon size={16} />
      <span {...stylex.props(styles.label)}>Search docs…</span>
      <span {...stylex.props(styles.kbd)}>
        <Kbd>{modifier}</Kbd>
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
      [HOVER]: { default: null, ':hover': colors.mutedForeground },
    },
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ':hover': colors.foreground },
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
