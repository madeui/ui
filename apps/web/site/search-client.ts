import type { SearchIndex } from './search-index.ts';

// The index fetch, shared by the search trigger (which starts it on the first
// open, alongside the dialog's code) and everything that searches. A failed
// fetch is forgotten, so the next open retries.

export const SEARCH_INDEX_URL = '/search.json';

let index: Promise<SearchIndex> | undefined;

export function loadSearchIndex(): Promise<SearchIndex> {
  index ??= fetch(SEARCH_INDEX_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`${SEARCH_INDEX_URL}: ${response.status}`);
      return response.json() as Promise<SearchIndex>;
    })
    .catch((error: unknown) => {
      index = undefined;
      throw error;
    });
  return index;
}
