import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

import { OG_SIZE, OgCardImage } from '@/components/site/og-card';
import { svgSource } from '@/site/brand-assets';
import { contentPages } from '@/site/content';
import { ogCards, ogParams } from '@/site/og';
import { ogFonts } from '@/site/og-fonts';

// /og/<route>.png: one 1200x630 card per page (the landing at /og/index.png),
// prerendered at build from the route list. Any other path is a 404.

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return ogParams(contentPages());
}

const fonts = ogFonts();

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const card = ogCards(contentPages()).get(`/og/${slug.join('/')}`);
  if (!card) notFound();
  return new ImageResponse(
    <OgCardImage card={card} lockup={svgSource('brand/lockup.svg')} glyph={svgSource('brand/glyph.svg')} />,
    { ...OG_SIZE, fonts: await fonts },
  );
}
