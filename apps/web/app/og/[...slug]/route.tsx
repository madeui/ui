import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

import { OG_FONT, OG_SIZE, OgCardImage } from '@/components/site/og-card';
import { svgSource } from '@/site/brand-assets';
import { contentPages } from '@/site/content';
import { ogCards, ogParams } from '@/site/og';

// /og/<route>.png: one 1200x630 card per page (the landing at /og/index.png),
// prerendered at build from the route list. Any other path is a 404.

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return ogParams(contentPages());
}

// The faces ship with the app (assets/fonts, SIL OFL): the build fetches nothing.
const font = (file: string) => readFile(path.join(process.cwd(), 'assets/fonts', file));
const fonts = Promise.all([font('Geist-Regular.ttf'), font('Geist-Bold.ttf'), font('GeistMono-Regular.ttf')]);

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const card = ogCards(contentPages()).get(`/og/${slug.join('/')}`);
  if (!card) notFound();
  const [regular, bold, mono] = await fonts;
  return new ImageResponse(<OgCardImage card={card} lockup={svgSource('brand/lockup.svg')} />, {
    ...OG_SIZE,
    fonts: [
      { name: OG_FONT.sans, data: regular, weight: 400, style: 'normal' },
      { name: OG_FONT.sans, data: bold, weight: 700, style: 'normal' },
      { name: OG_FONT.mono, data: mono, weight: 400, style: 'normal' },
    ],
  });
}
