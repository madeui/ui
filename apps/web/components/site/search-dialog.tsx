'use client';

import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

import * as stylex from '@stylexjs/stylex';
import { FileText } from 'lucide-react';
import Link from 'next/link';

import { searchLayout } from '@/components/site/site.stylex';
import { Button } from '@/components/ui/button';
import { Command, CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';
import { breakpoint, fontSize, fontWeight, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, radius } from '@/lib/tokens.stylex';
import { highlight, loadSearch, matchSnippet, type LoadedSearch, type SearchHit } from '@/site/search';

// The search dialog, loaded on the first open (search-trigger.tsx). Results
// come from site/search.ts; highlights render as <mark> elements. ⌘J / Ctrl+J
// toggles the preview pane; the choice is remembered in localStorage.

const PREVIEW_KEY = 'search-preview';
const PREVIEW_RADIUS = 600;

function readPreview(): boolean {
  try {
    return localStorage.getItem(PREVIEW_KEY) !== '0';
  } catch {
    return true;
  }
}

function writePreview(on: boolean) {
  try {
    localStorage.setItem(PREVIEW_KEY, on ? '1' : '0');
  } catch {
    // Storage blocked: the choice lasts until the page is left.
  }
}

interface Row {
  route: string;
  title: string;
  hit?: SearchHit;
}

type Load = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: LoadedSearch };

function Marked({ text, query }: { text: string; query: string }) {
  return highlight(text, query).map((segment, i) =>
    segment.mark ? (
      <mark key={i} {...stylex.props(styles.mark)}>
        {segment.text}
      </mark>
    ) : (
      <Fragment key={i}>{segment.text}</Fragment>
    ),
  );
}

