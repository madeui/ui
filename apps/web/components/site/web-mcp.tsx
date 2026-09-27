'use client';

import { useEffect } from 'react';

import type { ModelContext } from '@/site/webmcp';

type WithContext = { modelContext?: ModelContext };

/**
 * Registers the docs' WebMCP tools when the browser exposes a model context
 * (on `navigator` in Chrome's preview, on `document` in the draft spec).
 * Everywhere else it only checks: the tools and the search they use never load.
 */
export function WebMcp() {
  useEffect(() => {
    const context = (navigator as Navigator & WithContext).modelContext ?? (document as Document & WithContext).modelContext;
    if (!context) return;
    void import('@/site/webmcp').then((webmcp) => {
      // The search engine and index load on the first search_docs call.
      const loadSearch = async () => (await (await import('@/site/search')).loadSearch()).search;
      webmcp.registerWebMcpTools(webmcp.webMcpTools({ loadSearch }), context);
    });
  }, []);
  return null;
}
