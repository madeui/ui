import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DocsPage } from '@/components/site/docs-shell';
import { proseComponents } from '@/components/site/prose';
import type { TocItem } from '@/components/site/toc';
import { contentPages } from '@/site/content';
import { eyebrow, pager } from '@/site/nav';
import { docsSource } from '@/site/source';

// Every docs page is prerendered; an unknown path is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return docsSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const page = docsSource.getPage(slug);
  if (!page) notFound();
  return { title: page.data.title, description: page.data.description };
}

/** The ToC lists sections and subsections (h2, h3). */
const TOC_DEPTHS = new Set([2, 3]);

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const { slug } = await props.params;
  const page = docsSource.getPage(slug);
  if (!page) notFound();
  const pages = contentPages();
  const Body = page.data.body;
  const toc: TocItem[] = page.data.toc
    .filter((item) => TOC_DEPTHS.has(item.depth))
    .map((item) => ({ id: item.url.replace(/^#/u, ''), title: item.title, depth: item.depth }));
  return (
    <DocsPage
      title={page.data.title}
      description={page.data.description}
      eyebrow={eyebrow(pages, page.url)}
      toc={toc}
      {...pager(pages, page.url)}
    >
      <Body components={proseComponents} />
    </DocsPage>
  );
}
