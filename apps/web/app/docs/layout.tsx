import type { ReactNode } from 'react';

import { DocsShell } from '@/components/site/docs-shell';
import { contentPages } from '@/site/content';
import { sidebar } from '@/site/nav';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell label="Docs" groups={sidebar(contentPages(), '/docs')}>
      {children}
    </DocsShell>
  );
}
