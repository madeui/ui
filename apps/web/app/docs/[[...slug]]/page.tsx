import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { proseComponents } from '@/components/site/prose';
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

export default async function DocsPage(props: PageProps<'/docs/[[...slug]]'>) {
  const { slug } = await props.params;
  const page = docsSource.getPage(slug);
  if (!page) notFound();
  const Body = page.data.body;
  return (
    <main>
      <article>
        <h1>{page.data.title}</h1>
        {page.data.description ? <p>{page.data.description}</p> : null}
        <Body components={proseComponents} />
      </article>
    </main>
  );
}
