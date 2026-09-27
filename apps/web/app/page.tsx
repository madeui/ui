import type { Metadata } from 'next';

import { IndexPage } from '@/components/landing/index-page';
import { PageHead } from '@/components/site/page-head';
import { landingJsonLd, landingMetadata } from '@/site/head';

export const metadata: Metadata = landingMetadata();

// The landing's head has always been its own: no feed, Markdown or
// describedby links, only the card and the JSON-LD.
export default function Home() {
  return (
    <>
      <PageHead jsonLd={landingJsonLd()} discovery={false} />
      <IndexPage />
    </>
  );
}
