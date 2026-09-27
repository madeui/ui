import type { ReactNode } from 'react';

import { DocsShell } from '@/components/site/docs-shell';
import { contentPages } from '@/site/content';
import { sidebar } from '@/site/nav';

// A changelog entry reads like a docs page: the docs layout with the
// Changelog tab's sidebar (its entries, newest first). The index
// (/changelog) sits outside this group: it has no sidebar.
export default function ChangelogEntryLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell label="Changelog" groups={sidebar(contentPages(), '/changelog')}>
      {children}
    </DocsShell>
  );
}
