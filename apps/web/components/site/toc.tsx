'use client';

import { useEffect, useId, useState, type ReactNode } from 'react';

import * as stylex from '@stylexjs/stylex';
import { ChevronDown } from 'lucide-react';

import { duration, fontSize, fontWeight, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, radius } from '@/lib/tokens.stylex';

export interface TocItem {
  id: string;
  title: ReactNode;
  /** 2 for a section, 3 for a subsection. */
  depth: number;
}

/**
 * Scrollspy: the heading the reader is in. That is the last heading whose top
 * has passed the point an in-page link scrolls it to (its scroll-margin-top,
 * just under the sticky header), or the last one once the page is scrolled to
 * the bottom.
 */
function useActiveHeading(ids: string[]): string | undefined {
  const key = ids.join('\n');
  const [active, setActive] = useState<string>();
  useEffect(() => {
    const list = key ? key.split('\n') : [];
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      let current: string | undefined = list[0];
      if (Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight) {
        current = list.at(-1);
      } else {
        for (const id of list) {
          const el = document.getElementById(id);
          if (!el) continue;
          const line = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          if (el.getBoundingClientRect().top > line + 1) break;
          current = id;
        }
      }
      setActive(current);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [key]);
  return active;
}

function TocList({ items, active }: { items: TocItem[]; active: string | undefined }) {
  return (
    <ul {...stylex.props(styles.list)}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={item.id === active ? 'location' : undefined}
            {...stylex.props(styles.link, item.depth > 2 && styles.nested, item.id === active && styles.active)}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The ToC rail from xl: "On this page" with the scrollspy. */
export function Toc({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items.map((item) => item.id));
  return (
    <>
      <p {...stylex.props(styles.title)}>On this page</p>
      <TocList items={items} active={active} />
    </>
  );
}

/**
 * Below xl: the same ToC, collapsed above the article. A plain disclosure
 * (button + region) rather than the registry Collapsible: it needs no
 * animation, and the docs pages' JS budget is tight.
 */
export function MobileToc({ items }: { items: TocItem[] }) {
  const active = useActiveHeading(items.map((item) => item.id));
  const [open, setOpen] = useState(false);
  const panel = useId();
  return (
    <div {...stylex.props(styles.box)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((value) => !value)}
        {...stylex.props(styles.trigger)}
      >
        On this page
        <ChevronDown {...stylex.props(icon.md, styles.chevron)} />
      </button>
      {open ? (
        <div id={panel} {...stylex.props(styles.panel)}>
          <TocList items={items} active={active} />
        </div>
      ) : null}
    </div>
  );
}

const styles = stylex.create({
  title: {
    color: colors.foreground,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.control,
    marginBlockEnd: space.s3,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    color: { default: colors.mutedForeground, ':hover': colors.foreground },
    display: 'block',
    fontSize: fontSize.sm,
    lineHeight: lineHeight.control,
    paddingBlock: space.s15,
    textDecorationLine: 'none',
    transitionDuration: duration.fast,
    transitionProperty: 'color',
  },
  nested: {
    paddingInlineStart: space.s3,
  },
  active: {
    color: colors.foreground,
    fontWeight: fontWeight.medium,
  },
  box: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    paddingInline: space.s4,
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    color: colors.foreground,
    cursor: 'pointer',
    display: 'flex',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    justifyContent: 'space-between',
    lineHeight: lineHeight.control,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    paddingBlock: space.s3,
    width: '100%',
    '--toc-chevron-rotation': { default: null, '[aria-expanded="true"]': '180deg' },
  },
  chevron: {
    color: colors.mutedForeground,
    transform: 'rotate(var(--toc-chevron-rotation, 0deg))',
    transitionDuration: duration.fast,
    transitionProperty: 'transform',
  },
  panel: {
    paddingBlockEnd: space.s3,
  },
});
