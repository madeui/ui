'use client';

import { useEffect, type ReactNode } from 'react';

import type { StyleXStyles } from '@stylexjs/stylex';
import dynamic from 'next/dynamic';

import { openSearch, setSearchOpen, useSearchState } from '@/components/site/search-state';
import { useApplePlatform } from '@/components/site/use-apple-platform';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';

// Search costs nothing until the reader asks for it: the dialog (and the
// search engine inside it) is a separate chunk that loads on the first open,
// and the index fetch (search-state.ts) starts at the same moment. Nothing
// is prefetched on hover or focus.
const SearchDialog = dynamic(() => import('@/components/site/search-dialog').then((m) => m.SearchDialog), {
  ssr: false,
});

// The 404's recovery, lazy like the dialog. It lives here on purpose: the root not-found is in every page's tree, and a client module of its own added ~13 KB to every /docs page.
export const NotFoundRecovery = dynamic(() => import('@/components/site/not-found-recovery').then((m) => m.NotFoundRecovery));

const isField = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

/**
 * The search dialog behind ⌘K / Ctrl+K (toggles) and / (opens, outside
 * fields), and behind every trigger that calls openSearch (search-state.ts):
 * mounted on the first open, then kept for its state. One host per page.
 */
function useSearchDialog() {
  const { mounted, open } = useSearchState();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // A shifted or alted chord belongs to the browser (Ctrl+Shift+K is a console).
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      } else if (event.key === '/' && !isField(event.target)) {
        event.preventDefault();
        openSearch();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return mounted ? <SearchDialog open={open} onOpenChange={setSearchOpen} /> : null;
}

/**
 * The header's search button, with the search shortcuts. The header renders
 * the button's icon and label and owns its styles; the shortcut hint says
 * Ctrl K off Apple devices.
 */
export function SearchTrigger({ children, style, hintStyle }: { children: ReactNode; style: StyleXStyles; hintStyle: StyleXStyles }) {
  const dialog = useSearchDialog();
  const hint = useApplePlatform() ? '⌘K' : 'Ctrl K';
  return (
    <>
      <Button variant="outline" aria-label="Search" aria-haspopup="dialog" onClick={openSearch} style={style}>
        {children}
        <Kbd style={hintStyle}>{hint}</Kbd>
      </Button>
      {dialog}
    </>
  );
}

/** The search dialog and shortcuts alone, for a page without the site header (the landing's own field calls openSearch). */
export function SearchShortcuts() {
  return useSearchDialog();
}