const withModifier = (event: MouseEvent) => event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [value, setValue] = useState('');
  const [section, setSection] = useState<string | null>(null);
  const [preview, setPreview] = useState(readPreview);
  const [active, setActive] = useState<Row>();
  const bar = useRef<HTMLDivElement>(null);
  const input = () => bar.current?.querySelector('input');

  // Load (or, after a failure, retry) whenever the dialog opens.
  useEffect(() => {
    if (!open || load.status === 'ready') return;
    let current = true;
    setLoad({ status: 'loading' });
    loadSearch().then(
      (data) => current && setLoad({ status: 'ready', data }),
      () => current && setLoad({ status: 'error' }),
    );
    return () => {
      current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reruns on open only
  }, [open]);

  // Reopening keeps the last query, selected, so typing replaces it.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => input()?.select());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const query = value.trim();
  const data = load.status === 'ready' ? load.data : undefined;
  const result = useMemo(() => (data && query ? data.search(query, section ?? undefined) : undefined), [data, query, section]);
  // A section picked for an earlier query that the new matches lack would
  // silently empty the list (its pill is gone): drop it.
  if (section && result && !result.sections.some((entry) => entry.label === section)) setSection(null);

  // Stable between renders: Base UI re-highlights when the items change.
  const rows = useMemo<Row[]>(
    () =>
      query
        ? (result?.hits ?? []).map((hit) => ({ route: hit.route, title: hit.title, hit }))
        : (data?.popular ?? []).map(({ route, title }) => ({ route, title })),
    [query, result, data],
  );
  const message = !query
    ? ''
    : load.status === 'loading'
      ? '…'
      : load.status === 'error'
        ? 'Something went wrong. Please try again.'
        : rows.length === 0
          ? 'No results found.'
          : '';
  const pills = result && result.sections.length >= 2 ? result.sections : [];
  const shown = active?.hit && rows.some((row) => row.route === active.route) ? active.hit : undefined;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'j' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      setPreview((on) => {
        writePreview(!on);
        return !on;
      });
    }
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search docs"
      description="Search the documentation by title, description and text."
      style={styles.dialog}
    >
      <div data-search-dialog="" onKeyDown={onKeyDown} {...stylex.props(styles.frame)}>
        <Command
          items={rows}
          mode="none"
          autoHighlight="always"
          value={value}
          onValueChange={(next, details) => {
            if (details.reason === 'input-change' || details.reason === 'input-clear') setValue(next);
          }}
          onItemHighlighted={(row) => setActive((current) => (current === row ? current : (row as Row | undefined)))}
          itemToStringValue={(row) => (row as Row).title}
          style={styles.command}
        >
          <div ref={bar} {...stylex.props(styles.bar)}>
            <CommandInput aria-label="Search docs" placeholder="Search documentation…" style={styles.input} />
            <Kbd>Esc</Kbd>
          </div>
          <div {...stylex.props(styles.grid, preview && styles.withPreview)}>
            <div {...stylex.props(styles.results)}>
              {pills.length > 0 ? (
                <div data-search-pills="" {...stylex.props(styles.pills)}>
                  {[{ label: 'All', count: pills.reduce((sum, entry) => sum + entry.count, 0), value: null }, ...pills.map((entry) => ({ ...entry, value: entry.label }))].map(
                    (pill) => (
                      <Button
                        key={pill.label}
                        size="xs"
                        variant={section === pill.value ? 'primary' : 'outline'}
                        aria-pressed={section === pill.value}
                        onClick={() => {
                          setSection(pill.value);
                          input()?.focus();
                        }}
                        style={styles.pill}
                      >
                        {pill.label} <span {...stylex.props(styles.count)}>{pill.count}</span>
                      </Button>
                    ),
                  )}
                </div>
              ) : null}
              <CommandList aria-label="Search docs" style={styles.list}>
                {rows.length > 0 ? (
                  <CommandGroup heading={query ? 'Results' : 'Popular'}>
                    {rows.map((row) => (
                      <CommandItem
                        key={row.route}
                        value={row}
                        render={<Link href={row.route} prefetch={false} />}
                        onClick={(event: MouseEvent) => {
                          if (!withModifier(event)) onOpenChange(false);
                        }}
                        style={styles.row}
                      >
                        <FileText {...stylex.props(icon.md, styles.rowIcon)} />
                        <span {...stylex.props(styles.rowText)}>
                          <span data-search-title="" {...stylex.props(styles.rowTitle)}>
                            {row.hit ? <Marked text={row.title} query={query} /> : row.title}
                          </span>
                          {row.hit?.excerpt ? (
                            <span data-search-excerpt="" {...stylex.props(styles.rowExcerpt)}>
                              <Marked text={row.hit.excerpt} query={query} />
                            </span>
                          ) : null}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}
              </CommandList>
              <p data-search-message="" {...stylex.props(styles.message, message === '' && styles.hidden)}>
                {message}
              </p>
            </div>
            <div data-search-preview="" {...stylex.props(styles.preview, preview && styles.previewOn)}>
              {shown ? (
                <>
                  <h3 {...stylex.props(styles.previewTitle)}>
                    <Marked text={shown.title} query={query} />
                  </h3>
                  <div {...stylex.props(styles.previewBody)}>
                    <Marked text={shown.content ? matchSnippet(shown.content, query, PREVIEW_RADIUS) : shown.excerpt} query={query} />
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div {...stylex.props(styles.footer)}>
            <span {...stylex.props(styles.hint)}>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              navigate
            </span>
            <span {...stylex.props(styles.hint)}>
              <Kbd>↵</Kbd>
              open
            </span>
            <span {...stylex.props(styles.hint, styles.previewHint)}>
              <Kbd>{/mac|iphone|ipad|ipod/iu.test(navigator.platform) ? '⌘J' : 'Ctrl J'}</Kbd>
              preview
            </span>
          </div>
        </Command>
      </div>
    </CommandDialog>
  );
}

const styles = stylex.create({
  dialog: {
    bottom: { default: 'auto', [breakpoint.sm]: 0 },
    height: searchLayout.height,
    maxHeight: searchLayout.maxHeight,
    top: { default: searchLayout.top, [breakpoint.sm]: 0 },
    width: searchLayout.width,
  },
  frame: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
  },
  command: {
    padding: 0,
  },
  bar: {
    alignItems: 'center',
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: stroke.border,
    display: 'flex',
    gap: space.s2,
    paddingBlock: space.s2,
    paddingInline: space.s3,
  },
  input: {
    flexGrow: 1,
    margin: 0,
  },
  grid: {
    display: 'grid',
    flexGrow: 1,
    gridTemplateColumns: 'minmax(0, 1fr)',
    minHeight: 0,
  },
  withPreview: {
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [breakpoint.md]: `${searchLayout.results} minmax(0, 1fr)` },
  },
  results: {
    borderInlineEndColor: colors.border,
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: { default: 0, [breakpoint.md]: stroke.border },
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  pills: {
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: stroke.border,
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s15,
    paddingBlock: space.s2,
    paddingInline: space.s3,
  },
  pill: {
    borderRadius: radius.full,
  },
  count: {
    opacity: 0.6,
  },
  list: {
    flexGrow: 1,
    maxHeight: 'none',
    minHeight: 0,
    padding: space.s2,
  },
  row: {
    alignItems: 'flex-start',
    color: 'inherit',
    cursor: 'pointer',
    gap: space.s25,
    paddingBlock: space.s2,
    paddingInline: space.s25,
    textDecorationLine: 'none',
  },
  rowIcon: {
    color: colors.mutedForeground,
    marginBlockStart: space.s05,
  },
  rowText: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  rowTitle: {
    color: colors.foreground,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowExcerpt: {
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    color: colors.mutedForeground,
    display: '-webkit-box',
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
    marginBlockStart: space.s05,
    overflow: 'hidden',
  },
  mark: {
    backgroundColor: `color-mix(in oklab, ${colors.foreground} ${searchLayout.mark}, transparent)`,
    borderRadius: radius.xs,
    color: 'inherit',
  },
  message: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    margin: 0,
    paddingBlock: space.s6,
    paddingInline: space.s4,
    textAlign: 'center',
  },
  hidden: {
    display: 'none',
  },
  preview: {
    display: 'none',
    minHeight: 0,
    overflowY: 'auto',
    padding: space.s5,
    scrollbarColor: `${colors.border} transparent`,
    scrollbarWidth: 'thin',
  },
  previewOn: {
    display: { default: 'none', [breakpoint.md]: 'block' },
  },
  previewTitle: {
    color: colors.foreground,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.tight,
    margin: 0,
    marginBlockEnd: space.s3,
  },
  previewBody: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
  },
  footer: {
    alignItems: 'center',
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: stroke.border,
    color: colors.mutedForeground,
    display: 'flex',
    fontSize: fontSize.xs,
    gap: space.s3,
    justifyContent: 'flex-end',
    paddingBlock: space.s2,
    paddingInline: space.s3,
  },
  hint: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s1,
  },
  previewHint: {
    display: { default: 'none', [breakpoint.md]: 'flex' },
  },
});
