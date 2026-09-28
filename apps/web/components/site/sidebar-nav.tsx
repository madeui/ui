'use client';

import { useState, type ReactNode } from 'react';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { visuallyHidden } from '@/components/site/visually-hidden';
import { duration, fontSize, fontWeight, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';
import type { SidebarGroup } from '@/site/nav';

/**
 * The sidebar of a header tab: group headings and links, the current page
 * marked with aria-current. It lives in the docs layout, so it keeps its
 * scroll position across client navigations; when the current page's link is
 * out of view on load (or when the drawer opens), it is scrolled to the
 * middle.
 */
export function SidebarNav({
  label,
  groups,
  onNavigate,
}: {
  label: string;
  groups: SidebarGroup[];
  /** Called when a link is followed (the mobile drawer closes). */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} {...stylex.props(styles.nav)}>
      {groups.map((group, index) => (
        <div key={group.label ?? index} {...stylex.props(styles.group)}>
          {group.label === undefined ? null : <p {...stylex.props(styles.heading)}>{group.label}</p>}
          <ul {...stylex.props(styles.list)}>
            {group.links.map((link) => (
              <li key={link.route}>
                <SidebarLink href={link.route} current={link.route === pathname} onNavigate={onNavigate}>
                  {link.title}
                  {link.badge === undefined ? null : (
                    <>
                      <span aria-hidden {...stylex.props(styles.dot)} />
                      <span {...stylex.props(visuallyHidden.always)}>{link.badge}</span>
                    </>
                  )}
                </SidebarLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/**
 * A sidebar link. Prefetches on hover or focus rather than on entering the
 * viewport: the sidebar shows dozens of links at once, and only the one the
 * reader is about to follow is worth fetching.
 */
function SidebarLink({
  href,
  current,
  onNavigate,
  children,
}: {
  href: string;
  current: boolean;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const [intent, setIntent] = useState(false);
  const warm = () => setIntent(true);
  return (
    <Link
      href={href}
      prefetch={intent ? null : false}
      onMouseEnter={warm}
      onFocus={warm}
      onClick={onNavigate}
      aria-current={current ? 'page' : undefined}
      ref={current ? revealInScrollParent : undefined}
      {...stylex.props(styles.link, current && styles.current)}
    >
      {children}
    </Link>
  );
}

/** Scrolls the nearest scrolling ancestor so the element sits in its middle, if it is out of view. */
function revealInScrollParent(el: HTMLElement | null) {
  if (!el) return;
  let box = el.parentElement;
  while (box && !(box.scrollHeight > box.clientHeight && /auto|scroll/.test(getComputedStyle(box).overflowY))) {
    box = box.parentElement;
  }
  if (!box || box === document.scrollingElement) return;
  const item = el.getBoundingClientRect();
  const view = box.getBoundingClientRect();
  if (item.top >= view.top && item.bottom <= view.bottom) return;
  box.scrollTop += item.top - view.top - (view.height - item.height) / 2;
}

const styles = stylex.create({
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.control,
    paddingBlock: space.s15,
    paddingInline: space.s2,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.px,
  },
  link: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': colors.accent },
    borderRadius: radius.md,
    color: colors.foreground,
    display: 'flex',
    fontSize: fontSize.sm,
    gap: space.s2,
    height: space.s8,
    lineHeight: lineHeight.control,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: `calc(-1 * ${stroke.focus})`,
    paddingInline: space.s2,
    textDecorationLine: 'none',
    transitionDuration: duration.fast,
    transitionProperty: 'background-color',
  },
  current: {
    backgroundColor: colors.accent,
    fontWeight: fontWeight.medium,
  },
  dot: {
    backgroundColor: colors.chart1,
    borderRadius: radius.full,
    flexShrink: 0,
    height: space.s15,
    width: space.s15,
  },
});
