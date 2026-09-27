import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DocsPage } from '@/components/site/docs-shell';
import { proseComponents } from '@/components/site/prose';
import type { TocItem } from '@/components/site/toc';
import { contentPages } from '@/site/content';
import { pager } from '@/site/nav';
import { changelogSource } from '@/site/source';

// Every entry is prerendered; an unknown slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return changelogSource.getPages().map((page) => ({ slug: page.slugs.join('/') }));
}

export async function generateMetadata(props: PageProps<'/changelog/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const page = changelogSource.getPage([slug]);
  if (!page) notFound();
  return { title: page.data.title, description: page.data.description };
}

/** The ToC lists sections and subsections (h2, h3). */
const TOC_DEPTHS = new Set([2, 3]);

/** One entry: title and body, prev/next between entries; no eyebrow. */
export default async function ChangelogEntryPage(props: PageProps<'/changelog/[slug]'>) {
  const { slug } = await props.params;
  const page = changelogSource.getPage([slug]);
  if (!page) notFound();
  const Body = page.data.body;
  const toc: TocItem[] = page.data.toc
    .filter((item) => TOC_DEPTHS.has(item.depth))
    .map((item) => ({ id: item.url.replace(/^#/u, ''), title: item.title, depth: item.depth }));
  return (
    <DocsPage title={page.data.title} toc={toc} {...pager(contentPages(), page.url)}>
      <Body components={proseComponents} />
    </DocsPage>
  );
}
