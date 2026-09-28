import { useSyncExternalStore } from 'react';

import { loadSearchIndex } from '@/site/search-client';

// Whether the search dialog is open, shared by everything that opens it: the
// header's search button, the landing's search field and the keyboard
// shortcuts. Small on purpose: a trigger imports this, never the dialog,
// which search-trigger.tsx loads on the first open.

interface SearchState {
  /** The dialog has been opened once: its code is loaded and it stays mounted, keeping its query. */
  mounted: boolean;
  open: boolean;
}

const initial: SearchState = { mounted: false, open: false };
let state = initial;
const listeners = new Set<() => void>();

/** Opens, closes or (with an updater) toggles the search. The index fetch starts with the first open. */
export function setSearchOpen(next: boolean | ((open: boolean) => boolean)) {
  const open = typeof next === 'function' ? next(state.open) : next;
  if (open) void loadSearchIndex().catch(() => {});
  if (open === state.open) return;
  state = { mounted: state.mounted || open, open };
  for (const listener of listeners) listener();
}

/** The search entry point for any trigger. */
export const openSearch = () => setSearchOpen(true);

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** The dialog host's view of the state; the server always renders it closed and unmounted. */
export function useSearchState(): SearchState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
}
