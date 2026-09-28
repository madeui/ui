'use client';

import { useEffect, useState, type ReactNode } from 'react';

import type { StyleXStyles } from '@stylexjs/stylex';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { useApplePlatform } from '@/components/site/use-apple-platform';
import { Kbd } from '@/components/ui/kbd';
import { loadSearchIndex } from '@/site/search-client';

// Search costs nothing until the reader asks for it: the dialog (and the
// search engine inside it) is a separate chunk that loads on the first open,
// and the index fetch starts at the same moment. Nothing is prefetched on
// hover or focus.
const SearchDialog = dynamic(() => import('@/components/site/search-dialog').then((m) => m.SearchDialog), {
  ssr: false,
});

const isField = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

/**
 * The search dialog behind ⌘K / Ctrl+K (toggles) and / (opens, outside
 * fields): mounted on the first open, then kept for its state.
 */
function useSearchDialog() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  // The index fetch starts with the dialog's code, not after it.
  const show = (next: (open: boolean) => boolean) => {
    void loadSearchIndex().catch(() => {});
    setMounted(true);
    setOpen(next);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // A shifted or alted chord belongs to the browser (Ctrl+Shift+K is a console).
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        show((open) => !open);
      } else if (event.key === '/' && !isField(event.target)) {
        event.preventDefault();
        show(() => true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- show only uses state setters
  }, []);

  return { show, dialog: mounted ? <SearchDialog open={open} onOpenChange={setOpen} /> : null };
}

/**
 * The header's search button, with the search shortcuts. The header renders
 * the button's icon and label and owns its styles; the shortcut hint says
 * Ctrl K off Apple devices.
 */
export function SearchTrigger({ children, style, hintStyle }: { children: ReactNode; style: StyleXStyles; hintStyle: StyleXStyles }) {
  const { show, dialog } = useSearchDialog();
  const hint = useApplePlatform() ? '⌘K' : 'Ctrl K';
  return (
    <>
      <Button variant="outline" aria-label="Search" aria-haspopup="dialog" onClick={() => show(() => true)} style={style}>
        {children}
        <Kbd style={hintStyle}>{hint}</Kbd>
      </Button>
      {dialog}
    </>
  );
}

/** The search shortcuts alone, for a page without the site header (the landing's own button sends ⌘K). */
export function SearchShortcuts() {
  return useSearchDialog().dialog;
}
